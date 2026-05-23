import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function createAuditLog({
  entity,
  entityId,
  action,
  changes,
  userId,
  employeeId,
}: {
  entity: string;
  entityId: string;
  action: string;
  changes?: Record<string, unknown>;
  userId?: string;
  employeeId?: string;
}) {
  await prisma.auditLog.create({
    data: {
      entity,
      entityId,
      action,
      changes: changes as Prisma.InputJsonValue,
      userId,
      employeeId,
    },
  });
}
