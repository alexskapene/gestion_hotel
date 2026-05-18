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
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MoreHorizontal, 
  Monitor, 
  Globe, 
  Mail,
  User,
  Clock, 
  Calendar, 
  ShieldAlert, 
  Eye,
  Activity,
  Users,
  MousePointer2
} from "lucide-react";

// Simulation de données de visiteurs
const mockVisitors = [
  {
    id: "1",
    ipAddress: "197.242.150.12",
    email: "client@example.com",
    userAgent: "Chrome / Windows 11",
    path: "/hotels/zua-palace",
    createdAt: "2024-05-09 14:30:15",
    location: "Kinshasa, RDC"
  },
  {
    id: "2",
    ipAddress: "41.212.30.5",
    email: "visiteur_anonyme",
    userAgent: "Safari / iPhone 15",
    path: "/search",
    createdAt: "2024-05-09 14:28:45",
    location: "Lubumbashi, RDC"
  },
  {
    id: "3",
    ipAddress: "102.64.12.98",
    email: "marie.m@test.cd",
    userAgent: "Firefox / macOS",
    path: "/",
    createdAt: "2024-05-09 14:25:30",
    location: "Goma, RDC"
  },
  {
    id: "4",
    ipAddress: "154.21.0.44",
    email: "visiteur_anonyme",
    userAgent: "Edge / Android 14",
    path: "/auth/login",
    createdAt: "2024-05-09 14:20:00",
    location: "Paris, FR"
  }
];

export default function VisitorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Traffic Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Visiteurs</h1>
          <p className="text-muted-foreground mt-1">Surveillez l&apos;activité en temps réel et analysez le trafic de la plateforme.</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 gap-2 px-3 py-1.5 animate-pulse">
           <Activity className="w-3.5 h-3.5" /> 12 Visiteurs en ligne
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Visites aujourd&apos;hui</p>
                <h3 className="text-2xl font-bold mt-1">1,452</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pages vues</p>
                <h3 className="text-2xl font-bold mt-1">4,890</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <MousePointer2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Durée moyenne</p>
                <h3 className="text-2xl font-bold mt-1">4m 12s</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par IP, Email ou Localisation..." 
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11">Actualiser</Button>
      </div>

      {/* Tableau des Visiteurs */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Adresse IP</TableHead>
              <TableHead>Utilisateur (Email)</TableHead>
              <TableHead>Dernière Action</TableHead>
              <TableHead>Appareil / Navigateur</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVisitors.map((visitor) => (
              <TableRow key={visitor.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-primary">{visitor.ipAddress}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {visitor.location}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      visitor.email.includes("@") ? "bg-primary/5 border-primary/10 text-primary" : "bg-muted border-border text-muted-foreground"
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-medium ${visitor.email.includes("@") ? "text-foreground" : "text-muted-foreground italic"}`}>
                      {visitor.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-mono lowercase">
                    {visitor.path}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Monitor className="w-3.5 h-3.5" /> {visitor.userAgent}
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col text-xs">
                     <span className="font-bold">{visitor.createdAt.split(' ')[0]}</span>
                     <span className="text-muted-foreground">{visitor.createdAt.split(' ')[1]}</span>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 z-[100] shadow-2xl bg-card">
                      <DropdownMenuLabel className="text-xs uppercase font-bold text-muted-foreground">Options Sécurité</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-3" /> Voir le parcours
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                        <ShieldAlert className="w-4 h-4 mr-3" /> Bannir l&apos;IP
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination simple */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <div className="text-xs text-muted-foreground font-medium">
             Aperçu des <span className="text-foreground font-bold">50</span> derniers visiteurs uniques
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3">Précédent</Button>
            <Button variant="outline" size="sm" className="h-8 px-3">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
