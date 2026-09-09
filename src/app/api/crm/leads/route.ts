import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions, isStaffOrAdmin, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LeadStatus, Role } from "@prisma/client";

const leadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().default("Website Inquiry"),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
  spiceInterest: z.string().optional().nullable(),
  estimatedValue: z.number().nonnegative().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  initialNote: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!isStaffOrAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const [leads, staffMembers] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          notes: {
            orderBy: { createdAt: "desc" },
            include: { author: { select: { id: true, name: true, role: true } } },
          },
        },
      }),
      prisma.user.findMany({
        where: {
          role: { in: [Role.STAFF, Role.SUPER_ADMIN, Role.ADMIN] },
        },
        select: { id: true, name: true, email: true, role: true },
      }),
    ]);

    return NextResponse.json({ success: true, leads, staffMembers });
  } catch (error) {
    console.error("Fetch CRM leads error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isStaffOrAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = leadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      spiceInterest,
      estimatedValue,
      assignedToId,
      initialNote,
    } = validated.data;

    const newLead = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name,
          email,
          phone,
          company,
          source,
          status,
          spiceInterest,
          estimatedValue: estimatedValue ? (estimatedValue as any) : null,
          assignedToId: assignedToId || (userRole === "STAFF" ? userId : null),
        },
        include: {
          assignedTo: { select: { id: true, name: true } },
        },
      });

      if (initialNote && userId) {
        await tx.leadNote.create({
          data: {
            leadId: lead.id,
            authorId: userId,
            note: initialNote,
          },
        });
      }

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Staff",
          userEmail: session?.user?.email,
          userRole,
          action: "CREATE_LEAD",
          module: "CRM",
          targetId: lead.id,
          targetName: lead.name,
          newValue: { name, email, status, spiceInterest, estimatedValue },
        },
      });

      return lead;
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error("Create CRM lead error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!isStaffOrAdmin(userRole)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, status, assignedToId, spiceInterest, estimatedValue, note } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: "Lead ID required" }, { status: 400 });
    }

    const previousLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!previousLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({
        where: { id: leadId },
        data: {
          ...(status && { status: status as LeadStatus }),
          ...(assignedToId !== undefined && { assignedToId }),
          ...(spiceInterest !== undefined && { spiceInterest }),
          ...(estimatedValue !== undefined && {
            estimatedValue: estimatedValue ? (estimatedValue as any) : null,
          }),
        },
        include: {
          assignedTo: { select: { id: true, name: true } },
          notes: {
            orderBy: { createdAt: "desc" },
            include: { author: { select: { id: true, name: true, role: true } } },
          },
        },
      });

      if (note && userId) {
        await tx.leadNote.create({
          data: {
            leadId,
            authorId: userId,
            note,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId,
          userName: session?.user?.name || "Staff",
          userEmail: session?.user?.email,
          userRole,
          action: "UPDATE_LEAD",
          module: "CRM",
          targetId: leadId,
          targetName: lead.name,
          previousValue: { status: previousLead.status, assignedToId: previousLead.assignedToId },
          newValue: { status: lead.status, assignedToId: lead.assignedToId },
        },
      });

      return lead;
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!isSuperAdmin(userRole)) {
    return NextResponse.json(
      { success: false, error: "Only Super Admin can delete leads" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Lead ID required" }, { status: 400 });
  }

  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Lead removed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
