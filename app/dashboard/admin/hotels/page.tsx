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
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  Hotel as HotelIcon,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  ShieldAlert,
  Power,
  PowerOff
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/hotels?search=${searchTerm}`);
      const data = await response.json();
      if (response.ok) {
        setHotels(data);
      } else {
        toast.error("Erreur lors de la récupération des hôtels");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotels();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchHotels]);

  const handleUpdateStatus = async (hotelId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/hotels/${hotelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success("Hôtel mis à jour");
        fetchHotels();
      } else {
        toast.error("Échec de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet établissement ? Cette action supprimera également toutes les chambres associées.")) return;

    try {
      const response = await fetch(`/api/admin/hotels/${hotelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Hôtel supprimé");
        fetchHotels();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header avec action principale */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Hôtels</h1>
          <p className="text-muted-foreground mt-1">Gérez les établissements, visualisez leurs performances et mettez à jour leurs informations.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6">
          <Link href="/dashboard/admin/hotels/create">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un établissement
          </Link>
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, ville, type..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" onClick={fetchHotels} className="gap-2 h-11 px-5 border-border/50">
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Liste des Hôtels */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Chargement des hôtels...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Établissement</TableHead>
                <TableHead>Type & Étoiles</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Vérification</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    Aucun établissement trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                hotels.map((hotel) => (
                  <TableRow key={hotel.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-all">
                          {hotel.logo ? (
                            <Image src={hotel.logo} alt={hotel.name} width={48} height={48} className="object-contain p-1.5" />
                          ) : (
                            <HotelIcon className="text-primary/40 w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground leading-none mb-1">{hotel.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">{hotel.email || hotel.owner?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <Badge variant="secondary" className="w-fit text-[10px] px-2 py-0 uppercase font-bold tracking-wider">
                          {hotel.hotelType}
                        </Badge>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < hotel.stars ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {hotel.city}
                        </div>
                        <div className="text-[10px] text-muted-foreground pl-5 uppercase">{hotel.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1.5 ${hotel.isVerified ? 'text-green-600 border-green-200 bg-green-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}>
                        {hotel.isVerified ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {hotel.isVerified ? "Vérifié" : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${hotel.isActive ? "bg-green-500" : "bg-red-500"} shadow-sm`} />
                        <span className={`text-xs font-medium ${hotel.isActive ? "text-green-600" : "text-red-600"}`}>
                          {hotel.isActive ? "En ligne" : "Hors ligne"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl border-border bg-card">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Options de gestion</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer py-2.5" onClick={() => handleUpdateStatus(hotel.id, { isVerified: !hotel.isVerified })}>
                            <ShieldCheck className="w-4 h-4 mr-3 text-blue-500" />
                            {hotel.isVerified ? "Révoquer vérification" : "Valider l'hôtel"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer py-2.5" onClick={() => handleUpdateStatus(hotel.id, { isActive: !hotel.isActive })}>
                            {hotel.isActive ? <PowerOff className="w-4 h-4 mr-3 text-red-500" /> : <Power className="w-4 h-4 mr-3 text-green-500" />}
                            {hotel.isActive ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href={`/dashboard/admin/hotels/${hotel.id}`} className="flex items-center">
                              <Eye className="w-4 h-4 mr-3 text-muted-foreground" />
                              Voir la fiche complète
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href={`/dashboard/admin/hotels/${hotel.id}/edit`} className="flex items-center">
                              <Edit className="w-4 h-4 mr-3 text-muted-foreground" />
                              Modifier l&apos;établissement
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer py-2.5"
                            onClick={() => handleDeleteHotel(hotel.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Supprimer l&apos;hôtel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )
        }

        {/* Pied de tableau avec pagination (Simplifié) */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Affichage de <span className="text-foreground">{hotels.length}</span> établissements
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Précédent</Button>
            <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
