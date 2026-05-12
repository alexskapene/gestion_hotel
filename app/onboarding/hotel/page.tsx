"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const hotelTypes = [
  "HOTEL",
  "MOTEL",
  "RESORT",
  "APARTMENT",
  "VILLA",
  "HOSTEL",
  "LODGE",
  "GUEST_HOUSE",
];

export default function HotelOnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("HOTEL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    window.location.href = "/dashboard/hotel";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground hover:text-underline transition"
          >
            ← Accueil
          </Link>

          <h1 className="text-3xl font-semibold mt-3">
            Finaliser l’inscription de l’hôtel
          </h1>

          <p className="text-sm text-muted-foreground">
            Complétez les informations de votre établissement
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de l'hôtel</label>
                <Input className="h-11" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Courte description
                </label>
                <Textarea className="min-h-[150px]" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type d’hôtel</label>

                <div className="grid grid-cols-2 gap-2">
                  {hotelTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`
                        border px-3 py-3 text-xs transition
                        ${
                          selectedType === type
                            ? "bg-primary text-white border-primary"
                            : "hover:bg-muted"
                        }
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4 flex flex-col">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de l'hôtel</label>
                <Input type="email" className="h-11" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pays</label>
                  <Input placeholder="Pays" className="h-11" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ville</label>
                  <Input placeholder="Ville" className="h-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse complète</label>
                <Input
                  placeholder="Rue, quartier..."
                  className="h-11"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mot de passe</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  required
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  required
                />
              </div>

              {/* BUTTON */}
              <div className="mt-auto pt-6">
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Finaliser l'inscription"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
