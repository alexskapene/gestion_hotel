"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CalendarDays, Users, Phone, Mail, CheckCircle2, AlertCircle, XCircle, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  PENDING: {
    label: "En attente",
    icon: AlertCircle,
    className: "bg-accent/10 text-accent",
  },
  CONFIRMED: {
    label: "Confirmée",
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary",
  },
  COMPLETED: {
    label: "Terminée",
    icon: Clock,
    className: "bg-muted text-muted-foreground",
  },
  CANCELLED: {
    label: "Annulée",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
};

type ReservationStatus = keyof typeof statusConfig | "all";

interface HotelReservation {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  paidAmount: number;
  guests: number;
  status: keyof typeof statusConfig;
  room: {
    title: string;
    roomNumber: string;
    hotel: {
      id: string;
      name: string;
      city: string;
    };
  };
  user: {
    username?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}

export default function HotelReservationsPage() {
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch("/api/hotels/me");
        if (!response.ok) {
          throw new Error("Impossible de récupérer l'hôtel");
        }
        const data = await response.json();
        setHotelId(data?.id || data?.hotel?.id || null);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer l'hôtel");
      }
    };

    fetchHotel();
  }, []);

  useEffect(() => {
    if (!hotelId) return;

    const fetchReservations = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (fromDate) params.set("from", fromDate);
        if (toDate) params.set("to", toDate);

        const url = `/api/reservations/hotel/${hotelId}?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          const body = await response.json();
          throw new Error(body?.error || "Erreur lors du chargement des réservations");
        }

        const data = await response.json();
        setReservations(data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Erreur réseau");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [hotelId, statusFilter, searchQuery, fromDate, toDate, refreshKey]);

  const stats = {
    total: reservations.length,
    pending: reservations.filter((item) => item.status === "PENDING").length,
    confirmed: reservations.filter((item) => item.status === "CONFIRMED").length,
    completed: reservations.filter((item) => item.status === "COMPLETED").length,
    cancelled: reservations.filter((item) => item.status === "CANCELLED").length,
    deposit: reservations.reduce((sum, item) => sum + (item.paidAmount || 0), 0),
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setFromDate("");
    setToDate("");
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold">Gestion des réservations</h2>
        <p className="text-muted-foreground">
          Consultez et filtrez les réservations de votre établissement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-serif text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="font-serif text-2xl font-bold text-accent">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Confirmées</p>
            <p className="font-serif text-2xl font-bold text-primary">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Acomptes</p>
            <p className="font-serif text-2xl font-bold text-chart-4">${stats.deposit}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4">
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par client, chambre, réservation..."
            className="pl-11"
          />
        </div>
        <Button onClick={handleClearFilters} variant="outline" className="h-11">
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium">Statut</label>
          <select
            className="mt-2 block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus)}
          >
            <option value="all">Toutes</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmées</option>
            <option value="COMPLETED">Terminées</option>
            <option value="CANCELLED">Annulées</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Arrivée à partir de</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Départ avant</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="rounded-2xl animate-pulse h-40" />
          ))}
        </div>
      ) : error ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-semibold">{error}</p>
            <Button className="mt-4" onClick={() => setRefreshKey((prev) => prev + 1)}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : reservations.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucune réservation</h3>
            <p className="text-muted-foreground">
              Aucun enregistrement ne correspond aux filtres sélectionnés.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const status = statusConfig[reservation.status];
            const StatusIcon = status.icon;
            const guestName = reservation.user?.username || reservation.user?.email || "Client";
            return (
              <Card key={reservation.id} className="rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{guestName}</p>
                        <div className="mt-1 text-sm text-muted-foreground space-y-1">
                          {reservation.user?.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {reservation.user.email}
                            </div>
                          )}
                          {reservation.user?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {reservation.user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{reservation.room.title} — Chambre {reservation.room.roomNumber}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(reservation.checkIn).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} — {new Date(reservation.checkOut).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-sm text-muted-foreground">{reservation.guests} personne(s)</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`rounded-full px-3 py-1 ${status.className}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                      <div className="text-right space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Total: <span className="font-semibold text-foreground">€{reservation.totalPrice}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Acompte: <span className="font-semibold text-primary">€{reservation.paidAmount}</span>
                        </p>
                      </div>
                    </div>

                    {reservation.status === "PENDING" && (
                      <div className="flex gap-2 flex-col lg:flex-row">
                        <Button size="sm" className="rounded-full bg-primary">
                          <Check className="w-4 h-4 mr-1" />
                          Confirmer
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full text-destructive">
                          <X className="w-4 h-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
