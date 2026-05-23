import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateEmployeeId(count: number): string {
  return `EMP-${String(count).padStart(4, "0")}`;
}

export function generateLdapUsername(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z.]/g, "");
}
