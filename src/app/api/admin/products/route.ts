import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const variantSchema = z.object({
  id: z.string().optional(),
  weight: z.string().min(1),
  price: z.number().positive(),
  discountedPrice: z.number().optional().nullable(),
  stockQuantity: z.number().int().nonnegative(),
  sku: z.string().min(2),
});

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  origin: z.string().min(2),
  images: z.array(z.string()).min(1),
  isFeatured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  variants: z.array(variantSchema).min(1),
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
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        variants: true,
      },
    });

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, products, categories });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = productSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, slug, description, categoryId, origin, images, isFeatured, inStock, variants } =
      validated.data;

    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug,
          description,
          categoryId,
          origin,
          images,
          isFeatured,
          inStock,
          variants: {
            create: variants.map((v) => ({
              weight: v.weight,
              price: v.price as any,
              discountedPrice: v.discountedPrice as any,
              stockQuantity: v.stockQuantity,
              sku: v.sku,
            })),
          },
        },
        include: {
          category: true,
          variants: true,
        },
      });
      return product;
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Admin product creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = productSchema.safeParse(body);

    if (!validated.success || !validated.data.id) {
      return NextResponse.json(
        { success: false, error: "Valid product ID is required for update" },
        { status: 400 }
      );
    }

    const { id, name, slug, description, categoryId, origin, images, isFeatured, inStock, variants } =
      validated.data;

    const updated = await prisma.$transaction(async (tx) => {
      // Update product info
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          categoryId,
          origin,
          images,
          isFeatured,
          inStock,
        },
      });

      // Update or create variants
      for (const v of variants) {
        if (v.id) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              weight: v.weight,
              price: v.price as any,
              discountedPrice: v.discountedPrice as any,
              stockQuantity: v.stockQuantity,
              sku: v.sku,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              weight: v.weight,
              price: v.price as any,
              discountedPrice: v.discountedPrice as any,
              stockQuantity: v.stockQuantity,
              sku: v.sku,
            },
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { category: true, variants: true },
      });
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Admin product update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Admin product delete error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
