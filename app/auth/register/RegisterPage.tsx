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
import { Hotel, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultTab = searchParams.get("type") === "hotel" ? "hotel" : "client";

  const [activeTab, setActiveTab] = useState<"client" | "hotel">(
    defaultTab as "client" | "hotel",
  );

  const [isLoading, setIsLoading] = useState(false);

  // Client form state
  const [clientForm, setClientForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Hotel owner form state (manager only)
  const [hotelForm, setHotelForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      let payload: any = {};

      if (activeTab === "client") {
        payload = {
          email: clientForm.email,
          password: clientForm.password,
          username: clientForm.username,
          role: "CLIENT",
        };
      } else {
        payload = {
          email: hotelForm.email,
          password: hotelForm.password,
          username: hotelForm.username,
          role: "HOTEL_OWNER",
        };
      }

      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erreur lors de la création du compte");
      }

      toast.success("Compte créé avec succès");

      const type = activeTab === "hotel" ? "hotel" : "client";
      router.replace(`/onboarding?type=${type}`);
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err?.message || "Impossible de créer le compte");
    } finally {
      setIsLoading(false);
    }
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

          <Card className="bg-white border-0 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="font-serif text-3xl">
                Créer un compte
              </CardTitle>

              <CardDescription>Rejoignez Zua Place</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "client" | "hotel")
                }
                className="w-full"
              >
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom d'utilisateur</label>
                      <Input
                        type="text"
                        placeholder="votre nom ou pseudo"
                        required
                        value={clientForm.username}
                        onChange={(e) => setClientForm((p) => ({ ...p, username: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>

                      <Input
                        type="email"
                        placeholder="exemple@gmail.com"
                        required
                        value={clientForm.email}
                        onChange={(e) => setClientForm((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mot de passe</label>

                      <Input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={clientForm.password}
                        onChange={(e) => setClientForm((p) => ({ ...p, password: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Téléphone (optionnel)</label>
                      <Input
                        type="text"
                        placeholder="+243..."
                        value={clientForm.phone}
                        onChange={(e) => setClientForm((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        "Continuer"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* HOTEL */}
                <TabsContent value="hotel">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom du gérant (utilisateur)</label>
                      <Input
                        type="text"
                        placeholder="Nom ou pseudo du gérant"
                        required
                        value={hotelForm.username}
                        onChange={(e) => setHotelForm((p) => ({ ...p, username: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email professionnel</label>

                      <Input
                        type="email"
                        placeholder="hotel@gmail.com"
                        required
                        value={hotelForm.email}
                        onChange={(e) => setHotelForm((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mot de passe</label>

                      <Input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={hotelForm.password}
                        onChange={(e) => setHotelForm((p) => ({ ...p, password: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        "Continuer"
                      )}
                    </Button>
                  </form>
                </TabsContent>
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
