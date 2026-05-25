"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
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

type Props = {
  reservation: any;
  showActions?: boolean;
};

export function ClientReservationCard({
  reservation,
  showActions = true,
}: Props) {
  const status = statusConfig[reservation.status] ?? statusConfig.PENDING;
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
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-lg">
                    {reservation.room?.hotel?.name}
                  </h3>
                  <Badge className={`${status.class}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {reservation.room?.title} - Chambre{" "}
                  {reservation.room?.roomNumber}
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
                        <Badge className={`${status.class}`}>{status.label}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nombre d&apos;hôtes</p>
                        <p className="font-semibold">{reservation.guests}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-3 text-sm">
                      <h4 className="font-semibold">Informations de l&apos;hôtel</h4>
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

              {showActions && reservation.status === "PENDING" && (
                <Button className="bg-primary hover:bg-primary/90">Payer</Button>
              )}
              {showActions && reservation.status === "CONFIRMED" && (
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
