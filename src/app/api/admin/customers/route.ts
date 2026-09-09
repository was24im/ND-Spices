import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "ADMIN") {
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
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            finalAmount: true,
            orderStatus: true,
            createdAt: true,
          },
        },
        addresses: {
          select: {
            id: true,
            city: true,
            state: true,
          },
        },
      },
    });

    const enrichedUsers = users.map((u) => {
      const totalSpent = u.orders.reduce((sum, o) => sum + Number(o.finalAmount), 0);
      return {
        ...u,
        totalOrders: u.orders.length,
        totalSpent,
      };
    });

    return NextResponse.json({ success: true, customers: enrichedUsers });
  } catch (error) {
    console.error("Fetch customers error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 });
  }
}
