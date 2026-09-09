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
    const contents = await prisma.websiteContent.findMany();
    const contentMap: Record<string, any> = {};
    contents.forEach((c) => {
      contentMap[c.key] = c.content;
    });

    return NextResponse.json({ success: true, contents: contentMap });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch CMS content" }, { status: 500 });
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
    const { key, section, content } = body;

    if (!key || !content) {
      return NextResponse.json(
        { success: false, error: "Key and content payload required" },
        { status: 400 }
      );
    }

    const previous = await prisma.websiteContent.findUnique({ where: { key } });

    const updated = await prisma.$transaction(async (tx) => {
      const saved = await tx.websiteContent.upsert({
        where: { key },
        update: {
          section: section || "general",
          content,
        },
        create: {
          key,
          section: section || "general",
          content,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Super Admin",
          userEmail: session?.user?.email,
          userRole,
          action: "UPDATE_HOMEPAGE_CMS",
          module: "CMS",
          targetId: key,
          targetName: `Section: ${key}`,
          previousValue: previous?.content ? (previous.content as any) : undefined,
          newValue: content as any,
        },
      });

      return saved;
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    console.error("Update CMS error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update CMS" },
      { status: 500 }
    );
  }
}
