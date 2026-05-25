"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ClientReservationCard } from "@/components/dashboard/ClientReservationCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  AlertTriangle,
  History,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientHistoryPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("ALL");
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session, status, activeTab]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== "ALL") {
        params.set("status", activeTab);
      }

      const response = await fetch(`/api/clients/history?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement de l'historique");
      }

      const data = await response.json();
      setReservations(data);
      setError(null);
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
          <History className="w-8 h-8 text-primary" />
          Historique
        </h1>
        <p className="text-muted-foreground mt-1">
          Retrouvez tous vos séjours passés et réservations terminées.
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ALL">Tous</TabsTrigger>
          <TabsTrigger value="COMPLETED">Terminées</TabsTrigger>
          <TabsTrigger value="CANCELLED">Annulées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : reservations.length > 0 ? (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <ClientReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  Aucun séjour dans votre historique
                  {activeTab !== "ALL" ? " pour ce filtre" : ""}.
                </p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/client/hotels">
                    Parcourir les hôtels
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
