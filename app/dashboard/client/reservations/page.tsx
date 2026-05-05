"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Reservations } from "@/data/mockData";
import type { Reservation } from "@/types/types";

const statusConfig: Record<
  Reservation["status"],
  {
    label: string;
    icon: any;
    class: string;
  }
> = {
  confirmed: {
    label: "Confirmé",
    icon: CheckCircle2,
    class: "bg-primary/10 text-primary",
  },
  pending: {
    label: "En attente",
    icon: AlertCircle,
    class: "bg-accent/10 text-accent",
  },
  completed: {
    label: "Terminé",
    icon: Clock,
    class: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Annulé",
    icon: XCircle,
    class: "bg-destructive/10 text-destructive",
  },
};

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const status = statusConfig[reservation.status];
  const StatusIcon = status.icon;

  return (
    <Card className="rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-48 h-40 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${reservation.image})` }}
        />

        <CardContent className="flex-1 p-5">
          <div className="flex justify-between gap-4 flex-col sm:flex-row">
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{reservation.hotel}</h3>

                  <Badge className={`rounded-full ${status.class}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm">
                  {reservation.room} - Chambre {reservation.roomNumber}
                </p>
              </div>

              <div className="flex gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {reservation.checkIn} - {reservation.checkOut}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {reservation.hotelAddress}
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-semibold text-primary">
                    ${reservation.price}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Acompte</p>
                  <p className="font-semibold">${reservation.acompte}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Reste</p>
                  <p className="font-semibold">
                    ${reservation.price - reservation.acompte}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{reservation.hotel}</DialogTitle>
                    <DialogDescription>
                      Détails de la réservation
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div
                      className="w-full h-48 bg-cover rounded-xl"
                      style={{ backgroundImage: `url(${reservation.image})` }}
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>Chambre</p>
                        <p>{reservation.room}</p>
                      </div>

                      <div>
                        <p>Numéro</p>
                        <p>{reservation.roomNumber}</p>
                      </div>

                      <div>
                        <p>Check-in</p>
                        <p>{reservation.checkIn}</p>
                      </div>

                      <div>
                        <p>Check-out</p>
                        <p>{reservation.checkOut}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4" />
                        {reservation.hotelAddress}
                      </div>

                      <div className="flex gap-2">
                        <Phone className="w-4 h-4" />
                        {reservation.hotelPhone}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {reservation.status === "pending" && (
                <Button className="rounded-full">Payer</Button>
              )}

              {reservation.status === "confirmed" && (
                <Button variant="outline" className="rounded-full">
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
  const [activeTab, setActiveTab] = useState<"all" | Reservation["status"]>(
    "all",
  );

  const filtered =
    activeTab === "all"
      ? Reservations
      : Reservations.filter((r) => r.status === activeTab);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes Réservations</h2>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="rounded-full">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filtered.length ? (
            <div className="space-y-4">
              {filtered.map((r) => (
                <ReservationCard key={r.id} reservation={r} />
              ))}
            </div>
          ) : (
            <p>Aucune réservation</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
