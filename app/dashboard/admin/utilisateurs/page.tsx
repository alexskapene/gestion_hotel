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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  UserPlus, 
  ShieldCheck, 
  UserX, 
  Mail, 
  Phone, 
  CheckCircle2,
  XCircle,
  ShieldAlert,
  MoreVertical,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCcw,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export default function UsersManagementPage() {
  // States pour les données
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // States pour les filtres et pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verifyFilter, setVerifyFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // States pour les modales et formulaires
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CLIENT",
    phone: "",
  });

  // Fonction de récupération des utilisateurs
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        role: roleFilter,
        isActive: statusFilter,
        isVerified: verifyFilter,
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setTotalUsers(data.pagination.total);
      } else {
        toast.error("Erreur lors de la récupération des utilisateurs");
      }
    } catch (error) {
      toast.error("Impossible de se connecter au serveur");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter, verifyFilter, currentPage]);

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce pour la recherche
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Gestion de la création d'utilisateur
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Utilisateur créé avec succès");
        setIsModalOpen(false);
        setFormData({ username: "", email: "", password: "", role: "CLIENT", phone: "" });
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Mise à jour rapide (rôle ou statut)
  const handleUpdateStatus = async (userId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success("Mise à jour réussie");
        fetchUsers();
      } else {
        toast.error("Échec de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  // Suppression d'utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Utilisateur supprimé");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Administrateur</Badge>;
      case "HOTEL_OWNER":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Propriétaire</Badge>;
      case "CLIENT":
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-200">Client</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (user: any) => {
    if (!user.isActive) {
      return (
        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 gap-1">
          <XCircle className="w-3 h-3" /> Suspendu
        </Badge>
      );
    }
    if (!user.isVerified) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 gap-1">
          <ShieldAlert className="w-3 h-3" /> Non vérifié
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 gap-1">
        <CheckCircle2 className="w-3 h-3" /> Actif
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Surveillez et gérez les comptes utilisateurs de votre écosystème.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* FILTRES AVANCÉS */}
      <div className="bg-card p-5 border border-border shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par pseudo ou email..." 
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 w-full sm:w-[160px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les rôles</SelectItem>
                  <SelectItem value="ADMIN">Administrateurs</SelectItem>
                  <SelectItem value="HOTEL_OWNER">Propriétaires</SelectItem>
                  <SelectItem value="CLIENT">Clients</SelectItem>
                </SelectContent>
             </Select>

             <Select value={verifyFilter} onValueChange={(val) => { setVerifyFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 w-full sm:w-[160px]">
                  <SelectValue placeholder="Vérification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous (Vérif.)</SelectItem>
                  <SelectItem value="VERIFIED">Vérifiés</SelectItem>
                  <SelectItem value="UNVERIFIED">Non vérifiés</SelectItem>
                </SelectContent>
             </Select>

             <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 w-full sm:w-[160px]">
                  <SelectValue placeholder="Activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous (Activité)</SelectItem>
                  <SelectItem value="ACTIVE">Actifs</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendus</SelectItem>
                </SelectContent>
             </Select>
          </div>
          
          <Button variant="ghost" className="h-11 px-4 text-muted-foreground hover:text-primary" onClick={() => {
            setSearchTerm("");
            setRoleFilter("ALL");
            setVerifyFilter("ALL");
            setStatusFilter("ALL");
            setCurrentPage(1);
          }}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Réinitialiser
          </Button>
        </div>
      </div>

      {/* Tableau des Utilisateurs */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Chargement des utilisateurs...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Utilisateur</TableHead>
                  <TableHead>Email & Contact</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform">
                            <AvatarImage src={user.avatar || ""} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {(user.username || user.email).substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">@{user.username || "Sans pseudo"}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-mono">ID: {user.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(user.createdAt).toLocaleDateString()}
                         </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 z-[100] shadow-2xl border-border bg-card">
                            <DropdownMenuLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Options Compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus(user.id, { role: user.role === "CLIENT" ? "HOTEL_OWNER" : "CLIENT" })}>
                              <RefreshCcw className="w-4 h-4 mr-3 text-blue-500" /> Basculer le rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className={`${user.isVerified ? 'text-orange-600 focus:text-orange-600' : 'text-blue-600 focus:text-blue-600'} cursor-pointer`}
                              onClick={() => handleUpdateStatus(user.id, { isVerified: !user.isVerified })}
                            >
                              {user.isVerified ? <ShieldAlert className="w-4 h-4 mr-3" /> : <ShieldCheck className="w-4 h-4 mr-3" />}
                              {user.isVerified ? "Révoquer vérification" : "Vérifier le compte"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className={`${user.isActive ? 'text-yellow-600 focus:text-yellow-600' : 'text-green-600 focus:text-green-600'} cursor-pointer`}
                              onClick={() => handleUpdateStatus(user.id, { isActive: !user.isActive })}
                            >
                              {user.isActive ? <UserX className="w-4 h-4 mr-3" /> : <CheckCircle2 className="w-4 h-4 mr-3" />}
                              {user.isActive ? "Suspendre" : "Réactiver"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-3" /> Supprimer (Définitivement)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* PAGINATION */}
            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
              <div className="text-xs text-muted-foreground font-medium">
                 Affichage de <span className="text-foreground font-bold">{(currentPage-1)*limit + 1} - {Math.min(currentPage*limit, totalUsers)}</span> sur <span className="text-foreground font-bold">{totalUsers}</span> utilisateurs
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 border-border/50" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1 px-2">
                   <span className="text-sm font-bold text-primary">Page {currentPage}</span>
                   <span className="text-sm text-muted-foreground">/ {totalPages || 1}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 border-border/50 hover:bg-primary hover:text-white transition-all"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL AJOUT UTILISATEUR */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Nouvel Utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte en définissant ses identifiants et son rôle.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                  <Input 
                    id="username" 
                    placeholder="Ex: jean_243" 
                    required 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(val) => setFormData({...formData, role: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="HOTEL_OWNER">Propriétaire d&apos;hôtel</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    className="pl-10" 
                    placeholder="contact@exemple.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (Optionnel)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    className="pl-10" 
                    placeholder="+243..." 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe temporaire</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10" 
                    placeholder="••••••••" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 gap-2 px-8 shadow-lg shadow-primary/20"
                disabled={isActionLoading}
              >
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer le compte"}
                {!isActionLoading && <CheckCircle2 className="w-4 h-4" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
