import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hotel,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Réservations Actives",
    value: "2",
    icon: CalendarDays,
    color: "bg-green-500/10 text-green-500",
  },
  {
    label: "Hôtels Visités",
    value: "5",
    icon: Hotel,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    label: "Nuits Totales",
    value: "12",
    icon: Clock,
    color: "bg-blue-500/10 text-blue-500",
  },
];

const recentReservations = [
  {
    id: 1,
    hotel: "Hôtel Ituri Palace",
    room: "Suite Deluxe",
    checkIn: "15 Avril 2026",
    checkOut: "18 Avril 2026",
    status: "confirmed",
    price: 255,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop",
  },
  {
    id: 2,
    hotel: "Grand Hôtel du Lac",
    room: "Chambre Double",
    checkIn: "25 Mai 2026",
    checkOut: "27 Mai 2026",
    status: "pending",
    price: 130,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=150&fit=crop",
  },
];

const recommendedHotels = [
  {
    id: 1,
    name: "Résidence Mahagi",
    city: "Mahagi",
    rating: 4.5,
    price: 50,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Hôtel Sunrise",
    city: "Bunia",
    rating: 4.7,
    price: 75,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Villa Tropicale",
    city: "Djugu",
    rating: 4.4,
    price: 55,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop",
  },
];

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Bienvenue, Jean!
          </h2>
          <p className="text-muted-foreground">
            Voici un aperçu de vos activités récentes
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/hotels">
            Réserver une Chambre
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-serif text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reservations */}
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-xl">
            Réservations Récentes
          </CardTitle>
          <Button
            asChild
            variant="ghost"
            className=" text-foreground hover:underline bg-transparent hover:text-foreground hover:bg-transparent transition-colors"
          >
            <Link href="/dashboard/client/reservations">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 hover:bg-muted transition-colors"
            >
              <div
                className="w-full sm:w-32 h-24 bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${reservation.image})` }}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {reservation.hotel}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {reservation.room}
                    </p>
                  </div>
                  <Badge
                    className={` ${
                      reservation.status === "confirmed"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-orange-500/10 text-orange-500"
                    }`}
                  >
                    {reservation.status === "confirmed" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Confirmé
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        En attente
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {reservation.checkIn} - {reservation.checkOut}
                  </span>
                  <span className="font-semibold text-foreground">
                    ${reservation.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommended Hotels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold">
            Hôtels Recommandés
          </h3>
          <Button
            asChild
            variant="ghost"
            className="text-foreground hover:underline bg-transparent hover:text-foreground hover:bg-transparent transition-colors"
          >
            <Link href="/hotels">
              Voir plus
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedHotels.map((hotel) => (
            <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
              <Card className=" overflow-hidden hover:shadow-lg transition-shadow group">
                <div
                  className="h-36 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${hotel.image})` }}
                />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {hotel.name}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {hotel.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      {hotel.rating}
                    </div>
                  </div>
                  <p className="mt-2 text-primary font-semibold">
                    ${hotel.price}
                    <span className="text-muted-foreground font-normal text-sm">
                      /nuit
                    </span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
