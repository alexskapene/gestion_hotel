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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";

// Simulation de données basées sur Subscription
const mockSubscriptions = [
  {
    id: "SUB-101",
    hotelName: "Zua Palace Kinshasa",
    planName: "Premium Pro",
    amount: 150,
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    status: "ACTIVE",
  },
  {
    id: "SUB-102",
    hotelName: "L'Hôtel du Fleuve",
    planName: "Business Starter",
    amount: 85,
    startDate: "2024-03-10",
    endDate: "2025-03-10",
    status: "ACTIVE",
  },
  {
    id: "SUB-103",
    hotelName: "Hôtel Renaissance",
    planName: "Premium Pro",
    amount: 150,
    startDate: "2023-05-20",
    endDate: "2024-05-20",
    status: "EXPIRED",
  }
];

// Simulation de données basées sur SubscriptionTransaction
const mockTransactions = [
  {
    id: "TXN-SUB-991",
    hotelName: "Zua Palace Kinshasa",
    amount: 150,
    transactionId: "PAY-ZUA-8877",
    method: "MasterCard",
    status: "SUCCESS",
    date: "2024-01-15 09:30",
  },
  {
    id: "TXN-SUB-992",
    hotelName: "L'Hôtel du Fleuve",
    amount: 85,
    transactionId: "PAY-HDF-2211",
    method: "Visa Card",
    status: "SUCCESS",
    date: "2024-03-10 11:20",
  },
  {
    id: "TXN-SUB-993",
    hotelName: "Zua Palace Kinshasa",
    amount: 150,
    transactionId: "PAY-ZUA-4433",
    method: "Mobile Money",
    status: "PENDING",
    date: "2024-05-09 13:45",
  }
];

export default function SubscriptionsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200 font-bold">Actif</Badge>;
      case "EXPIRED":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 font-bold">Expiré</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200 font-bold">Annulé</Badge>;
      case "SUCCESS":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200 font-bold">Réussi</Badge>;
      case "PENDING":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 font-bold">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Abonnements & Transactions</h1>
          <p className="text-muted-foreground mt-1">Gérez les forfaits hôteliers et suivez les flux de facturation récurrents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Rapport annuel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10 shadow-none">
          <CardContent className="pt-6">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">Revenu Récurrent (MRR)</p>
                  <h3 className="text-2xl font-bold mt-1">4,850$ / mois</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/10 shadow-none">
          <CardContent className="pt-6">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Abonnements Actifs</p>
                  <h3 className="text-2xl font-bold mt-1">42 Établissements</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/10 shadow-none">
          <CardContent className="pt-6">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Taux de Renouvellement</p>
                  <h3 className="text-2xl font-bold mt-1">94%</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-6 border border-border/50 h-12">
          <TabsTrigger value="subscriptions" className="gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <CreditCard className="w-4 h-4" /> Abonnements Actifs
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="w-4 h-4" /> Historique Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
           {/* Filtres Abonnements */}
           <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par hôtel ou forfait..." 
                className="pl-10 h-11 bg-muted/20 border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 h-11 px-5">
              <Filter className="w-4 h-4" /> Filtrer
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
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubscriptions.map((sub) => (
                  <TableRow key={sub.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-primary">
                          <Hotel className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{sub.hotelName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {sub.planName}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{sub.amount}$ / an</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-muted-foreground">Expire le :</span>
                        <span className="font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary" /> {sub.endDate}
                        </span>
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
                          <DropdownMenuLabel className="text-[10px] uppercase">Gestion</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">Modifier le forfait</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Historique paiements</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer">Suspendre</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
           {/* Tableau Transactions */}
           <div className="bg-card border border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>ID Transaction</TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Reçu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase">{tx.transactionId}</TableCell>
                    <TableCell className="font-medium">{tx.hotelName}</TableCell>
                    <TableCell className="font-bold text-foreground">{tx.amount}$</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> {tx.method}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> {tx.date}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
