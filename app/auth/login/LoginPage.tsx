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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Hotel, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("type") === "hotel" ? "hotel" : "client";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pre-check: ensure user exists and is verified before calling signIn
      try {
        const checkRes = await fetch("/api/auth/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        if (checkRes.ok) {
          const info = await checkRes.json();
          if (info.exists && info.isVerified === false) {
            const msg = "[AUTH_ERROR]: Votre compte n'est pas encore vérifié. Veuillez valider votre email.";
            toast.error(msg);
            console.error(msg);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        // if pre-check fails, continue to attempt signIn (don't block due to check failure)
        console.warn("Pre-check failed, proceeding to signIn", err);
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login failed:", result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to the dashboard landing page.
      // The dashboard page will forward the user to the correct role-specific dashboard.
      router.push("/dashboard");
    } catch (error) {
      console.error("An error occurred during login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* LEFT IMAGE (hidden on mobile) */}
      <div
        className="relative hidden md:flex w-1/2 min-h-screen bg-cover bg-center flex-col"
        style={{
          backgroundImage: "url('/room.jpg')",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col h-full text-white px-10 py-8">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition"
          >
            ← Accueil
          </Link>

          {/* CENTER */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold mb-4">Bienvenue !</h1>

            <p className="text-sm text-white/80 max-w-md">
              Rejoins-nous et découvre les meilleurs hôtels. Crée ton compte et
              commence à réserver facilement tes prochains séjours.
            </p>
          </div>

          {/* FOOTER */}
          <div className="text-xs text-white/50 text-center pt-6">
            © {new Date().getFullYear()} Zua Place. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* RIGHT FORM (full width on mobile) */}
      <div className="min-h-screen w-full md:w-1/2 bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* MOBILE BACK BUTTON */}
          <div className="md:hidden mb-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Accueil
            </Link>
          </div>

          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-3xl">Bon retour</CardTitle>
              <CardDescription>
                Accédez à votre compte Zua place
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="client"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Client
                  </TabsTrigger>

                  <TabsTrigger
                    value="hotel"
                    className="flex items-center gap-2"
                  >
                    <Hotel className="w-4 h-4" />
                    Hôtel
                  </TabsTrigger>
                </TabsList>

                {/* CLIENT */}
                <TabsContent value="client">
                  <form
                    onSubmit={(e) => handleSubmit(e, "client")}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-11"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Mot de passe
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-11 pr-11"
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Mot de passe oublié?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        "Se Connecter"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* HOTEL */}
                <TabsContent value="hotel">
                  <form
                    onSubmit={(e) => handleSubmit(e, "hotel")}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email de l&apos;établissement
                      </label>

                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <Input
                          type="email"
                          placeholder="hotel@exemple.com"
                          className="pl-11"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Mot de passe
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-11 pr-11"
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Mot de passe oublié?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        "Se Connecter"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Pas encore de compte?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  Créer un compte
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
