
"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useSession } from "next-auth/react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  const userName = (session?.user as any)?.username || session?.user?.name || session?.user?.email || "Administrateur";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <DashboardSidebar
        type="admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader
          title="Administration"
          userName={userName}
          userType="admin"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 lg:ml-72 transition-all">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
