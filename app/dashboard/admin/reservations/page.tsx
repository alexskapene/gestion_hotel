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
  CheckCircle2, 
  XCircle, 
  Clock,
  Filter,
  CalendarDays,
  User,
  Hotel,
  DollarSign
} from "lucide-react";
import Link from "next/link";

// Simulation de données basées sur le modèle Prisma Reservation
const mockReservations = [
  {
    id: "RES-7842",
    userName: "Alice Johnson",
    hotelName: "Zua Palace Kinshasa",
    roomNumber: "102",
    checkIn: "2024-05-15",
    checkOut: "2024-05-20",
    totalPrice: 750,
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    id: "RES-9210",
    userName: "Robert Smith",
    hotelName: "L'Hôtel du Fleuve",
    roomNumber: "305",
    checkIn: "2024-05-18",
    checkOut: "2024-05-22",
    totalPrice: 340,
    status: "PENDING",
    paymentStatus: "PENDING",
  },
  {
    id: "RES-1156",
    userName: "Marie Mbaye",
    hotelName: "Zua Palace Kinshasa",
    roomNumber: "201",
    checkIn: "2024-05-10",
    checkOut: "2024-05-12",
    totalPrice: 300,
    status: "COMPLETED",
    paymentStatus: "PAID",
  },
  {
    id: "RES-4432",
    userName: "Jean Dupont",
    hotelName: "Zua Palace Kinshasa",
    roomNumber: "105",
    checkIn: "2024-05-25",
    checkOut: "2024-05-28",
    totalPrice: 450,
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
  }
];

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Réservations</h1>
          <p className="text-muted-foreground mt-1">Suivez et gérez l&apos;ensemble des réservations effectuées sur la plateforme.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-11">
             Exporter
           </Button>
           <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6">
             Rapport mensuel
           </Button>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par ID, client ou hôtel..." 
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50 hover:bg-muted">
          <Filter className="w-4 h-4" />
          Filtres avancés
        </Button>
      </div>

      {/* Tableau des Réservations */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">ID Réserv.</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Établissement</TableHead>
              <TableHead>Séjour</TableHead>
              <TableHead>Montant Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReservations.map((res) => (
              <TableRow key={res.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-primary">
                  {res.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{res.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Hotel className="w-3.5 h-3.5 text-muted-foreground" /> {res.hotelName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Chambre {res.roomNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="flex items-center gap-1 font-medium">
                      <CalendarDays className="w-3 h-3 text-primary" /> {res.checkIn}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground ml-4">
                      au {res.checkOut}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground flex items-center">
                      <DollarSign className="w-3.5 h-3.5 text-green-600" /> {res.totalPrice}
                    </span>
                    {getPaymentBadge(res.paymentStatus)}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(res.status)}
                </TableCell>
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
                          <Eye className="w-4 h-4 mr-3 text-muted-foreground" /> 
                          Détails de la réservation
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-green-600 focus:text-green-600 cursor-pointer py-2.5">
                        <CheckCircle2 className="w-4 h-4 mr-3" /> 
                        Confirmer la réservation
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                        <XCircle className="w-4 h-4 mr-3" /> 
                        Annuler la réservation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Affichage de <span className="text-foreground">1</span> à <span className="text-foreground">4</span> sur <span className="text-foreground">156</span> réservations
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
