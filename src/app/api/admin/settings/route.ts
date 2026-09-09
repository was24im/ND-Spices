import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const settings = await prisma.websiteSettings.findUnique({
      where: { id: "default-settings" },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      storeName,
      tagLine,
      contactEmail,
      contactPhone,
      address,
      gstNumber,
      fssaiNumber,
      instagramUrl,
      facebookUrl,
      whatsappNumber,
      isWhatsappEnabled,
      freeShippingMin,
      flatShippingRate,
      taxRatePercent,
      isCodEnabled,
      isRazorpayEnabled,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImageUrl,
    } = body;

    const previous = await prisma.websiteSettings.findUnique({ where: { id: "default-settings" } });

    const updated = await prisma.$transaction(async (tx) => {
      const saved = await tx.websiteSettings.upsert({
        where: { id: "default-settings" },
        update: {
          storeName,
          tagLine,
          contactEmail,
          contactPhone,
          address,
          gstNumber,
          fssaiNumber,
          instagramUrl,
          facebookUrl,
          whatsappNumber,
          isWhatsappEnabled,
          freeShippingMin: freeShippingMin ? (freeShippingMin as any) : 499,
          flatShippingRate: flatShippingRate ? (flatShippingRate as any) : 60,
          taxRatePercent: taxRatePercent || 5.0,
          isCodEnabled: isCodEnabled !== undefined ? isCodEnabled : true,
          isRazorpayEnabled: isRazorpayEnabled !== undefined ? isRazorpayEnabled : true,
          seoTitle,
          seoDescription,
          seoKeywords,
          ogImageUrl,
        },
        create: {
          id: "default-settings",
          storeName,
          tagLine,
          contactEmail,
          contactPhone,
          address,
          gstNumber,
          fssaiNumber,
          instagramUrl,
          facebookUrl,
          whatsappNumber,
          isWhatsappEnabled,
          freeShippingMin: freeShippingMin ? (freeShippingMin as any) : 499,
          flatShippingRate: flatShippingRate ? (flatShippingRate as any) : 60,
          taxRatePercent: taxRatePercent || 5.0,
          isCodEnabled: isCodEnabled !== undefined ? isCodEnabled : true,
          isRazorpayEnabled: isRazorpayEnabled !== undefined ? isRazorpayEnabled : true,
          seoTitle,
          seoDescription,
          seoKeywords,
          ogImageUrl,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Super Admin",
          userEmail: session?.user?.email,
          userRole,
          action: "UPDATE_WEBSITE_SETTINGS",
          module: "SETTINGS",
          targetId: "default-settings",
          targetName: "Global Website & Business Settings",
          previousValue: previous ? (previous as any) : null,
          newValue: saved as any,
        },
      });

      return saved;
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
