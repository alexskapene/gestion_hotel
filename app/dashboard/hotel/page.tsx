"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CalendarDays, 
  Hotel, 
  DollarSign, 
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BedDouble,
  Plus
} from "lucide-react"
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalReservations: number;
  currentMonthReservations: number;
  monthlyRevenue: number;
  occupancyRate: number;
  recentReservations: any[];
  roomOccupancy: any[];
}

export default function HotelDashboardPage() {
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
      const response = await fetch("/api/hotels/dashboard", {
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
        <div className="text-center py-12">
          <p className="text-destructive font-semibold mb-4">{error || "Erreur lors du chargement du dashboard"}</p>
          <Button onClick={fetchDashboardStats}>Réessayer</Button>
        </div>
      </div>
    );
  }

  const statsCards = [
    { label: "Chambres Totales", value: stats.totalRooms.toString(), icon: BedDouble, color: "bg-primary/10 text-primary", change: "+2" },
    { label: "Chambres Disponibles", value: stats.availableRooms.toString(), icon: Hotel, color: "bg-chart-3/10 text-chart-3", change: stats.occupiedRooms.toString() },
    { label: "Réservations ce mois", value: stats.currentMonthReservations.toString(), icon: CalendarDays, color: "bg-accent/10 text-accent", change: "+12" },
    { label: "Revenus du mois", value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-chart-4/10 text-chart-4", change: "+15%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Tableau de Bord
          </h2>
          <p className="text-muted-foreground mt-1">
            Bienvenue sur votre espace de gestion
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/hotel/rooms">
              Gérer les Chambres
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/dashboard/hotel/rooms/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Chambre
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="rounded-full text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-serif text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl">Réservations Récentes</CardTitle>
            <Button asChild variant="ghost" className="rounded-full text-primary">
              <Link href="/dashboard/hotel/reservations">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReservations && stats.recentReservations.length > 0 ? (
                stats.recentReservations.map((reservation) => (
                  <div 
                    key={reservation.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{reservation.user?.username || "Client"}</p>
                        <p className="text-sm text-muted-foreground">Chambre {reservation.room?.roomNumber} - {reservation.room?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(reservation.checkIn), "dd MMMM yyyy", { locale: fr })} - {format(new Date(reservation.checkOut), "dd MMMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={`rounded-full mb-1 ${
                          reservation.status === "CONFIRMED" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {reservation.status === "CONFIRMED" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Confirmé
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {reservation.status}
                          </>
                        )}
                      </Badge>
                      <p className="font-semibold text-primary">${reservation.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune réservation récente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room Occupancy */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Occupation des Chambres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.roomOccupancy && stats.roomOccupancy.length > 0 ? (
              <>
                {stats.roomOccupancy.map((room, index) => {
                  const percentage = room.total > 0 ? Math.round((room.occupied / room.total) * 100) : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{room.type}</span>
                        <span className="text-muted-foreground">
                          {room.occupied}/{room.total}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taux d&apos;occupation global</span>
                    <span className="font-serif text-xl font-bold text-primary">{stats.occupancyRate}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucune chambre disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 rounded-xl flex-col gap-2">
              <Link href="/dashboard/hotel/rooms/new">
                <Plus className="w-6 h-6" />
                <span>Ajouter une Chambre</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 rounded-xl flex-col gap-2">
              <Link href="/dashboard/hotel/reservations">
                <CalendarDays className="w-6 h-6" />
                <span>Voir Réservations</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 rounded-xl flex-col gap-2">
              <Link href="/dashboard/hotel/profile">
                <Hotel className="w-6 h-6" />
                <span>Modifier Profil</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 rounded-xl flex-col gap-2">
              <Link href="/dashboard/hotel/settings">
                <DollarSign className="w-6 h-6" />
                <span>Abonnement</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
