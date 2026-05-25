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
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { data: session } = useSession();

  return (
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-card/95 backdrop-blur border-b border-border transition-all">
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
              className="rounded-full relative hover:text-white hover:bg-primary"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 z-[100] shadow-2xl border-border bg-card"
          >
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
            <Button
              variant="ghost"
              className="group rounded-full gap-2 px-1 hover:bg-muted transition-colors hover:text-white hover:bg-primary"
            >
              <Avatar className="h-8 w-8 border border-border group-hover:border-primary transition-colors hover:text-white hover:bg-primary">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="hidden md:inline text-sm font-medium transition-colors ml-1 pr-2">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 z-[100] shadow-2xl border-border bg-card"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/${userType}/profile`}
                className="cursor-pointer py-2.5"
              >
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                Mon Profil
              </Link>
            </DropdownMenuItem>
            {userType === "admin" && (
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/admin/parametres"
                  className="cursor-pointer py-2.5"
                >
                  <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
            )}
            {userType === "hotel" && (
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/hotel/settings"
                  className="cursor-pointer py-2.5"
                >
                  <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/admin/auth/login" })}
              className="text-destructive focus:text-destructive cursor-pointer py-2.5"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
