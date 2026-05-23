import { z } from "zod";

export const EmployeeStatusEnum = z.enum([
  "PENDING",
  "ONBOARDING",
  "ACTIVE",
  "OFFBOARDING",
  "INACTIVE",
]);

export const TaskStatusEnum = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "SKIPPED",
]);

const employeeBaseSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional().nullable(),
  departmentId: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required").max(200),
  managerId: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date is required"),
  notes: z.string().max(2000).optional().nullable(),
});

export const createEmployeeSchema = employeeBaseSchema;
export const updateEmployeeSchema = employeeBaseSchema.partial().extend({
  status: EmployeeStatusEnum.optional(),
  endDate: z.string().optional().nullable(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  code: z.string().min(1, "Code is required").max(20).toUpperCase(),
  description: z.string().max(500).optional().nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const updateTaskSchema = z.object({
  status: TaskStatusEnum,
  description: z.string().max(500).optional().nullable(),
});

export const employeeQuerySchema = z.object({
  search: z.string().optional(),
  status: EmployeeStatusEnum.optional(),
  departmentId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.enum(["firstName", "lastName", "startDate", "status", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type EmployeeQuery = z.infer<typeof employeeQuerySchema>;
