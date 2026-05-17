"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  MoreHorizontal,
  CreditCard,
  Calendar,
  Hotel,
  TrendingUp,
  ShieldCheck,
  History,
  Download,
  Filter,
  Clock,
  CheckCircle2,
  RefreshCcw,
  XCircle,
} from "lucide-react";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

export default function SubscriptionsManagementPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubscriptionsLoading, setIsSubscriptionsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200 font-bold">Actif</Badge>;
      case "EXPIRED":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 font-bold">Expiré</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200 font-bold">Annulé</Badge>;
      case "COMPLETED":
      case "SUCCESS":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200 font-bold">Réussi</Badge>;
      case "PENDING":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 font-bold">En attente</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200 font-bold">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fetchSubscriptions = useCallback(async () => {
    setIsSubscriptionsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/admin/abonnements?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les abonnements");
      }

      setSubscriptions(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur de chargement des abonnements");
    } finally {
      setIsSubscriptionsLoading(false);
    }
  }, [searchTerm, refreshKey]);

  const fetchTransactions = useCallback(async () => {
    setIsTransactionsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/admin/abonnements/transactions?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les transactions");
      }

      setTransactions(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur de chargement des transactions");
    } finally {
      setIsTransactionsLoading(false);
    }
  }, [searchTerm, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscriptions();
      fetchTransactions();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchSubscriptions, fetchTransactions]);

  const averageAmount = useMemo(() => {
    if (subscriptions.length === 0) return 0;
    return Number(
      (subscriptions.reduce((sum, sub) => sum + (sub.amount ?? 0), 0) / subscriptions.length).toFixed(0)
    );
  }, [subscriptions]);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((sub) => sub.status === "ACTIVE").length,
    [subscriptions]
  );

  const latestTransactionDate = transactions[0]?.createdAt
    ? new Date(transactions[0].createdAt).toLocaleDateString()
    : "-";

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet abonnement ?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/abonnements/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Erreur lors de la suppression de l'abonnement");
      }

      toast.success("Abonnement supprimé");
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.message || "Erreur réseau");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette transaction ?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/abonnements/transactions/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Erreur lors de la suppression de la transaction");
      }

      toast.success("Transaction supprimée");
      setRefreshKey((prev) => prev + 1);
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
          <h1 className="text-3xl font-serif font-bold text-foreground">Abonnements & Transactions</h1>
          <p className="text-muted-foreground mt-1">Gestion basée sur les tables Prisma Subscription et SubscriptionTransaction.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            disabled={isSubscriptionsLoading || isTransactionsLoading}
          >
            <RefreshCcw className={`w-4 h-4 ${isSubscriptionsLoading || isTransactionsLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{averageAmount}$</div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Montant moyen</p>
              <h4 className="text-lg font-bold">par abonnement</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <History className="w-5 h-5" />
             </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Abonnements</p>
              <h4 className="text-lg font-bold">{subscriptions.length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <ShieldCheck className="w-5 h-5" />
             </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Actifs</p>
              <h4 className="text-lg font-bold">{activeSubscriptions}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                <TrendingUp className="w-5 h-5" />
             </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Dernière transaction</p>
              <h4 className="text-lg font-bold">{latestTransactionDate}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par hôtel, transaction ou forfait..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50">
          <Filter className="w-4 h-4" /> Tout afficher
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Établissement</TableHead>
              <TableHead>Forfait</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSubscriptionsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                  Chargement des abonnements...
                </TableCell>
              </TableRow>
            ) : subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                  Aucun abonnement trouvé.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-primary">
                        <Hotel className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{sub.hotel?.name || "Hôtel inconnu"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {sub.planName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{sub.amount}$</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="text-muted-foreground">Du {formatDate(sub.startDate)}</span>
                      <span className="font-bold">au {formatDate(sub.endDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="text-[10px] uppercase">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">Afficher</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Mettre à jour</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteSubscription(sub.id)}
                          disabled={actionLoading}
                          className="text-destructive cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 mr-3" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold">Historique des Transactions</h2>
            <p className="text-sm text-muted-foreground">Transactions liées aux abonnements</p>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID Transaction</TableHead>
              <TableHead>Établissement</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isTransactionsLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                  Chargement des transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                  Aucune transaction trouvée.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    {tx.transactionId || tx.id}
                  </TableCell>
                  <TableCell className="font-medium">{tx.subscription?.hotel?.name || "Hôtel inconnu"}</TableCell>
                  <TableCell className="font-bold text-foreground">{tx.amount}$</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> {tx.paymentMethod || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(tx.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteTransaction(tx.id)}
                        disabled={actionLoading}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
