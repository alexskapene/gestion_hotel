"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { toast } from "sonner";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Star,
  Filter,
  MessageSquare,
  User,
  Hotel,
  Eye,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les avis");
      }

      setReviews(data);
    } catch (error: any) {
      toast.error(error?.message || "Erreur de chargement des avis");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return Number(
      (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
    );
  }, [reviews]);

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Erreur lors de la suppression de l'avis");
      }

      toast.success("Avis supprimé");
      fetchReviews();
    } catch (error: any) {
      toast.error(error?.message || "Erreur réseau");
    } finally {
      setActionLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-3.5 h-3.5 ${
              index < rating ? "fill-yellow-400 text-yellow-400" : "text-muted border-muted fill-muted/20"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Avis</h1>
          <p className="text-muted-foreground mt-1">Modérez les avis clients enregistrés via le modèle Prisma Review.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-11 gap-2" onClick={fetchReviews}>
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Note Moyenne</p>
              <h4 className="text-lg font-bold">Sur {reviews.length || 0} avis</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Avis chargés</p>
              <h4 className="text-lg font-bold">{reviews.length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Avis publiés</p>
              <h4 className="text-lg font-bold">{reviews.length}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Dernier avis</p>
              <h4 className="text-lg font-bold">{reviews[0] ? new Date(reviews[0].createdAt).toLocaleDateString() : "-"}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, hôtel ou commentaire..."
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11 px-5 border-border/50">
          <Filter className="w-4 h-4" />
          Tout afficher
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Chargement des avis...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[180px]">Client</TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="max-w-[300px]">Commentaire</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      Aucun avis trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{review.user?.username || review.user?.email || "Utilisateur"}</div>
                            <div className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium flex items-center gap-1">
                          <Hotel className="w-3.5 h-3.5 text-muted-foreground" /> {review.hotel?.name || "Hôtel"}
                        </div>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="text-xs text-muted-foreground line-clamp-2 italic">"{review.comment || "Sans commentaire."}"</p>
                      </TableCell>
                      <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl border-border bg-card">
                            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer py-2.5">
                              <Eye className="w-4 h-4 mr-3 text-muted-foreground" /> Voir en détail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={actionLoading}
                              className="text-destructive focus:text-destructive cursor-pointer py-2.5"
                            >
                              <Trash2 className="w-4 h-4 mr-3" /> Supprimer l'avis
                            </DropdownMenuItem>
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
                Affichage de <span className="text-foreground">1</span> à <span className="text-foreground">{reviews.length}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="h-9 px-4 border-border/50">Précédent</Button>
                <Button variant="outline" size="sm" className="h-9 px-4 border-border/50 hover:bg-primary hover:text-white transition-all">
                  Suivant
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
