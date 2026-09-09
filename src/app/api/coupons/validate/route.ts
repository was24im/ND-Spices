import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json(
        { success: false, error: "Promo code and subtotal amount are required" },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();

    // 1. Query Neon PostgreSQL database
    let coupon = null;
    try {
      coupon = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
      });
    } catch (e) {
      console.error("Database coupon lookup error:", e);
    }

    // 2. Fallback static promo codes if DB offline
    if (!coupon) {
      if (normalizedCode === "WELCOME10") {
        coupon = {
          id: "welcome10",
          code: "WELCOME10",
          discountPercent: 10,
          discountAmount: null,
          minOrderValue: 499 as any,
          maxDiscount: 150 as any,
          isActive: true,
          expiresAt: null,
          usageLimit: 500,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else if (normalizedCode === "SPICEKING") {
        coupon = {
          id: "spiceking",
          code: "SPICEKING",
          discountPercent: null,
          discountAmount: 150 as any,
          minOrderValue: 999 as any,
          maxDiscount: null,
          isActive: true,
          expiresAt: null,
          usageLimit: 200,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else if (normalizedCode === "FREESHIP") {
        coupon = {
          id: "freeship",
          code: "FREESHIP",
          discountPercent: null,
          discountAmount: 60 as any,
          minOrderValue: 299 as any,
          maxDiscount: null,
          isActive: true,
          expiresAt: null,
          usageLimit: 1000,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid or inactive promo code" },
        { status: 404 }
      );
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: "This promo code has expired" },
        { status: 400 }
      );
    }

    // Check minimum order value
    const minVal = coupon.minOrderValue ? Number(coupon.minOrderValue) : 0;
    if (subtotal < minVal) {
      return NextResponse.json(
        {
          success: false,
          error: `Promo code requires a minimum order value of ₹${minVal}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }
    } else if (coupon.discountAmount) {
      discount = Number(coupon.discountAmount);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountAmount: discount,
        discountPercent: coupon.discountPercent,
        message: `Promo code ${coupon.code} applied! Saved ₹${discount}`,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during coupon validation" },
      { status: 500 }
    );
  }
}
