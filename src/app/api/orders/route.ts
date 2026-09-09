import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client";

const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  name: z.string(),
  weight: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Basket cannot be empty"),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(5),
    country: z.string().default("India"),
  }),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
  deliverySpeed: z.enum(["standard", "express"]).default("standard"),
  couponCode: z.string().optional().nullable(),
  discountAmount: z.number().nonnegative().default(0),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const validated = createOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentMethod, deliverySpeed, couponCode, discountAmount } =
      validated.data;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const baseShipping = subtotal >= 499 ? 0 : 60;
    const shippingFee = deliverySpeed === "express" ? baseShipping + 120 : baseShipping;
    const finalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (user) userId = user.id;
    }

    // Execute atomic transaction for Order creation and stock deduction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify stock availability for all items
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stockQuantity: true, sku: true },
        });

        if (!variant) {
          throw new Error(`Product package for ${item.name} (${item.weight}) not found`);
        }

        if (variant.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.name} (${item.weight}). Only ${variant.stockQuantity} units available.`
          );
        }
      }

      // 2. Generate unique order number
      const orderNumber = `ND-${new Date().getFullYear()}-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      // 3. Create Order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount: subtotal as any,
          discountAmount: discountAmount as any,
          shippingFee: shippingFee as any,
          finalAmount: finalAmount as any,
          paymentMethod: paymentMethod as PaymentMethod,
          paymentStatus:
            paymentMethod === "RAZORPAY" ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          orderStatus: OrderStatus.PLACED,
          orderItems: {
            create: items.map((item) => ({
              productVariantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.price as any,
              totalPrice: (item.price * item.quantity) as any,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              productVariant: {
                include: { product: true },
              },
            },
          },
        },
      });

      // 4. Atomically decrement stockQuantity for each variant
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    // 5. Send order confirmation email asynchronously
    sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      items: items.map((i) => ({
        name: i.name,
        weight: i.weight,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal,
      shipping: shippingFee,
      total: finalAmount,
      shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}`,
    }).catch((err) => console.error("Email dispatch warning:", err));

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      order,
    });
  } catch (error: any) {
    console.error("Atomic order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
