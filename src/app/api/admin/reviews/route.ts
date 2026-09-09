import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, slug: true, images: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { reviewId, isApproved } = body;

    if (!reviewId || isApproved === undefined) {
      return NextResponse.json({ success: false, error: "Review ID and isApproved required" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const rev = await tx.review.update({
        where: { id: reviewId },
        data: { isApproved },
        include: { product: true },
      });

      // Recalculate product rating considering only approved reviews
      const approvedReviews = await tx.review.findMany({
        where: { productId: rev.productId, isApproved: true },
        select: { rating: true },
      });

      const count = approvedReviews.length;
      const avg = count > 0 ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count : 5.0;

      await tx.product.update({
        where: { id: rev.productId },
        data: { rating: avg as any, numReviews: count },
      });

      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Super Admin",
          userEmail: session?.user?.email,
          userRole,
          action: isApproved ? "APPROVE_REVIEW" : "REJECT_REVIEW",
          module: "REVIEWS",
          targetId: reviewId,
          targetName: `Review for ${rev.product.name}`,
          newValue: { isApproved },
        },
      });

      return rev;
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Review ID required" }, { status: 400 });
  }

  try {
    const rev = await prisma.review.findUnique({ where: { id } });
    if (rev) {
      await prisma.$transaction([
        prisma.review.delete({ where: { id } }),
        prisma.auditLog.create({
          data: {
            userId,
            userName: session?.user?.name || "Super Admin",
            userEmail: session?.user?.email,
            userRole,
            action: "DELETE_REVIEW",
            module: "REVIEWS",
            targetId: id,
          },
        }),
      ]);
    }
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
