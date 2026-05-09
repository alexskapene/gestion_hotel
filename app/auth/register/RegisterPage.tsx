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
import { Hotel, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("type") === "hotel" ? "hotel" : "client";

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();

    if (isLoading) return; // bloque double clic

    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    router.replace(`/onboarding?type=${type}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* LEFT IMAGE */}
      <div className="relative hidden md:flex w-1/2 min-h-screen bg-cover bg-center flex-col"
        style={{ backgroundImage: "url('/room.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col h-full text-white px-10 py-8">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition"
          >
            ← Accueil
          </Link>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold mb-4">Rejoins-nous</h1>

            <p className="text-sm text-white/80 max-w-md">
              Crée ton compte et commence à explorer les meilleurs hôtels.
            </p>
          </div>

          <div className="text-xs text-white/50 text-center pt-6">
            © {new Date().getFullYear()} Zua Place. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="min-h-screen w-full md:w-1/2 bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* MOBILE BACK */}
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
              <CardTitle className="font-serif text-3xl">
                Créer un compte
              </CardTitle>
              <CardDescription>Rejoignez Zua Place</CardDescription>
            </CardHeader>

            <CardContent>
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
                    <div>
                      <label>Email</label>
                      <Input type="email" required />
                    </div>

                    <div>
                      <label>Mot de passe</label>
                      <Input type="password" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Continuer
                    </Button>
                  </form>
                </TabsContent>
                {/* HOTEL */}
                <TabsContent value="hotel">
                  <form
                    onSubmit={(e) => handleSubmit(e, "hotel")}
                    className="space-y-4"
                  >
                    <div>
                      <label>Email</label>
                      <Input type="email" required />
                    </div>

                    <div>
                      <label>Mot de passe</label>
                      <Input type="password" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Continuer
                    </Button>
                  </form>
                </TabsContent>{" "}
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
