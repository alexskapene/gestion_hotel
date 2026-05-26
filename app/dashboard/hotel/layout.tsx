"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useSession } from "next-auth/react";

export default function HotelDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session, status } = useSession();
  const [hotelName, setHotelName] = useState("Mon Hôtel");

  useEffect(() => {
    if (session?.user?.id && status === "authenticated") {
      fetchHotelName();
    }
  }, [session, status]);

  const fetchHotelName = async () => {
    try {
      const response = await fetch("/api/hotels/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.name) {
          setHotelName(data.name);
        } else {
          setHotelName("Mon Hôtel");
        }
      } else {
        console.error("Erreur lors de la récupération du nom de l'hôtel: Status", response.status);
        setHotelName("Mon Hôtel");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nom de l'hôtel:", error);
      setHotelName("Mon Hôtel");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <DashboardSidebar 
        type="hotel" 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72">
        <DashboardHeader 
          title="Espace Hôtel" 
          userName={hotelName} 
          userType="hotel"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
