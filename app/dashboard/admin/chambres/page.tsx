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
  Edit,
  Trash2,
  Filter,
  BedDouble,
  DoorOpen,
  Users,
  DollarSign,
  Loader2,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/rooms?search=${searchTerm}`);
      const data = await response.json();
      if (response.ok) {
        setRooms(data);
      } else {
        toast.error("Erreur lors de la récupération des chambres");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchRooms]);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette chambre ?")) return;

    try {
      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Chambre supprimée");
        fetchRooms();
      } else {
        toast.error("Échec de la suppression");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Disponible</Badge>;
      case "OCCUPIED":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Occupée</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header avec action principale */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Chambres</h1>
          <p className="text-muted-foreground mt-1">Gérez l&apos;inventaire des chambres, les tarifs et l&apos;état de disponibilité.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6">
          <Link href="/dashboard/admin/chambres/create">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter une chambre
          </Link>
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro, titre ou hôtel..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" onClick={fetchRooms} className="gap-2 h-11 px-5 border-border/50">
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Liste des Chambres */}
      <div className="bg-card border border-border shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Chargement des chambres...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">N° Chambre</TableHead>
                <TableHead>Type & Détails</TableHead>
                <TableHead>Établissement</TableHead>
                <TableHead>Prix / Nuit</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    Aucune chambre trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold text-primary flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DoorOpen className="w-4 h-4 text-primary" />
                      </div>
                      {room.roomNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{room.title}</span>
                        <div className="flex items-center gap-3 mt-1 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {room.capacity} Personnes
                          </span>
                          <span className="flex items-center gap-1 border-l pl-3">
                            <BedDouble className="w-3 h-3" /> {room.category?.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{room.hotel?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-bold text-foreground">
                        <span className="text-xs mr-0.5">$</span>
                        {room.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(room.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl border-border bg-card">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Gestion Chambre</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                            <Link href={`/dashboard/admin/chambres/${room.id}/edit`} className="flex items-center">
                              <Edit className="w-4 h-4 mr-3 text-muted-foreground" />
                              Modifier la chambre
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(room.id)}
                            className="text-destructive focus:text-destructive cursor-pointer py-2.5"
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Supprimer la chambre
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Affichage de <span className="text-foreground">{rooms.length}</span> chambres
          </div>
        </div>
      </div>
    </div>
  );
}
