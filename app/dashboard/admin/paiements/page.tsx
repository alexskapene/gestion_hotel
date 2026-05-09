"use client";

import { useState } from "react";
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
  Calendar,
  User,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Simulation de données de transactions
const mockPayments = [
  {
    id: "TXN-45920",
    reservationId: "RES-7842",
    clientName: "Alice Johnson",
    amount: 750,
    method: "Visa Card",
    status: "SUCCESS",
    date: "2024-05-01 10:35",
  },
  {
    id: "TXN-45921",
    reservationId: "RES-9210",
    clientName: "Robert Smith",
    amount: 340,
    method: "Mobile Money",
    status: "PENDING",
    date: "2024-05-02 14:20",
  },
  {
    id: "TXN-45922",
    reservationId: "RES-1156",
    clientName: "Marie Mbaye",
    amount: 300,
    method: "MasterCard",
    status: "SUCCESS",
    date: "2024-05-03 09:15",
  },
  {
    id: "TXN-45923",
    reservationId: "RES-4432",
    clientName: "Jean Dupont",
    amount: 450,
    method: "Visa Card",
    status: "FAILED",
    date: "2024-05-04 11:00",
  }
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200 gap-1 px-2 py-0.5">
            <CheckCircle2 className="w-3 h-3" /> Réussi
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Paiements</h1>
          <p className="text-muted-foreground mt-1">Suivi financier des réservations et transactions de la plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Exporter (CSV/PDF)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10 shadow-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">Total Encaissé</p>
                <h3 className="text-2xl font-bold mt-1">24,500$</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-primary/60 mt-4">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/10 shadow-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Transactions Réussies</p>
                <h3 className="text-2xl font-bold mt-1">1,240</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-green-600/60 mt-4">98.5% de taux de succès</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/10 shadow-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">En attente</p>
                <h3 className="text-2xl font-bold mt-1">1,150$</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-blue-600/60 mt-4">Transactions en cours de traitement</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et Filtres */}
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
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50">
          <Filter className="w-4 h-4" />
          Toutes les méthodes
        </Button>
      </div>

      {/* Tableau des Paiements */}
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
            {mockPayments.map((payment) => (
              <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                  {payment.id}
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
                      {payment.clientName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{payment.clientName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4" /> {payment.method}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-foreground flex items-center">
                    <DollarSign className="w-3 h-3 text-green-600" /> {payment.amount}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(payment.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl border-border bg-card">
                      <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Options Transaction</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <Eye className="w-4 h-4 mr-3 text-muted-foreground" /> 
                        Détails transaction
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <Download className="w-4 h-4 mr-3 text-muted-foreground" /> 
                        Reçu de paiement
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                        <XCircle className="w-4 h-4 mr-3" /> 
                        Rembourser
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination simple */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Affichage de <span className="text-foreground">1</span> à <span className="text-foreground">4</span> sur <span className="text-foreground">850</span> transactions
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Précédent</Button>
            <Button variant="outline" size="sm" className="h-9 px-4 border-border/50 hover:bg-primary hover:text-white transition-all">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
