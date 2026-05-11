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
  Filter,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  MoreVertical,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Simulation de données
const initialUsers = [
  {
    id: "u1",
    username: "laurence1Mas",
    email: "laurence@zua.cd",
    role: "ADMIN",
    isVerified: true,
    isActive: true,
    phone: "+243 81 000 0001",
    createdAt: "2024-01-10",
    avatar: ""
  },
  {
    id: "u2",
    username: "hotel_manager_kin",
    email: "manager@zuapalace.com",
    role: "HOTEL_OWNER",
    isVerified: true,
    isActive: true,
    phone: "+243 81 222 3333",
    createdAt: "2024-02-15",
    avatar: ""
  },
  {
    id: "u3",
    username: "alice_traveler",
    email: "alice.j@example.com",
    role: "CLIENT",
    isVerified: false,
    isActive: true,
    phone: "+243 89 555 4444",
    createdAt: "2024-04-20",
    avatar: ""
  },
  {
    id: "u4",
    username: "jean_suspendu",
    email: "jean.d@old.com",
    role: "CLIENT",
    isVerified: true,
    isActive: false,
    phone: "+243 81 777 8888",
    createdAt: "2023-11-05",
    avatar: ""
  }
];

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verifyFilter, setVerifyFilter] = useState("ALL");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CLIENT",
    phone: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert("Utilisateur ajouté !");
  };

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
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par pseudo ou email..." 
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Sélecteurs de filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             <Select value={roleFilter} onValueChange={setRoleFilter}>
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

             <Select value={verifyFilter} onValueChange={setVerifyFilter}>
                <SelectTrigger className="h-11 w-full sm:w-[160px]">
                  <SelectValue placeholder="Vérification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous (Vérif.)</SelectItem>
                  <SelectItem value="VERIFIED">Vérifiés</SelectItem>
                  <SelectItem value="UNVERIFIED">Non vérifiés</SelectItem>
                </SelectContent>
             </Select>

             <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          }}>
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Tableau des Utilisateurs */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
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
            {initialUsers.map((user) => (
              <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {user.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">@{user.username}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-mono">ID: {user.id}</span>
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
                      <Calendar className="w-3.5 h-3.5" /> {user.createdAt}
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
                      <DropdownMenuItem className="cursor-pointer">
                        <ShieldCheck className="w-4 h-4 mr-3" /> Changer le rôle
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-yellow-600 focus:text-yellow-600 cursor-pointer">
                        <UserX className="w-4 h-4 mr-3" /> Suspendre
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* PAGINATION */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
             Affichage de <span className="text-foreground font-bold">1 - 4</span> sur <span className="text-foreground font-bold">1,248</span> utilisateurs
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 border-border/50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center">
               <Button variant="outline" size="sm" className="h-9 w-9 bg-primary text-white border-primary hover:bg-primary hover:text-white">1</Button>
               <Button variant="ghost" size="sm" className="h-9 w-9">2</Button>
               <Button variant="ghost" size="sm" className="h-9 w-9">3</Button>
               <span className="px-2 text-muted-foreground">...</span>
               <Button variant="ghost" size="sm" className="h-9 w-9">12</Button>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 border-border/50 hover:bg-primary hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL AJOUT UTILISATEUR (Identique à précédemment) */}
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
                  <Input id="username" placeholder="Ex: jean_243" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue="CLIENT">
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
                  <Input id="email" type="email" className="pl-10" placeholder="contact@exemple.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-10" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2 px-8 shadow-lg shadow-primary/20">
                Créer le compte <CheckCircle2 className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
