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
  const [userCreated, setUserCreated] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  // Client form state
  const [clientForm, setClientForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  // Hotel owner form state (manager only)
  const [hotelForm, setHotelForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Hotel details form state
  const [hotelDetailsForm, setHotelDetailsForm] = useState({
    hotelName: "",
    city: "",
    address: "",
    phone: "",
    country: "",
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
          phone: clientForm.phone,
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

      if (activeTab === "client") {
        // Redirect to login for client
        router.replace("/auth/login?type=client");
      } else {
        // For hotel owner, show hotel details form
        setCreatedUserId(data.id);
        setUserCreated(true);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err?.message || "Impossible de créer le compte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !createdUserId) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: createdUserId,
          name: hotelDetailsForm.hotelName,
          phone: hotelDetailsForm.phone,
          city: hotelDetailsForm.city,
          country: hotelDetailsForm.country,
          address: hotelDetailsForm.address,
          hotelType: "HOTEL",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur lors de la création de l'hôtel");
      }

      toast.success("Hôtel créé avec succès");
      router.replace("/auth/login?type=hotel");
    } catch (error: any) {
      toast.error(error?.message || "Impossible de créer l'hôtel");
      console.error("Hotel creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* LEFT IMAGE */}
      <div
        className="relative hidden md:flex w-1/2 min-h-screen bg-cover bg-center flex-col"
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
      <div className="min-h-screen w-full md:w-1/2 bg-background flex items-start md:items-center justify-center p-4 pt-10 md:pt-4">
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
            <CardHeader className="text-center space-y-2">
              <CardTitle className="font-serif text-3xl">
                Créer un compte
              </CardTitle>

              <CardDescription>Rejoignez Zua Place</CardDescription>
            </CardHeader>

            <CardContent>
              {userCreated && activeTab === "hotel" ? (
                // HOTEL DETAILS FORM
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <CardTitle className="font-serif text-2xl">
                      Informations de l'hôtel
                    </CardTitle>
                    <CardDescription>
                      Complétez les informations primordiales de votre hôtel
                    </CardDescription>
                  </div>

                  <form onSubmit={handleHotelDetailsSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom de l'hôtel</label>
                      <Input
                        placeholder="Hôtel Paradise"
                        value={hotelDetailsForm.hotelName}
                        onChange={(e) =>
                          setHotelDetailsForm({
                            ...hotelDetailsForm,
                            hotelName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input
                        type="tel"
                        placeholder="+243..."
                        value={hotelDetailsForm.phone}
                        onChange={(e) =>
                          setHotelDetailsForm({
                            ...hotelDetailsForm,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ville</label>
                      <Input
                        placeholder="Kinshasa"
                        value={hotelDetailsForm.city}
                        onChange={(e) =>
                          setHotelDetailsForm({
                            ...hotelDetailsForm,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pays</label>
                      <Input
                        placeholder="RDC"
                        value={hotelDetailsForm.country}
                        onChange={(e) =>
                          setHotelDetailsForm({
                            ...hotelDetailsForm,
                            country: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Adresse</label>
                      <Input
                        placeholder="Rue / quartier"
                        value={hotelDetailsForm.address}
                        onChange={(e) =>
                          setHotelDetailsForm({
                            ...hotelDetailsForm,
                            address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Création...
                        </>
                      ) : (
                        "Créer l'hôtel"
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                // REGISTRATION FORMS
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
                          className="h-11"
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
                          "Créer un compte"
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
                          type="text"
                          placeholder="Ex: Hôtel Résidence"
                          className="h-11"
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
              )}

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
