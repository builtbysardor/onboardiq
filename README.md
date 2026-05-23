# OnboardIQ — Enterprise HR Onboarding Automation

> Streamline every hire and departure with automated workflows, LDAP provisioning, and real-time task tracking.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-onboardiq.vercel.app-blue?style=for-the-badge)](https://onboardiq.vercel.app)

---

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_5-2D3748?style=flat-square&logo=prisma&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth_v5-purple?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## Features

- 🔐 **Automated LDAP/AD account provisioning** — accounts created and revoked on employee status change
- 📧 **Welcome email automation** — templated onboarding emails sent on day one
- ✅ **Onboarding & Offboarding workflow tracking** — 8-step onboarding and 6-step offboarding checklists
- 👥 **Role-based access control** — Admin, HR, Manager, and Viewer roles with scoped permissions
- 📊 **Real-time task progress** — live dashboards with completion rates and status breakdowns
- 🗂️ **Complete audit trail** — every action logged with actor, timestamp, and change diff
- 🏢 **Department management** — full CRUD for departments with employee assignment

---

## Architecture

```
New Employee Added
     ↓
Onboarding Triggered
     ↓
┌────────────────────────────────┐
│  LDAP Account Created          │
│  Welcome Email Sent            │
│  Equipment Assignment Queued   │
│  System Access Granted         │
└────────────────────────────────┘
     ↓
Employee Active

[Offboarding]
┌────────────────────────────────┐
│  LDAP Account Revoked          │
│  System Access Removed         │
│  Equipment Collected           │
│  Exit Interview Scheduled      │
└────────────────────────────────┘
```

---

## Quick Start

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Default Credentials

| Email                    | Password     | Role    |
|--------------------------|--------------|---------|
| admin@onboardiq.io       | admin123     | Admin   |
| hr@onboardiq.io          | hr123456     | HR      |
| manager@onboardiq.io     | manager123   | Manager |

> **Note:** Change all passwords before deploying to any non-local environment.

---

## Environment Variables

| Variable        | Description                                    | Example                          |
|-----------------|------------------------------------------------|----------------------------------|
| `DATABASE_URL`  | PostgreSQL connection string                   | `postgresql://user:pass@host/db` |
| `AUTH_SECRET`   | NextAuth signing secret (min 32 chars)         | `some-random-secret-string`      |
| `NEXTAUTH_URL`  | Canonical URL of the application               | `http://localhost:3000`          |
| `LDAP_ENABLED`  | Enable LDAP/Active Directory integration       | `true` / `false`                 |
| `EMAIL_ENABLED` | Enable transactional email via Nodemailer      | `true` / `false`                 |

For LDAP integration, also set:

| Variable          | Description                        |
|-------------------|------------------------------------|
| `LDAP_URL`        | LDAP server URL                    |
| `LDAP_BIND_DN`    | Bind DN for service account        |
| `LDAP_BIND_PASS`  | Bind password                      |
| `LDAP_BASE_DN`    | Base DN for user searches          |

For email, also set:

| Variable      | Description               |
|---------------|---------------------------|
| `SMTP_HOST`   | SMTP server host          |
| `SMTP_PORT`   | SMTP server port          |
| `SMTP_USER`   | SMTP username             |
| `SMTP_PASS`   | SMTP password             |
| `EMAIL_FROM`  | From address for emails   |

---

## Local Development with Docker

Spin up PostgreSQL + OpenLDAP locally:

```bash
docker-compose up -d
```

Then run migrations and seed:

```bash
npx prisma migrate dev
npm run seed
```

---

## Project Structure

```
onboardiq/
├── app/
│   ├── (auth)/          # Login page
│   ├── (dashboard)/     # Protected dashboard pages
│   └── api/             # REST API routes
├── components/          # Reusable UI components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Prisma client singleton
│   ├── ldap.ts          # LDAP provisioning helpers
│   ├── email.ts         # Email automation helpers
│   ├── onboarding.ts    # Workflow orchestration
│   ├── audit.ts         # Audit log helpers
│   └── validators.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Development seed data
└── docker-compose.yml   # Local dev services
```

---

## License

MIT © OnboardIQ
