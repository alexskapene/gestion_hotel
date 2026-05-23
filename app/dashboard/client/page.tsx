"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Hotel,
  Clock,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardStats {
  activeReservations: number;
  totalReservations: number;
  totalSpent: number;
  visitedHotels: number;
  totalNights: number;
  recentReservations: any[];
  upcomingReservations: any[];
}

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (session?.user?.id) {
      fetchDashboardStats();
    }
  }, [session, status]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/clients/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error || "Erreur de chargement"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getReservationStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      CONFIRMED: { label: "Confirmée", variant: "default" },
      PENDING: { label: "En attente", variant: "secondary" },
      CANCELLED: { label: "Annulée", variant: "destructive" },
      COMPLETED: { label: "Complétée", variant: "outline" },
    };
    const mapping = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={mapping.variant}>{mapping.label}</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Bienvenue, {session?.user?.name || "Client"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Retrouvez ici un résumé de vos réservations et statistiques.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Télécharger les relevés
          </Button>
          <Link href="/dashboard/client/hotels">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Parcourir les Hôtels
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations Actives
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En cours ou confirmées
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Dépensé
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalSpent / 100).toFixed(2)}
            </div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Sur {stats.totalReservations} réservations
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hôtels Visités
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Hotel className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitedHotels}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Destinations explorées
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nuits Totales
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNights}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Nuits passées en hôtels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reservations */}
      {stats.upcomingReservations.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Réservations à Venir
            </CardTitle>
            <CardDescription>
              Vos prochaines réservations confirmées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.upcomingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {reservation.room.hotel.logo && (
                      <img
                        src={reservation.room.hotel.logo}
                        alt={reservation.room.hotel.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {reservation.room.hotel.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {reservation.room.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(
                          new Date(reservation.checkIn),
                          "d MMM yyyy",
                          { locale: fr }
                        )}{" "}
                        →{" "}
                        {format(new Date(reservation.checkOut), "d MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">
                    ${reservation.totalPrice.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reservations Table */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Historique des Réservations</CardTitle>
          <CardDescription>Vos 5 dernières réservations</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentReservations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hôtel</TableHead>
                    <TableHead>Chambre</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.room.hotel.name}
                      </TableCell>
                      <TableCell>{reservation.room.title}</TableCell>
                      <TableCell>
                        {format(new Date(reservation.checkIn), "d MMM yy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.checkOut), "d MMM yy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>${reservation.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {getReservationStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/client/reservations/${reservation.id}`}>
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation trouvée</p>
              <Link href="/dashboard/client/hotels" className="mt-4 inline-block">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Faire une réservation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
