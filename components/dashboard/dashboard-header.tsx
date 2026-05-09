"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  userName: string;
  userType: "client" | "hotel" | "admin";
  onMenuClick?: () => void;
}

export function DashboardHeader({
  title,
  userName,
  userType,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-full hover:bg-muted"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-xl md:text-2xl font-bold text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune nouvelle notification
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full gap-2 px-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/${userType}/profile`}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/${userType}/settings`}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="text-destructive focus:text-destructive"
            >
              <Link href="/auth/login" className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
