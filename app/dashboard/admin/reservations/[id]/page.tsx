"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Hotel,
  BedDouble,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Users,
  Printer,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return <Badge className="bg-green-500/10 text-green-600 border-green-200">Confirmée</Badge>;
    case "PENDING":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">En attente</Badge>;
    case "COMPLETED":
      return <Badge className="bg-gray-500/10 text-gray-600 border-gray-200">Terminée</Badge>;
    case "CANCELLED":
      return <Badge className="bg-red-500/10 text-red-600 border-red-200">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ReservationDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [reservation, setReservation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservation = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger la réservation");
      }

      setReservation(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement des détails de la réservation...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Réservation introuvable</h2>
        <Button asChild>
          <Link href="/dashboard/admin/reservations">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const payment = reservation.payments?.[reservation.payments.length - 1] || {};
  const checkIn = reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString() : "-";
  const checkOut = reservation.checkOut ? new Date(reservation.checkOut).toLocaleDateString() : "-";
  const nights = reservation.checkIn && reservation.checkOut
    ? Math.max(0, Math.round((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              {getStatusBadge(reservation.status)}
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-1">ID: {reservation.id}</p>
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
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl bg-card overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">Informations de Séjour</CardTitle>
                <p className="text-sm text-muted-foreground">Détails des dates et de l&apos;hébergement</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{reservation.totalPrice}$</p>
                <p className="text-xs text-muted-foreground">Total pour {nights} nuit(s)</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Calendar className="text-primary w-6 h-6 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Arrivée (Check-in)</p>
                    <p className="text-lg font-bold">{checkIn}</p>
                    <p className="text-xs text-muted-foreground">Après 14:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Calendar className="text-primary w-6 h-6 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Départ (Check-out)</p>
                    <p className="text-lg font-bold">{checkOut}</p>
                    <p className="text-xs text-muted-foreground">Avant 11:00</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Voyageurs</p>
                      <p className="text-lg font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" /> {reservation.guests}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Montant Payé</p>
                      <p className="text-lg font-bold flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-600" /> {reservation.payments?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)}$
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Hébergement</p>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <BedDouble className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{reservation.room?.title || "-"}</p>
                        <p className="text-sm text-muted-foreground">Chambre {reservation.room?.roomNumber || "-"} • {reservation.room?.category || "-"}</p>
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
                        <p className="font-bold">{reservation.room?.hotel?.name || "-"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{reservation.room?.hotel?.address || "Adresse non disponible"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Historique de la réservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-8 border-l-2 border-muted space-y-8">
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-card" />
                  <div>
                    <p className="text-sm font-bold">Paiement enregistré</p>
                    <p className="text-xs text-muted-foreground">{payment.date || "-"}</p>
                    <p className="text-xs mt-1">Transaction {payment.transactionId || "-"} via {payment.method || "-"}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-card" />
                  <div>
                    <p className="text-sm font-bold">Réservation confirmée</p>
                    <p className="text-xs text-muted-foreground">{reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-card" />
                  <div>
                    <p className="text-sm font-bold">Demande de réservation créée</p>
                    <p className="text-xs text-muted-foreground">{reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Informations Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {reservation.user?.username?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold">{reservation.user?.username || reservation.user?.email || "Client inconnu"}</p>
                  <p className="text-xs text-muted-foreground">Client enregistré</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{reservation.user?.email || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{reservation.user?.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{reservation.room?.hotel?.address || "-"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border">
              <Button variant="ghost" className="w-full text-xs text-primary font-bold">VOIR LE PROFIL COMPLET</Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge className="bg-primary text-white">{payment.status || "-"}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Méthode</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> {payment.method || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Montant total</span>
                <span className="font-bold">{reservation.totalPrice ?? "-"}$</span>
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
