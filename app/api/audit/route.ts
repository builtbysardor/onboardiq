import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const auditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  employeeId: z.string().optional(),
  entity: z.string().optional(),
  action: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const rawParams = Object.fromEntries(searchParams.entries());
    const parsed = auditQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, pageSize, employeeId, entity, action } = parsed.data;

    const where: Prisma.AuditLogWhereInput = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (entity) {
      where.entity = { contains: entity, mode: "insensitive" };
    }

    if (action) {
      where.action = { contains: action, mode: "insensitive" };
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          user: { select: { id: true, name: true, email: true } },
          employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      data: logs,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("[GET /api/audit]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
