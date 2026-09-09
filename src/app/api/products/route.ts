import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    const whereClause: any = {};

    if (categorySlug && categorySlug !== "all") {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { origin: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          variants: {
            orderBy: { price: "asc" },
          },
          reviews: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { isFeatured: "desc" },
      }),
      prisma.category.findMany(),
    ]);

    if (products.length > 0) {
      return NextResponse.json({
        success: true,
        source: "neon-db",
        data: {
          products,
          categories,
          total: products.length,
        },
      });
    }
  } catch (error) {
    console.error("Neon DB query error, falling back to mock catalog:", error);
  }

  // Fallback to static mock catalog
  let fallbackProducts = [...MOCK_PRODUCTS];

  if (categorySlug && categorySlug !== "all") {
    const cat = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
    if (cat) {
      fallbackProducts = fallbackProducts.filter((p) => p.categoryId === cat.id);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    fallbackProducts = fallbackProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    source: "static-fallback",
    data: {
      products: fallbackProducts,
      categories: MOCK_CATEGORIES,
      total: fallbackProducts.length,
    },
  });
}
