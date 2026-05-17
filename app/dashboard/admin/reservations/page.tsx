"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  CalendarDays,
  User,
  Hotel,
  DollarSign,
  Loader2,
  Clock,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const statusOptions = [
  { label: "Toutes", value: "ALL" },
  { label: "En attente", value: "PENDING" },
  { label: "Confirmées", value: "CONFIRMED" },
  { label: "Terminées", value: "COMPLETED" },
  { label: "Annulées", value: "CANCELLED" },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Payé</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Attente Paiement</Badge>;
      case "REFUNDED":
        return <Badge variant="outline" className="text-muted-foreground">Remboursé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const response = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les réservations");
      }

      setReservations(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur de chargement des réservations");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReservations();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchReservations]);

  const getPaymentStatus = (reservation: any) => {
    if (reservation.payments?.length) {
      const lastPayment = reservation.payments[reservation.payments.length - 1];
      return lastPayment?.status || "PENDING";
    }

    return reservation.status === "COMPLETED" ? "PAID" : "PENDING";
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Erreur de mise à jour");
      }

      toast.success("Statut mis à jour");
      fetchReservations();
    } catch (error: any) {
      toast.error(error?.message || "Erreur réseau");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Erreur lors de la suppression");
      }

      toast.success("Réservation supprimée");
      fetchReservations();
    } catch (error: any) {
      toast.error(error?.message || "Erreur réseau");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Réservations</h1>
          <p className="text-muted-foreground mt-1">Suivez et gérez l&apos;ensemble des réservations effectuées sur la plateforme.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-11 gap-2" onClick={fetchReservations}>
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID, client, hôtel ou chambre..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[220px]">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Chargement des réservations...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[130px]">ID Réserv.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Séjour</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                      Aucune réservation trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  reservations.map((res) => {
                    const paymentStatus = getPaymentStatus(res);
                    return (
                      <TableRow key={res.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-primary">{res.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">{res.user?.username || res.user?.email || "Inconnu"}</div>
                              <div className="text-xs text-muted-foreground">{new Date(res.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium flex items-center gap-1">
                              <Hotel className="w-3.5 h-3.5 text-muted-foreground" /> {res.room?.hotel?.name || "-"}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Chambre {res.room?.roomNumber || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs">
                            <span className="flex items-center gap-1 font-medium">
                              <CalendarDays className="w-3 h-3 text-primary" /> {res.checkIn?.split("T")[0] || "-"}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground ml-4">
                              au {res.checkOut?.split("T")[0] || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-green-600" /> {res.totalPrice ?? "-"}
                            </span>
                            {getPaymentBadge(paymentStatus)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(res.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 z-[100] shadow-2xl border-border bg-card">
                              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Actions Réservation</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                                <Link href={`/dashboard/admin/reservations/${res.id}`} className="flex items-center">
                                  <Eye className="w-4 h-4 mr-3 text-muted-foreground" /> Détails de la réservation
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {res.status !== "CONFIRMED" && (
                                <DropdownMenuItem className="text-green-600 focus:text-green-600 cursor-pointer py-2.5" onClick={() => handleUpdateStatus(res.id, "CONFIRMED")}> 
                                  <CheckCircle2 className="w-4 h-4 mr-3" /> Confirmer la réservation
                                </DropdownMenuItem>
                              )}
                              {res.status !== "CANCELLED" && (
                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer py-2.5" onClick={() => handleUpdateStatus(res.id, "CANCELLED")}> 
                                  <XCircle className="w-4 h-4 mr-3" /> Annuler la réservation
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-muted-foreground cursor-pointer py-2.5" onClick={() => handleDelete(res.id)}>
                                <Clock className="w-4 h-4 mr-3" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
              <div className="text-xs text-muted-foreground font-medium">
                Affichage de <span className="text-foreground">{reservations.length}</span> réservations
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Précédent</Button>
                <Button variant="outline" size="sm" className="h-9 px-4 border-border/50 hover:bg-primary hover:text-white transition-all">Suivant</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
