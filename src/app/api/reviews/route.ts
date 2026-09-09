import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Review must be at least 5 characters long"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    const totalCount = reviews.length;
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalCount > 0 ? Number((ratingSum / totalCount).toFixed(1)) : 5.0;

    const breakdown = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return NextResponse.json({
      success: true,
      reviews,
      metrics: {
        totalReviews: totalCount,
        averageRating,
        breakdown,
      },
    });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Please log in to review this spice." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createReviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { productId, rating, comment } = validated.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User profile not found." }, { status: 404 });
    }

    // Check if the user has purchased this product (Verified Purchase Check)
    const verifiedOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        orderItems: {
          some: {
            productVariant: {
              productId: productId,
            },
          },
        },
      },
    });

    const isVerifiedPurchase = !!verifiedOrder || user.role === "ADMIN";

    // Create review in database
    const newReview = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          productId,
          userId: user.id,
          rating,
          comment,
          isVerifiedPurchase,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });

      // Recalculate and update aggregate rating & numReviews on Product
      const allProductReviews = await tx.review.findMany({
        where: { productId },
        select: { rating: true },
      });

      const totalNumReviews = allProductReviews.length;
      const avg =
        totalNumReviews > 0
          ? Number(
              (
                allProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalNumReviews
              ).toFixed(1)
            )
          : rating;

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: avg as any,
          numReviews: totalNumReviews,
        },
      });

      return review;
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Thank you! Your spice rating and review have been recorded.",
    });
  } catch (error: any) {
    console.error("Submit review error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
