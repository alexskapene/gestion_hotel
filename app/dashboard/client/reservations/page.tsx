"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Phone,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: any;
    class: string;
  }
> = {
  CONFIRMED: {
    label: "Confirmée",
    icon: CheckCircle2,
    class: "bg-green-500/10 text-green-500",
  },
  PENDING: {
    label: "En attente",
    icon: AlertCircle,
    class: "bg-orange-500/10 text-orange-500",
  },
  COMPLETED: {
    label: "Terminée",
    icon: Clock,
    class: "bg-primary/10 text-primary",
  },
  CANCELLED: {
    label: "Annulée",
    icon: XCircle,
    class: "bg-destructive/10 text-destructive",
  },
};

function ReservationCard({ reservation }: { reservation: any }) {
  const status = statusConfig[reservation.status];
  const StatusIcon = status.icon;

  const imageUrl =
    reservation.room?.images?.[0]?.imageUrl ||
    reservation.room?.hotel?.coverImage ||
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop";

  const totalPrice = reservation.totalPrice || 0;
  const paidAmount = reservation.paidAmount || 0;
  const remaining = totalPrice - paidAmount;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-48 h-40 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <CardContent className="flex-1 p-5">
          <div className="flex justify-between gap-4 flex-col sm:flex-row">
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">
                    {reservation.room?.hotel?.name}
                  </h3>

                  <Badge className={`${status.class}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm">
                  {reservation.room?.title} - Chambre {reservation.room?.roomNumber}
                </p>
              </div>

              <div className="flex gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {format(new Date(reservation.checkIn), "d MMM yyyy", {
                    locale: fr,
                  })}{" "}
                  -{" "}
                  {format(new Date(reservation.checkOut), "d MMM yyyy", {
                    locale: fr,
                  })}
                </div>

                {reservation.room?.hotel?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {reservation.room.hotel.city}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-semibold text-primary">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Payé</p>
                  <p className="font-semibold">${paidAmount.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Reste</p>
                  <p className="font-semibold text-orange-500">
                    ${remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-transparent shadow-none"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{reservation.room?.hotel?.name}</DialogTitle>
                    <DialogDescription>
                      Réservation #{reservation.id}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div
                      className="w-full h-64 bg-cover rounded-lg"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Chambre</p>
                        <p className="font-semibold">{reservation.room?.title}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Numéro</p>
                        <p className="font-semibold">
                          {reservation.room?.roomNumber}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Check-in</p>
                        <p className="font-semibold">
                          {format(new Date(reservation.checkIn), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Check-out</p>
                        <p className="font-semibold">
                          {format(new Date(reservation.checkOut), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Statut</p>
                        <Badge className={`${status.class}`}>
                          {status.label}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Nombre d'hôtes</p>
                        <p className="font-semibold">{reservation.guests}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3 text-sm">
                      <h4 className="font-semibold">Informations de l'hôtel</h4>
                      <div className="space-y-2">
                        {reservation.room?.hotel?.address && (
                          <div className="flex gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{reservation.room.hotel.address}</span>
                          </div>
                        )}
                        {reservation.room?.hotel?.phone && (
                          <div className="flex gap-2">
                            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{reservation.room.hotel.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                      <h4 className="font-semibold">Montants</h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payé</span>
                        <span className="font-semibold">
                          ${paidAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-muted-foreground">À payer</span>
                        <span className="font-semibold text-orange-500">
                          ${remaining.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {reservation.status === "PENDING" && (
                <Button className="bg-primary hover:bg-primary/90">
                  Payer
                </Button>
              )}

              {reservation.status === "CONFIRMED" && (
                <Button
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function ClientReservationsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"ALL" | string>("ALL");
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (session?.user?.id) {
      fetchReservations();
    }
  }, [session, status, activeTab]);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (activeTab !== "ALL") {
        params.set("status", activeTab);
      }

      const response = await fetch(
        `/api/clients/reservations?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des réservations");
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Mes Réservations
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez et consultez toutes vos réservations d'hôtels
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
          <TabsTrigger value="ALL">Toutes</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmées</TabsTrigger>
          <TabsTrigger value="PENDING">En attente</TabsTrigger>
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
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Aucune réservation{" "}
                  {activeTab !== "ALL" &&
                    `avec le statut "${statusConfig[activeTab]?.label || activeTab}"`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
