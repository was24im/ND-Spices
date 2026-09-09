import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const theme = await prisma.themeSettings.findUnique({
      where: { id: "default-theme" },
    });
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch theme" }, { status: 500 });
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
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      fontFamily,
      borderRadius,
      buttonStyle,
      heroBannerUrl,
    } = body;

    const previous = await prisma.themeSettings.findUnique({ where: { id: "default-theme" } });

    const updated = await prisma.$transaction(async (tx) => {
      const saved = await tx.themeSettings.upsert({
        where: { id: "default-theme" },
        update: {
          logoUrl,
          faviconUrl,
          primaryColor,
          secondaryColor,
          accentColor,
          backgroundColor,
          textColor,
          fontFamily,
          borderRadius,
          buttonStyle,
          heroBannerUrl,
        },
        create: {
          id: "default-theme",
          logoUrl,
          faviconUrl,
          primaryColor,
          secondaryColor,
          accentColor,
          backgroundColor,
          textColor,
          fontFamily,
          borderRadius,
          buttonStyle,
          heroBannerUrl,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Super Admin",
          userEmail: session?.user?.email,
          userRole,
          action: "UPDATE_THEME_DESIGN",
          module: "THEME",
          targetId: "default-theme",
          targetName: "Brand Design Settings",
          previousValue: previous ? (previous as any) : null,
          newValue: saved as any,
        },
      });

      return saved;
    });

    return NextResponse.json({ success: true, theme: updated });
  } catch (error: any) {
    console.error("Update theme error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update theme" },
      { status: 500 }
    );
  }
}
