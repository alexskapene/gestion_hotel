"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Tags,
  Hotel,
  CheckCircle2,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

export default function RoomCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hotelId: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catsRes, hotelsRes] = await Promise.all([
        fetch("/api/admin/room-categories"),
        fetch("/api/admin/hotels")
      ]);
      
      const catsData = await catsRes.json();
      const hotelsData = await hotelsRes.json();
      
      if (catsRes.ok) setCategories(catsData);
      if (hotelsRes.ok) setHotels(hotelsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setFormData({ name: "", description: "", hotelId: "" });
    setIsAddModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      hotelId: category.hotelId,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    
    try {
      const res = await fetch(`/api/admin/room-categories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Catégorie supprimée");
        fetchData();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = isEditModalOpen 
        ? `/api/admin/room-categories/${selectedCategory.id}` 
        : "/api/admin/room-categories";
      
      const res = await fetch(url, {
        method: isEditModalOpen ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEditModalOpen ? "Catégorie mise à jour" : "Catégorie créée");
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.hotel?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Catégories de Chambres</h1>
          <p className="text-muted-foreground mt-1">Gérez les types d&apos;hébergement par établissement.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une catégorie ou un hôtel..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" onClick={fetchData} className="gap-2 h-11 px-5 border-border/50">
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Liste des Catégories */}
      <div className="bg-card border border-border shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Chargement des catégories...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px]">Nom de la catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Établissement</TableHead>
                <TableHead className="text-center">Chambres</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                    Aucune catégorie trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold text-primary flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Tags className="w-5 h-5 text-primary" />
                      </div>
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                        {category.description || "Pas de description"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Hotel className="w-4 h-4 text-muted-foreground" />
                        {category.hotel?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                        {category._count?.rooms || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 z-[100] shadow-2xl border-border bg-card">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(category)} className="cursor-pointer py-2.5">
                            <Edit className="w-4 h-4 mr-3 text-muted-foreground" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                            <Trash2 className="w-4 h-4 mr-3" />
                            Supprimer
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
            Affichage de <span className="text-foreground">{filteredCategories.length}</span> catégories
          </div>
        </div>
      </div>

      {/* MODAL AJOUT / MODIFICATION */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                {isAddModalOpen ? "Nouvelle Catégorie" : "Modifier la Catégorie"}
              </DialogTitle>
              <DialogDescription>
                Configurez les détails du type d&apos;hébergement ci-dessous.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="hotel">Établissement <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.hotelId}
                  onValueChange={(val) => setFormData({ ...formData, hotelId: val })}
                  disabled={isEditModalOpen}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choisir l'établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="Ex: Suite Royale, Chambre Standard..."
                  className="h-11"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez les avantages et caractéristiques de ce type de chambre..."
                  className="min-h-[100px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6">
              <Button type="button" variant="ghost" onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 gap-2 px-8">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isAddModalOpen ? "Créer" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
