import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  nameHi: z.string().optional().nullable(),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  descriptionHi: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isSuperAdmin((session.user as any)?.role)) {
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
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Admin categories fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = categorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, nameHi, slug, description, descriptionHi, image, order } = validated.data;

    // Check slug conflict
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        nameHi: nameHi || null,
        slug,
        description: description || null,
        descriptionHi: descriptionHi || null,
        image: image || null,
        displayOrder: order || 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
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
    const validated = categorySchema.safeParse(body);

    if (!validated.success || !validated.data.id) {
      return NextResponse.json(
        { success: false, error: "Category ID and valid data required" },
        { status: 400 }
      );
    }

    const { id, name, nameHi, slug, description, descriptionHi, image, order } = validated.data;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        nameHi: nameHi || null,
        slug,
        description: description || null,
        descriptionHi: descriptionHi || null,
        image: image || null,
        displayOrder: order || 0,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID required" }, { status: 400 });
    }

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category because it contains ${productCount} products. Move or delete them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
