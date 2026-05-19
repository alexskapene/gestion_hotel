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
import { Eye, EyeOff, Loader2, Lock, Mail, UserCog } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

      router.push("/dashboard/admin");
      router.refresh();
    } catch (error) {
      console.error("An error occurred during login:", error);

      setError("Une erreur inattendue est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-primary">
      {/* LEFT SECTION */}
      <div className="relative hidden lg:flex w-1/2 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/admin_bg.png')" }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

        {/* Decorative Blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px]" />

        {/* Return Home */}
        <div className="absolute top-8 left-8 z-20">
          <a
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white hover:underline transition-colors text-sm font-medium"
          >
            ← Accueil
          </a>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full px-16 py-12">
          {/* Logo */}
          <div>
            <img
              src="/primary_logo.png"
              alt="Logo"
              className="w-40 object-contain mt-8"
            />
          </div>

          {/* Main Content */}
          <div className="max-w-xl">
            <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">
              Administration Panel
            </p>

            <h1 className="text-5xl font-bold leading-tight text-white">
              Gérez votre plateforme en toute simplicité
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Accédez à votre tableau de bord administrateur pour superviser les
              utilisateurs, contrôler les activités et gérer efficacement
              l’ensemble de votre système depuis une interface moderne et
              sécurisée.
            </p>

            {/* Features */}
            <div className="flex gap-10 mt-10">
              <div>
                <h3 className="text-3xl font-bold text-primary">24/7</h3>
                <p className="text-sm text-white/60 mt-1">Accès sécurisé</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-primary">100%</h3>
                <p className="text-sm text-white/60 mt-1">
                  Gestion centralisée
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-primary">Fast</h3>
                <p className="text-sm text-white/60 mt-1">
                  Interface optimisée
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/40">
            © 2026 Zuaplace. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center px-6 py-10 bg-white">
        {/* Mobile Home Link */}
        <div className="absolute top-6 left-6 lg:hidden z-20">
          <a
            href="/"
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground hover:underline transition-colors text-sm font-medium"
          >
            ← Accueil
          </a>
        </div>

        {/* Background Glow */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-2xl overflow-hidden">
            <CardHeader className="text-center pt-10">
              <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <UserCog className="w-8 h-8 text-white" />
              </div>

              <CardTitle className="font-serif text-4xl text-foreground tracking-tight">
                Portail Admin
              </CardTitle>

              <CardDescription className="text-muted-foreground mt-2">
                Connectez-vous pour gérer votre établissement
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-10 pt-4">
              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium ml-1"
                  >
                    Email professionnel
                  </Label>

                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@zuaplace.com"
                      className="pl-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground font-medium ml-1"
                  >
                    Mot de passe
                  </Label>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-11 pr-12 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
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
      </div>
    </div>
  );
}
