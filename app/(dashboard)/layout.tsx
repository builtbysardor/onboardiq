import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <Sidebar
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
      />
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
