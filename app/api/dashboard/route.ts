import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalEmployees,
      activeEmployees,
      onboardingEmployees,
      offboardingEmployees,
      pendingEmployees,
      totalDepartments,
      recentEmployees,
      onboardingProgress,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.employee.count({ where: { status: "ONBOARDING" } }),
      prisma.employee.count({ where: { status: "OFFBOARDING" } }),
      prisma.employee.count({ where: { status: "PENDING" } }),
      prisma.department.count(),
      prisma.employee.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { department: { select: { name: true } } },
      }),
      prisma.onboardingTask.groupBy({ by: ["status"], _count: true }),
    ]);

    return NextResponse.json({
      totalEmployees,
      activeEmployees,
      onboardingEmployees,
      offboardingEmployees,
      pendingEmployees,
      totalDepartments,
      recentEmployees,
      onboardingProgress,
    });
  } catch (error) {
    console.error("[GET /api/dashboard]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
