import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const role = (session.user as any)?.role;

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "HOTEL_OWNER") {
    redirect("/dashboard/hotel");
  } else if (role === "CLIENT") {
    redirect("/dashboard/client");
  }

  // Fallback if role is unknown or missing
  redirect("/auth/login");
}
