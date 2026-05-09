"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Hotel,
  LayoutDashboard,
  CalendarDays,
  Birdhouse,
  User,
  Settings,
  LogOut,
  Heart,
  History,
  X,
  Star,
  Users,
  BedDouble,
  CreditCard,
  ArrowLeftRight,
  Tags
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  type: "client" | "hotel" | "admin";
  isOpen?: boolean;
  onClose?: () => void;
}

const clientMenuItems = [
  {
    href: "/dashboard/client",
    icon: LayoutDashboard,
    label: "Tableau de Bord",
  },
  {
    href: "/dashboard/client/reservations",
    icon: CalendarDays,
    label: "Mes Réservations",
  },
  {
    href: "/dashboard/client/hotels",
    icon: Birdhouse,
    label: "Hôtels disponibles",
  },
  { href: "/dashboard/client/favorites", icon: Heart, label: "Favoris" },
  { href: "/dashboard/client/history", icon: History, label: "Historique" },
  { href: "/dashboard/client/profile", icon: User, label: "Mon Profil" },
  { href: "/dashboard/client/settings", icon: Settings, label: "Paramètres" },
];

const hotelMenuItems = [
  { href: "/dashboard/hotel", icon: LayoutDashboard, label: "Tableau de Bord" },
  { href: "/dashboard/hotel/rooms", icon: Hotel, label: "Mes Chambres" },
  {
    href: "/dashboard/hotel/reservations",
    icon: CalendarDays,
    label: "Réservations",
  },
  { href: "/dashboard/hotel/profile", icon: User, label: "Profil Hôtel" },
  { href: "/dashboard/hotel/settings", icon: Settings, label: "Paramètres" },
];

const adminMenuItems = [
  { href: "/dashboard/admin", icon: LayoutDashboard, label: "Tableau de Bord" },
  { href: "/dashboard/admin/hotels", icon: Hotel, label: "Gestion Hôtels" },
  { href: "/dashboard/admin/chambres/categories", icon: Tags, label: "Catégories Chambres"},
  { href: "/dashboard/admin/chambres", icon: BedDouble, label: "Gestion Chambres"},
  { href: "/dashboard/admin/reservations", icon: CalendarDays, label: "Gestion Réservations" },
  { href: "/dashboard/admin/paiements", icon: CreditCard, label: "Gestion Paiements" },
  { href: "/dashboard/admin/avis", icon: Star, label: "Gestion Avis" },
  { href: "/dashboard/admin/abonnements", icon: ArrowLeftRight, label: "Gestion Transactions" },
  {href: "/dashboard/admin/visiteurs", icon: Users, label: "Gestion Visiteurs"},
  { href: "/dashboard/admin/utilisateurs", icon: User, label: "Gestion Utilisateurs" },
  { href: "/dashboard/admin/parametres", icon: Settings, label: "Paramètres" },
];

export function DashboardSidebar({ type, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const menuItems = 
    type === "client" ? clientMenuItems : 
    type === "hotel" ? hotelMenuItems : 
    adminMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-  z-50 h-full w-72 bg-card border-r border-border  flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/secondary_logo.svg"
              alt="logo zua place"
              width={120}
              height={80}
              style={{ height: "auto" }}
            />
          </Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-muted"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start rounded-full text-muted-foreground hover:text-destructive"
          >
            <Link href="/auth/login">
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
}
