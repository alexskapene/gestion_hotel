"use client";

import { useState } from "react";
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
  CheckCircle2
} from "lucide-react";

// Simulation de données
const initialCategories = [
  {
    id: "1",
    name: "Standard",
    description: "Chambres confortables avec services de base.",
    hotelId: "h1",
    hotelName: "Zua Palace Kinshasa",
    roomsCount: 45,
  },
  {
    id: "2",
    name: "Deluxe Vue Mer",
    description: "Vue imprenable sur le fleuve et mobilier haut de gamme.",
    hotelId: "h1",
    hotelName: "Zua Palace Kinshasa",
    roomsCount: 20,
  },
  {
    id: "3",
    name: "Suite Exécutive",
    description: "Espace salon séparé et bureau pour les voyageurs d'affaires.",
    hotelId: "h2",
    hotelName: "L'Hôtel du Fleuve",
    roomsCount: 12,
  }
];

export default function RoomCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hotelId: "",
  });

  const handleAdd = () => {
    setFormData({ name: "", description: "", hotelId: "" });
    setIsAddModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      hotelId: category.hotelId,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données soumises:", formData);
    alert("Opération réussie !");
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Catégories de Chambres</h1>
          <p className="text-muted-foreground mt-1">Gérez les types d&apos;hébergement via des fenêtres modales rapides.</p>
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
            placeholder="Rechercher une catégorie..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50">
          <Filter className="w-4 h-4" />
          Filtres
        </Button>
      </div>

      {/* Liste des Catégories */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
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
            {initialCategories.map((category) => (
              <TableRow key={category.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-bold text-primary flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tags className="w-5 h-5 text-primary" />
                  </div>
                  {category.name}
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                    {category.description}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Hotel className="w-4 h-4 text-muted-foreground" />
                    {category.hotelName}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                    {category.roomsCount}
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
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                        <Trash2 className="w-4 h-4 mr-3" />
                        Supprimer
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
            Affichage de <span className="text-foreground">1</span> à <span className="text-foreground">3</span> sur <span className="text-foreground">42</span>categories de chambres
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Précédent</Button>
            <Button variant="outline" size="sm" className="h-9 px-4 border-border/50 hover:bg-primary hover:text-white transition-all">Suivant</Button>
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
                Remplissez les informations ci-dessous pour configurer le type d&apos;hébergement.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="hotel">Hôtel</Label>
                <Select
                  value={formData.hotelId}
                  onValueChange={(val) => setFormData({ ...formData, hotelId: val })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choisir l'établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">Zua Palace Kinshasa</SelectItem>
                    <SelectItem value="h2">L&apos;Hôtel du Fleuve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  placeholder="Ex: Suite Royale"
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
                  placeholder="Bref descriptif des avantages..."
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
              <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2 px-8">
                {isAddModalOpen ? "Créer" : "Enregistrer"} <CheckCircle2 className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
