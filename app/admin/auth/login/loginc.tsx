"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Tentative de connexion Admin avec:", formData.email);
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login failed:", result.error);
        setError("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
        return;
      }

      // Si réussi, on redirige vers le dashboard admin
      // Le middleware reconnaîtra maintenant le rôle ADMIN
      router.push("/dashboard/admin");
      router.refresh();
    } catch (error) {
      console.error("An error occurred during login:", error);
      setError("Une erreur inattendue est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/admin_bg.png')" }}
      />
      <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-md px-4">

        <Card className="border-none bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />
          
          <CardHeader className="text-center pt-10">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 rotate-3">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-serif text-4xl text-white tracking-tight">Portail Admin</CardTitle>
            <CardDescription className="text-white/60 text-base mt-2">
              Connectez-vous pour gérer votre établissement
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-10 pt-4">
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm animate-shake">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 font-medium ml-1">Email professionnel</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@zuaplace.com"
                    className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary focus:ring-primary/20 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 font-medium ml-1">Mot de passe</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary focus:ring-primary/20 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authentification...
                  </div>
                ) : (
                  "Accéder au Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer copyright */}
      <div className="absolute bottom-8 z-20 text-white/30 text-xs">
        © {new Date().getFullYear()} Zua Place Administration • Tous droits réservés
      </div>
    </div>
  );
}
