import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
