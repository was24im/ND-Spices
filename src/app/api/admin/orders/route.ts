import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  orderStatus: z.nativeEnum(OrderStatus),
  trackingNumber: z.string().optional().nullable(),
  courierName: z.string().optional().nullable(),
});

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

export async function GET(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        address: true,
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
    console.error("Admin fetch orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = updateOrderStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { orderId, orderStatus } = validated.data;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
      },
      include: {
        user: true,
        orderItems: {
          include: { productVariant: { include: { product: true } } },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${orderStatus}`,
    });
  } catch (error: any) {
    console.error("Admin order status update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
