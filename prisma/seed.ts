import { Role, EmployeeStatus, TaskType, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";

async function main() {
  console.log("🌱 Starting seed...");

  // ─── Users ────────────────────────────────────────────────────────────────
  console.log("👤 Seeding users...");

  const usersData = [
    { email: "admin@onboardiq.io", name: "Admin User", role: Role.ADMIN, password: "admin123" },
    { email: "hr@onboardiq.io", name: "Sarah Johnson", role: Role.HR, password: "hr123456" },
    { email: "manager@onboardiq.io", name: "Mike Chen", role: Role.MANAGER, password: "manager123" },
  ];

  const users = await Promise.all(
    usersData.map(async ({ email, name, role, password }) => {
      const passwordHash = await bcrypt.hash(password, 12);
      return prisma.user.upsert({
        where: { email },
        update: { name, role, passwordHash },
        create: { email, name, role, passwordHash },
      });
    })
  );

  const [adminUser, hrUser] = users;
  console.log(`   ✓ ${users.length} users seeded`);

  // ─── Departments ──────────────────────────────────────────────────────────
  console.log("🏢 Seeding departments...");

  const departmentsData = [
    { name: "Engineering", code: "ENG", description: "Software development and infrastructure" },
    { name: "Human Resources", code: "HR", description: "People operations and talent" },
    { name: "Finance", code: "FIN", description: "Financial planning and accounting" },
    { name: "Marketing", code: "MKT", description: "Brand, growth and communications" },
    { name: "Operations", code: "OPS", description: "Business operations and logistics" },
    { name: "Sales", code: "SALES", description: "Revenue and customer acquisition" },
  ];

  const departments: Record<string, { id: string; name: string; code: string }> = {};

  for (const dept of departmentsData) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, description: dept.description },
      create: dept,
    });
    departments[dept.code] = d;
  }

  console.log(`   ✓ ${departmentsData.length} departments seeded`);

  // ─── Employees ────────────────────────────────────────────────────────────
  console.log("👥 Seeding employees...");

  const employeesData = [
    // 2 ACTIVE
    {
      employeeId: "EMP-001",
      firstName: "James",
      lastName: "Rivera",
      email: "james.rivera@company.com",
      phone: "+1-555-0101",
      departmentCode: "ENG",
      position: "Senior Software Engineer",
      status: EmployeeStatus.ACTIVE,
      startDate: new Date("2023-03-15"),
      ldapCreated: true,
      welcomeEmailSent: true,
      ldapUsername: "jrivera",
    },
    {
      employeeId: "EMP-002",
      firstName: "Priya",
      lastName: "Nair",
      email: "priya.nair@company.com",
      phone: "+1-555-0102",
      departmentCode: "HR",
      position: "HR Business Partner",
      status: EmployeeStatus.ACTIVE,
      startDate: new Date("2022-11-01"),
      ldapCreated: true,
      welcomeEmailSent: true,
      ldapUsername: "pnair",
    },
    // 2 ONBOARDING
    {
      employeeId: "EMP-003",
      firstName: "Lucas",
      lastName: "Fernandez",
      email: "lucas.fernandez@company.com",
      phone: "+1-555-0103",
      departmentCode: "FIN",
      position: "Financial Analyst",
      status: EmployeeStatus.ONBOARDING,
      startDate: new Date("2024-07-08"),
      ldapCreated: true,
      welcomeEmailSent: true,
      ldapUsername: "lfernandez",
    },
    {
      employeeId: "EMP-004",
      firstName: "Aisha",
      lastName: "Okonkwo",
      email: "aisha.okonkwo@company.com",
      phone: "+1-555-0104",
      departmentCode: "MKT",
      position: "Marketing Specialist",
      status: EmployeeStatus.ONBOARDING,
      startDate: new Date("2024-07-15"),
      ldapCreated: false,
      welcomeEmailSent: false,
      ldapUsername: null,
    },
    // 1 OFFBOARDING
    {
      employeeId: "EMP-005",
      firstName: "Derek",
      lastName: "Walsh",
      email: "derek.walsh@company.com",
      phone: "+1-555-0105",
      departmentCode: "SALES",
      position: "Account Executive",
      status: EmployeeStatus.OFFBOARDING,
      startDate: new Date("2021-06-01"),
      endDate: new Date("2024-08-30"),
      ldapCreated: true,
      welcomeEmailSent: true,
      ldapUsername: "dwalsh",
    },
    // 2 PENDING
    {
      employeeId: "EMP-006",
      firstName: "Sophie",
      lastName: "Laurent",
      email: "sophie.laurent@company.com",
      phone: "+1-555-0106",
      departmentCode: "ENG",
      position: "DevOps Engineer",
      status: EmployeeStatus.PENDING,
      startDate: new Date("2024-08-05"),
      ldapCreated: false,
      welcomeEmailSent: false,
      ldapUsername: null,
    },
    {
      employeeId: "EMP-007",
      firstName: "Omar",
      lastName: "Hassan",
      email: "omar.hassan@company.com",
      phone: "+1-555-0107",
      departmentCode: "OPS",
      position: "Operations Analyst",
      status: EmployeeStatus.PENDING,
      startDate: new Date("2024-08-12"),
      ldapCreated: false,
      welcomeEmailSent: false,
      ldapUsername: null,
    },
    // 1 INACTIVE
    {
      employeeId: "EMP-008",
      firstName: "Nina",
      lastName: "Petrov",
      email: "nina.petrov@company.com",
      phone: "+1-555-0108",
      departmentCode: "MKT",
      position: "Content Strategist",
      status: EmployeeStatus.INACTIVE,
      startDate: new Date("2020-04-20"),
      endDate: new Date("2024-01-31"),
      ldapCreated: false,
      welcomeEmailSent: true,
      ldapUsername: null,
    },
  ];

  const employeeMap: Record<string, { id: string; employeeId: string; status: EmployeeStatus }> =
    {};

  for (const emp of employeesData) {
    const { departmentCode, ...rest } = emp;
    const dept = departments[departmentCode];

    const created = await prisma.employee.upsert({
      where: { employeeId: rest.employeeId },
      update: {
        ...rest,
        departmentId: dept.id,
      },
      create: {
        ...rest,
        departmentId: dept.id,
      },
    });
    employeeMap[rest.employeeId] = created;
  }

  console.log(`   ✓ ${employeesData.length} employees seeded`);

  // ─── Onboarding Tasks (for EMP-003 and EMP-004) ───────────────────────────
  console.log("📋 Seeding onboarding tasks...");

  const onboardingTaskTypes: TaskType[] = [
    TaskType.CREATE_LDAP_ACCOUNT,
    TaskType.SEND_WELCOME_EMAIL,
    TaskType.SETUP_EMAIL_ACCOUNT,
    TaskType.ASSIGN_EQUIPMENT,
    TaskType.GRANT_SYSTEM_ACCESS,
    TaskType.COMPLETE_PAPERWORK,
    TaskType.MANAGER_INTRODUCTION,
    TaskType.IT_ORIENTATION,
  ];

  // EMP-003 (Lucas Fernandez — mostly completed, in progress on last 2)
  const emp003Tasks: { type: TaskType; status: TaskStatus; completedAt: Date | null }[] = [
    { type: TaskType.CREATE_LDAP_ACCOUNT, status: TaskStatus.COMPLETED, completedAt: new Date("2024-07-08T10:00:00Z") },
    { type: TaskType.SEND_WELCOME_EMAIL, status: TaskStatus.COMPLETED, completedAt: new Date("2024-07-08T10:05:00Z") },
    { type: TaskType.SETUP_EMAIL_ACCOUNT, status: TaskStatus.COMPLETED, completedAt: new Date("2024-07-08T11:00:00Z") },
    { type: TaskType.ASSIGN_EQUIPMENT, status: TaskStatus.COMPLETED, completedAt: new Date("2024-07-09T09:00:00Z") },
    { type: TaskType.GRANT_SYSTEM_ACCESS, status: TaskStatus.COMPLETED, completedAt: new Date("2024-07-09T14:00:00Z") },
    { type: TaskType.COMPLETE_PAPERWORK, status: TaskStatus.COMPLETED, completedAt: new Date("2024-07-10T16:00:00Z") },
    { type: TaskType.MANAGER_INTRODUCTION, status: TaskStatus.IN_PROGRESS, completedAt: null },
    { type: TaskType.IT_ORIENTATION, status: TaskStatus.PENDING, completedAt: null },
  ];

  // EMP-004 (Aisha Okonkwo — just started)
  const emp004Tasks: { type: TaskType; status: TaskStatus; completedAt: Date | null }[] = [
    { type: TaskType.CREATE_LDAP_ACCOUNT, status: TaskStatus.IN_PROGRESS, completedAt: null },
    { type: TaskType.SEND_WELCOME_EMAIL, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.SETUP_EMAIL_ACCOUNT, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.ASSIGN_EQUIPMENT, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.GRANT_SYSTEM_ACCESS, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.COMPLETE_PAPERWORK, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.MANAGER_INTRODUCTION, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.IT_ORIENTATION, status: TaskStatus.PENDING, completedAt: null },
  ];

  const onboardingPairs: [string, typeof emp003Tasks][] = [
    ["EMP-003", emp003Tasks],
    ["EMP-004", emp004Tasks],
  ];

  for (const [empId, tasks] of onboardingPairs) {
    const employee = employeeMap[empId];
    for (const task of tasks) {
      // Use a composite unique check via deleteMany + create pattern via upsert on a stable synthetic id
      // Since OnboardingTask has no unique constraint on (employeeId, type), we delete existing then create
      await prisma.onboardingTask.deleteMany({
        where: { employeeId: employee.id, type: task.type },
      });
      await prisma.onboardingTask.create({
        data: {
          employeeId: employee.id,
          type: task.type,
          status: task.status,
          completedAt: task.completedAt,
          description: `${task.type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} task for new employee onboarding`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log(`   ✓ Onboarding tasks seeded for EMP-003 and EMP-004`);

  // ─── Offboarding Tasks (for EMP-005) ──────────────────────────────────────
  console.log("📤 Seeding offboarding tasks...");

  const offboardingTaskTypes: { type: TaskType; status: TaskStatus; completedAt: Date | null }[] = [
    { type: TaskType.REVOKE_LDAP_ACCOUNT, status: TaskStatus.COMPLETED, completedAt: new Date("2024-08-16T09:00:00Z") },
    { type: TaskType.REVOKE_SYSTEM_ACCESS, status: TaskStatus.COMPLETED, completedAt: new Date("2024-08-16T09:30:00Z") },
    { type: TaskType.COLLECT_EQUIPMENT, status: TaskStatus.IN_PROGRESS, completedAt: null },
    { type: TaskType.FINAL_PAYROLL, status: TaskStatus.IN_PROGRESS, completedAt: null },
    { type: TaskType.EXIT_INTERVIEW, status: TaskStatus.PENDING, completedAt: null },
    { type: TaskType.KNOWLEDGE_TRANSFER, status: TaskStatus.PENDING, completedAt: null },
  ];

  const emp005 = employeeMap["EMP-005"];

  await prisma.offboardingTask.deleteMany({ where: { employeeId: emp005.id } });

  for (const task of offboardingTaskTypes) {
    await prisma.offboardingTask.create({
      data: {
        employeeId: emp005.id,
        type: task.type,
        status: task.status,
        completedAt: task.completedAt,
        description: `${task.type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} task for offboarding process`,
        dueDate: new Date("2024-08-30"),
      },
    });
  }

  console.log(`   ✓ Offboarding tasks seeded for EMP-005`);

  // ─── Audit Logs ───────────────────────────────────────────────────────────
  console.log("📝 Seeding audit logs...");

  const auditEntries = [
    {
      entity: "Employee",
      entityId: employeeMap["EMP-003"].id,
      action: "EMPLOYEE_CREATED",
      employeeId: employeeMap["EMP-003"].id,
      userId: hrUser.id,
      changes: { status: "PENDING", department: "Finance", position: "Financial Analyst" },
      createdAt: new Date("2024-07-01T08:00:00Z"),
    },
    {
      entity: "Employee",
      entityId: employeeMap["EMP-003"].id,
      action: "ONBOARDING_STARTED",
      employeeId: employeeMap["EMP-003"].id,
      userId: hrUser.id,
      changes: { status: { from: "PENDING", to: "ONBOARDING" } },
      createdAt: new Date("2024-07-08T09:55:00Z"),
    },
    {
      entity: "OnboardingTask",
      entityId: employeeMap["EMP-003"].id,
      action: "TASK_COMPLETED",
      employeeId: employeeMap["EMP-003"].id,
      userId: adminUser.id,
      changes: { task: "CREATE_LDAP_ACCOUNT", status: "COMPLETED" },
      createdAt: new Date("2024-07-08T10:00:00Z"),
    },
    {
      entity: "Employee",
      entityId: employeeMap["EMP-005"].id,
      action: "OFFBOARDING_STARTED",
      employeeId: employeeMap["EMP-005"].id,
      userId: hrUser.id,
      changes: { status: { from: "ACTIVE", to: "OFFBOARDING" }, endDate: "2024-08-30" },
      createdAt: new Date("2024-08-15T10:30:00Z"),
    },
    {
      entity: "OffboardingTask",
      entityId: employeeMap["EMP-005"].id,
      action: "TASK_COMPLETED",
      employeeId: employeeMap["EMP-005"].id,
      userId: adminUser.id,
      changes: { task: "REVOKE_LDAP_ACCOUNT", status: "COMPLETED" },
      createdAt: new Date("2024-08-16T09:00:00Z"),
    },
  ];

  for (const entry of auditEntries) {
    await prisma.auditLog.create({ data: entry });
  }

  console.log(`   ✓ ${auditEntries.length} audit log entries seeded`);

  console.log("\n✅ Seed complete!");
  console.log("\nDefault credentials:");
  console.log("  admin@onboardiq.io  /  admin123   (ADMIN)");
  console.log("  hr@onboardiq.io     /  hr123456   (HR)");
  console.log("  manager@onboardiq.io / manager123 (MANAGER)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
