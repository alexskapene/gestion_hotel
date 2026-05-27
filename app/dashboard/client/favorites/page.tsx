"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { HotelCard } from "@/components/HotelCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CalendarDays,
  Heart,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Hotel } from "@/types/types";

type VisitedHotel = Hotel & {
  reservationCount: number;
  lastCheckIn: string;
  lastCheckOut: string;
};

export default function ClientFavoritesPage() {
  const { data: session, status } = useSession();
  const [hotels, setHotels] = useState<VisitedHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (session?.user?.id) {
      fetchFavorites();
    }
  }, [session, status]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/clients/favorites");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement de vos hôtels favoris");
      }

      const data = await response.json();
      setHotels(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary fill-primary/20" />
          Mes Favoris
        </h1>
        <p className="text-muted-foreground mt-1">
          Les hôtels où vous avez déjà effectué au moins une réservation.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={String(hotel.id)} className="relative">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <Badge className="bg-primary text-primary-foreground shadow-md">
                  {hotel.reservationCount}{" "}
                  {hotel.reservationCount > 1 ? "séjours" : "séjour"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-background/90 backdrop-blur-sm shadow-sm text-xs"
                >
                  <CalendarDays className="w-3 h-3 mr-1" />
                  Dernier :{" "}
                  {format(new Date(hotel.lastCheckOut), "d MMM yyyy", {
                    locale: fr,
                  })}
                </Badge>
              </div>
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
            <p className="text-muted-foreground">
              Vous n&apos;avez pas encore réservé d&apos;hôtel. Vos favoris
              apparaîtront ici après votre première réservation.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/client/hotels">
                Découvrir les hôtels
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
