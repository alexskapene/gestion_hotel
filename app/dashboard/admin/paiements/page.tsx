"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Download, 
  Filter,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-200 gap-1 px-2 py-0.5">
          <CheckCircle2 className="w-3 h-3" /> Payé
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 gap-1 px-2 py-0.5">
          <Clock className="w-3 h-3" /> En attente
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-200 gap-1 px-2 py-0.5">
          <XCircle className="w-3 h-3" /> Échoué
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 gap-1 px-2 py-0.5">
          <XCircle className="w-3 h-3" /> Remboursé
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/payments?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les paiements");
      }

      setPayments(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors du chargement des paiements");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchPayments]);

  const handleViewDetails = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger le paiement");
      }

      setSelectedPayment(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la récupération du paiement");
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger le reçu");
      }

      setSelectedPayment(data);
      toast.success(`Reçu prêt pour ${data.transactionId || data.id}`);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la génération du reçu");
    }
  };

  const handleRefund = async (paymentId: string) => {
    if (!confirm("Voulez-vous vraiment rembourser cette transaction ?")) {
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refund" }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de rembourser la transaction");
      }

      toast.success("Paiement remboursé avec succès");
      setSelectedPayment(data);
      fetchPayments();
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors du remboursement");
    } finally {
      setActionLoading(false);
    }
  };

  const totalCollected = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const successfulCount = payments.filter((payment) => payment.status === "COMPLETED").length;
  const pendingAmount = payments
    .filter((payment) => payment.status === "PENDING")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Paiements</h1>
          <p className="text-muted-foreground mt-1">Suivi financier des réservations et transactions de la plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={fetchPayments}
            disabled={isLoading}
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10 shadow-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">Total encaissé</p>
                <h3 className="text-2xl font-bold mt-1">{totalCollected.toFixed(2)}$</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-primary/60 mt-4">Basé sur les paiements complétés</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/10 shadow-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Transactions réussies</p>
                <h3 className="text-2xl font-bold mt-1">{successfulCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-green-600/60 mt-4">Nombre de paiements validés</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/10 shadow-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Montant en attente</p>
                <h3 className="text-2xl font-bold mt-1">{pendingAmount.toFixed(2)}$</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-blue-600/60 mt-4">Paiements encore en traitement</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID transaction, client..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50" onClick={fetchPayments}>
          <Filter className="w-4 h-4" />
          Rechercher
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[150px]">ID Transaction</TableHead>
              <TableHead>Réservation</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Aucune transaction trouvée.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    {payment.transactionId || payment.id}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/admin/reservations/${payment.reservationId}`}
                      className="text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      {payment.reservationId} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                        {payment.reservation?.user?.username?.charAt(0) || payment.reservation?.user?.email?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-medium">{payment.reservation?.user?.username || payment.reservation?.user?.email || "Client inconnu"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" /> {payment.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-600" />
                      {payment.amount?.toFixed(2)}$
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl border-border bg-card">
                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Options transaction</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(payment.id)} className="cursor-pointer py-2.5">
                          <Eye className="w-4 h-4 mr-3 text-muted-foreground" /> Détails transaction
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReceipt(payment.id)} className="cursor-pointer py-2.5">
                          <Download className="w-4 h-4 mr-3 text-muted-foreground" /> Reçu de paiement
                        </DropdownMenuItem>
                        {payment.status !== "REFUNDED" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRefund(payment.id)}
                              className="text-destructive focus:text-destructive cursor-pointer py-2.5"
                            >
                              <XCircle className="w-4 h-4 mr-3" /> Rembourser
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Affichage de <span className="text-foreground">1</span> à <span className="text-foreground">{payments.length || 0}</span> sur <span className="text-foreground">{payments.length || 0}</span> transactions
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Précédent</Button>
            <Button variant="outline" size="sm" className="h-9 px-4 border-border/50 hover:bg-primary hover:text-white transition-all">Suivant</Button>
          </div>
        </div>
      </div>

      {selectedPayment && (
        <Card className="bg-card border border-border shadow-sm">
          <CardContent>
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Détails de la transaction</p>
                <h2 className="text-2xl font-semibold mt-2">{selectedPayment.transactionId || selectedPayment.id}</h2>
                <p className="text-sm text-muted-foreground mt-1">Réservation {selectedPayment.reservationId}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedPayment.status)}
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Montant</p>
                  <p className="text-xl font-bold">{selectedPayment.amount?.toFixed(2)}$</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-xl bg-muted/5 p-4 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Client</p>
                <p className="mt-2 font-medium">{selectedPayment.reservation?.user?.username || selectedPayment.reservation?.user?.email || "Inconnu"}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedPayment.reservation?.user?.email || "-"}</p>
              </div>
              <div className="rounded-xl bg-muted/5 p-4 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Méthode</p>
                <p className="mt-2 font-medium">{selectedPayment.paymentMethod}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-muted/5 p-4 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Réservation</p>
                <p className="mt-2 font-medium">{selectedPayment.reservationId}</p>
                <p className="text-xs text-muted-foreground mt-1">Client : {selectedPayment.reservation?.user?.email || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
