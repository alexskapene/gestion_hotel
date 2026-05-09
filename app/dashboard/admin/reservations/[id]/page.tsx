"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Hotel, 
  BedDouble, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Simulation de données détaillées
const mockReservationDetails = {
  id: "RES-7842",
  status: "CONFIRMED",
  paymentStatus: "PAID",
  createdAt: "2024-05-01 10:30",
  checkIn: "2024-05-15",
  checkOut: "2024-05-20",
  nights: 5,
  totalPrice: 750,
  client: {
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "+243 81 222 3333",
    address: "Kinshasa, RDC"
  },
  hotel: {
    name: "Zua Palace Kinshasa",
    address: "45 Avenue Colonel Mondjiba, Gombe, Kinshasa",
    phone: "+243 81 000 0000"
  },
  room: {
    number: "102",
    title: "Chambre Deluxe Vue Mer",
    category: "Deluxe",
    pricePerNight: 150
  },
  payment: {
    method: "Visa Card **** 4242",
    transactionId: "TXN-998877",
    date: "2024-05-01 10:35"
  }
};

export default function ReservationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/admin/reservations">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-foreground">Détails Réservation</h1>
              <Badge className="bg-green-500/10 text-green-600 border-green-200">Confirmée</Badge>
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-1">ID: {id || mockReservationDetails.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" /> Imprimer
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Facture PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Card */}
          <Card className="border-none shadow-xl bg-card overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">Informations de Séjour</CardTitle>
                <CardDescription>Détails des dates et de l&apos;hébergement</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{mockReservationDetails.totalPrice}$</p>
                <p className="text-xs text-muted-foreground">Total pour {mockReservationDetails.nights} nuits</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Calendar className="text-primary w-6 h-6 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Arrivée (Check-in)</p>
                    <p className="text-lg font-bold">{mockReservationDetails.checkIn}</p>
                    <p className="text-xs text-muted-foreground">Après 14:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Calendar className="text-primary w-6 h-6 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Départ (Check-out)</p>
                    <p className="text-lg font-bold">{mockReservationDetails.checkOut}</p>
                    <p className="text-xs text-muted-foreground">Avant 11:00</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Hébergement</p>
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                       <BedDouble className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="font-bold">{mockReservationDetails.room.title}</p>
                       <p className="text-sm text-muted-foreground">Chambre {mockReservationDetails.room.number} • {mockReservationDetails.room.category}</p>
                     </div>
                   </div>
                </div>
                <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Établissement</p>
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                       <Hotel className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="font-bold">{mockReservationDetails.hotel.name}</p>
                       <p className="text-xs text-muted-foreground line-clamp-1">{mockReservationDetails.hotel.address}</p>
                     </div>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline / History */}
          <Card className="border-none shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Historique de la réservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-8 border-l-2 border-muted space-y-8">
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-card" />
                  <div>
                    <p className="text-sm font-bold">Paiement effectué</p>
                    <p className="text-xs text-muted-foreground">{mockReservationDetails.payment.date}</p>
                    <p className="text-xs mt-1">Transaction {mockReservationDetails.payment.transactionId} via {mockReservationDetails.payment.method}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-card" />
                  <div>
                    <p className="text-sm font-bold">Réservation confirmée</p>
                    <p className="text-xs text-muted-foreground">01 Mai 2024 à 10:32</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-card" />
                  <div>
                    <p className="text-sm font-bold">Demande de réservation créée</p>
                    <p className="text-xs text-muted-foreground">{mockReservationDetails.createdAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Client & Payment Details */}
        <div className="space-y-6">
          {/* Client Card */}
          <Card className="border-none shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Informations Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {mockReservationDetails.client.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{mockReservationDetails.client.name}</p>
                  <p className="text-xs text-muted-foreground">Client depuis Mai 2024</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{mockReservationDetails.client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{mockReservationDetails.client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{mockReservationDetails.client.address}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border">
              <Button variant="ghost" className="w-full text-xs text-primary font-bold">VOIR LE PROFIL COMPLET</Button>
            </CardFooter>
          </Card>

          {/* Payment Card */}
          <Card className="border-none shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge className="bg-primary text-white">PAYÉ</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Méthode</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Visa **** 4242
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">01/05/2024 10:35</span>
              </div>
              <div className="p-3 bg-yellow-500/5 border border-yellow-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-[10px] text-yellow-700 leading-relaxed font-medium">
                  Le paiement a été traité via la passerelle sécurisée. Les fonds sont en attente de transfert vers l&apos;établissement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
