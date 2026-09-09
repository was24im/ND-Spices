import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MediaType } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, assets });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, url, type, category } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    const asset = await prisma.$transaction(async (tx) => {
      const created = await tx.mediaAsset.create({
        data: {
          title,
          url,
          type: (type as MediaType) || MediaType.IMAGE,
          category: category || "products",
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Super Admin",
          userEmail: session?.user?.email,
          userRole,
          action: "UPLOAD_MEDIA",
          module: "MEDIA",
          targetId: created.id,
          targetName: created.title,
          newValue: { title, url, category },
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, asset });
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
    return NextResponse.json({ success: false, error: "Asset ID required" }, { status: 400 });
  }

  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (asset) {
      await prisma.$transaction([
        prisma.mediaAsset.delete({ where: { id } }),
        prisma.auditLog.create({
          data: {
            userId,
            userName: session?.user?.name || "Super Admin",
            userEmail: session?.user?.email,
            userRole,
            action: "DELETE_MEDIA",
            module: "MEDIA",
            targetId: id,
            targetName: asset.title,
          },
        }),
      ]);
    }
    return NextResponse.json({ success: true, message: "Asset deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
