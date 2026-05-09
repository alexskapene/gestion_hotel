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
  Trash2, 
  Star, 
  Filter,
  MessageSquare,
  User,
  Hotel,
  ShieldCheck,
  ShieldAlert,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Simulation de données basées sur le modèle Prisma Review
const mockReviews = [
  {
    id: "1",
    userName: "Alice Johnson",
    hotelName: "Zua Palace Kinshasa",
    rating: 5,
    comment: "Un séjour incroyable ! Le service était impeccable et la vue sur le fleuve est à couper le souffle. Je reviendrai sans hésiter.",
    status: "APPROVED",
    createdAt: "2024-05-01",
  },
  {
    id: "2",
    userName: "Robert Smith",
    hotelName: "L'Hôtel du Fleuve",
    rating: 3,
    comment: "Bon hôtel mais le Wi-Fi dans les chambres est assez lent. Le petit déjeuner pourrait être plus varié.",
    status: "PENDING",
    createdAt: "2024-05-02",
  },
  {
    id: "3",
    userName: "Marie Mbaye",
    hotelName: "Zua Palace Kinshasa",
    rating: 4,
    comment: "Très beau cadre, calme et reposant. Le personnel est très accueillant.",
    status: "APPROVED",
    createdAt: "2024-05-03",
  },
  {
    id: "4",
    userName: "Jean Dupont",
    hotelName: "Zua Palace Kinshasa",
    rating: 1,
    comment: "Déçu par l'accueil. J'ai dû attendre 2h pour ma chambre alors que j'avais réservé à l'avance.",
    status: "REJECTED",
    createdAt: "2024-05-04",
  }
];

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3.5 h-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted border-muted fill-muted/20"}`} 
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approuvé</Badge>;
      case "PENDING":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">En attente</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Overview Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Avis</h1>
          <p className="text-muted-foreground mt-1">Modérez les commentaires et évaluez la satisfaction des clients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4.2</div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Note Moyenne</p>
              <h4 className="text-lg font-bold">Générale</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <MessageSquare className="w-5 h-5" />
             </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Avis</p>
              <h4 className="text-lg font-bold">1,248</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <ShieldCheck className="w-5 h-5" />
             </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Approuvés</p>
              <h4 className="text-lg font-bold">1,120</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                <ShieldAlert className="w-5 h-5" />
             </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">En attente</p>
              <h4 className="text-lg font-bold">128</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et Filtres */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par client, hôtel ou contenu..." 
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50">
          <Filter className="w-4 h-4" />
          Tous les statuts
        </Button>
      </div>

      {/* Tableau des Avis */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Client</TableHead>
              <TableHead>Établissement</TableHead>
              <TableHead>Évaluation</TableHead>
              <TableHead className="max-w-[300px]">Commentaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReviews.map((review) => (
              <TableRow key={review.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{review.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-muted-foreground" /> {review.hotelName}
                  </div>
                </TableCell>
                <TableCell>
                  {renderStars(review.rating)}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-xs text-muted-foreground line-clamp-2 italic">
                    &quot;{review.comment}&quot;
                  </p>
                </TableCell>
                <TableCell>
                  {getStatusBadge(review.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl border-border bg-card">
                      <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Modération</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <Eye className="w-4 h-4 mr-3 text-muted-foreground" /> 
                        Voir en détail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-green-600 focus:text-green-600 cursor-pointer py-2.5">
                        <ShieldCheck className="w-4 h-4 mr-3" /> 
                        Approuver l&apos;avis
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-yellow-600 focus:text-yellow-600 cursor-pointer py-2.5">
                        <ShieldAlert className="w-4 h-4 mr-3" /> 
                        Mettre en attente
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                        <Trash2 className="w-4 h-4 mr-3" /> 
                        Supprimer l&apos;avis
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
            Affichage de <span className="text-foreground">1</span> à <span className="text-foreground">4</span> sur <span className="text-foreground">1248</span> avis
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
