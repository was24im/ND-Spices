import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const updateStockSchema = z.object({
  variantId: z.string().min(1),
  stockQuantity: z.number().int().nonnegative(),
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
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { stockQuantity: "asc" },
    });

    return NextResponse.json({ success: true, variants });
  } catch (error) {
    console.error("Admin inventory fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = updateStockSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { variantId, stockQuantity } = validated.data;

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error: any) {
    console.error("Admin stock update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update stock" },
      { status: 500 }
    );
  }
}
