import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions, isStaffOrAdmin, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { InvoiceStatus } from "@prisma/client";

const invoiceItemSchema = z.object({
  description: z.string().min(2),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const createInvoiceSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional().nullable(),
  billingAddress: z.string().min(5),
  taxPercent: z.number().nonnegative().default(5.0),
  discountAmount: z.number().nonnegative().default(0),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.ISSUED),
  dueDate: z.string().optional().nullable(),
  paymentMethod: z.string().default("Bank Transfer (NEFT/RTGS)"),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1, "Invoice must contain at least one item"),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!isStaffOrAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        items: true,
      },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isStaffOrAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createInvoiceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      billingAddress,
      taxPercent,
      discountAmount,
      status,
      dueDate,
      paymentMethod,
      notes,
      items,
    } = validated.data;

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxAmount = (subtotal * taxPercent) / 100;
    const finalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newInvoice = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerName,
          customerEmail,
          customerPhone,
          billingAddress,
          subtotal: subtotal as any,
          taxPercent,
          taxAmount: taxAmount as any,
          discountAmount: discountAmount as any,
          finalAmount: finalAmount as any,
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          paymentMethod,
          notes,
          createdById: userId || null,
          items: {
            create: items.map((i) => ({
              description: i.description,
              quantity: i.quantity,
              unitPrice: i.unitPrice as any,
              totalPrice: (i.unitPrice * i.quantity) as any,
            })),
          },
        },
        include: {
          createdBy: { select: { id: true, name: true } },
          items: true,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Staff",
          userEmail: session?.user?.email,
          userRole,
          action: "CREATE_INVOICE",
          module: "BILLING",
          targetId: invoice.id,
          targetName: invoice.invoiceNumber,
          newValue: { invoiceNumber, customerName, finalAmount, status },
        },
      });

      return invoice;
    });

    return NextResponse.json({ success: true, invoice: newInvoice });
  } catch (error: any) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isStaffOrAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { invoiceId, status } = body;

    if (!invoiceId || !status) {
      return NextResponse.json(
        { success: false, error: "Invoice ID and status required" },
        { status: 400 }
      );
    }

    const previous = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!previous) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: status as InvoiceStatus },
        include: { items: true, createdBy: true },
      });

      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Staff",
          userEmail: session?.user?.email,
          userRole,
          action: "UPDATE_INVOICE_STATUS",
          module: "BILLING",
          targetId: invoiceId,
          targetName: inv.invoiceNumber,
          previousValue: { status: previous.status },
          newValue: { status: inv.status },
        },
      });

      return inv;
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json(
      { success: false, error: "Only Super Admin can delete billing invoices" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Invoice ID required" }, { status: 400 });
  }

  try {
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
