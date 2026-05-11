"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full py-2  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/secondary_logo.svg"
            alt="logo primaire Zua Place"
            width={120}
            height={80}
            style={{ height: "auto" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/hotels"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Hôtels
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Link href="/auth/login">
                <Button variant="outline">
                  <User className="text-base hover:text-primary/90" />
                  Connexion
                </Button>
              </Link>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Button asChild className=" bg-primary hover:bg-primary/90">
            <Link href="/auth/register">{"S'inscrire"}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              className="px-4 py-3 rounded-full text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/hotels"
              className="px-4 py-3 rounded-full text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Hôtels
            </Link>
            <Link
              href="#features"
              className="px-4 py-3 rounded-full text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#contact"
              className="px-4 py-3 rounded-full text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
              <Button asChild variant="outline" className=" w-full">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild className="w-full bg-primary">
                <Link href="/auth/register">{"S'inscrire"}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
