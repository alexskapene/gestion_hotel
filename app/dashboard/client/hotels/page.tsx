"use client";

import { HotelCard } from "@/components/HotelCard";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HotelsPage() {
  const { data: session, status } = useSession();
  const [hotels, setHotels] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>(["Tous"]);
  const [selectedCity, setSelectedCity] = useState("Tous");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (session?.user?.id) {
      fetchCities();
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHotels();
    }
  }, [selectedCity, session?.user?.id]);

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/clients/available-hotels/cities");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des villes");
      }

      const data = await response.json();
      setCities(data.cities);
    } catch (err) {
      console.error("Erreur chargement villes:", err);
    }
  };

  const fetchHotels = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (selectedCity !== "Tous") {
        params.set("city", selectedCity);
      }

      const response = await fetch(
        `/api/clients/available-hotels?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des hôtels");
      }

      const data = await response.json();
      setHotels(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity]);

  return (
    <div className="px-4 md:px-10 py-6 overflow-x-hidden">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold">Hôtels disponibles</h1>
        <p className="text-muted-foreground">Trouve ton séjour parfait</p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-start items-center gap-2 mb-4">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`flex-1 md:flex-0 px-4 py-2 text-sm border transition ${
              selectedCity === city
                ? "bg-black text-white border-black"
                : "bg-white text-black border-border hover:border-foreground"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={`${hotel.id}-${hotel.name}`} hotel={hotel} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Aucun hôtel disponible pour cette sélection
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
