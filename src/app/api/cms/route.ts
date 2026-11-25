import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const contents = await prisma.websiteContent.findMany();
    const contentMap: Record<string, any> = {};
    contents.forEach((c) => {
      contentMap[c.key] = c.content;
    });

    return NextResponse.json({ success: true, contents: contentMap });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch CMS content" },
      { status: 500 }
    );
  }
}
