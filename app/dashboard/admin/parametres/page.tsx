"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Phone, 
  Save, 
  Camera,
  CheckCircle2,
  DollarSign,
  Info
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et les configurations de la plateforme.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-8" onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Navigation Sidebar */}
          <Card className="w-full lg:w-[280px] border-none shadow-xl bg-card p-2 shrink-0">
            <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0">
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all border-transparent data-[state=active]:border-primary"
              >
                <User className="w-4 h-4" /> Mon Profil
              </TabsTrigger>
              <TabsTrigger 
                value="global" 
                className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
              >
                <Globe className="w-4 h-4" /> Paramètres Globaux
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
              >
                <ShieldCheck className="w-4 h-4" /> Sécurité
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start gap-3 h-12 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
              >
                <Bell className="w-4 h-4" /> Notifications
              </TabsTrigger>
            </TabsList>
          </Card>

          {/* Content Area */}
          <div className="flex-1 w-full">
            {/* TABS CONTENT: PROFILE */}
            <TabsContent value="profile" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <Card className="border-none shadow-xl bg-card">
                 <CardHeader>
                   <CardTitle className="font-serif text-2xl">Informations Personnelles</CardTitle>
                   <CardDescription>Mettez à jour vos identifiants et vos coordonnées.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                       <div className="relative group">
                          <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg transition-transform group-hover:scale-105">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">LM</AvatarFallback>
                          </Avatar>
                          <Button size="icon" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg">
                            <Camera className="w-4 h-4" />
                          </Button>
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">Laurence 1Mas</h4>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Administrateur Principal</p>
                          <p className="text-xs text-muted-foreground mt-1">Inscrit depuis le 10 Janvier 2024</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                          <Input id="username" defaultValue="laurence1Mas" className="h-11" />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="email">Adresse Email</Label>
                          <Input id="email" type="email" defaultValue="laurence@zua.cd" className="h-11" />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="phone">Numéro de Téléphone</Label>
                          <Input id="phone" defaultValue="+243 81 000 0001" className="h-11" />
                       </div>
                    </div>
                 </CardContent>
                 <CardFooter className="bg-muted/10 border-t border-border p-6 flex justify-end">
                    <Button className="bg-primary hover:bg-primary/90 gap-2 px-8">
                       Enregistrer les modifications <Save className="w-4 h-4" />
                    </Button>
                 </CardFooter>
               </Card>
            </TabsContent>

            {/* TABS CONTENT: GLOBAL SETTINGS */}
            <TabsContent value="global" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <Card className="border-none shadow-xl bg-card overflow-hidden">
                 <div className="h-2 bg-primary w-full" />
                 <CardHeader>
                   <CardTitle className="font-serif text-2xl flex items-center gap-2">
                      <Settings className="w-6 h-6 text-primary" /> Configuration Plateforme
                   </CardTitle>
                   <CardDescription>Gérez les réglages généraux de Zua Place.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="appName">Nom de l&apos;application</Label>
                            <Input id="appName" defaultValue="Zua Place" className="h-11" />
                          </div>
                          <div className="space-y-2">
                             <Label>Devise par défaut</Label>
                             <Select defaultValue="USD">
                                <SelectTrigger className="h-11">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="USD">Dollar Américain ($)</SelectItem>
                                   <SelectItem value="EUR">Euro (€)</SelectItem>
                                   <SelectItem value="CDF">Franc Congolais (FC)</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                       
                       <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="font-bold flex items-center gap-2 text-primary">
                                  <Info className="w-4 h-4" /> Mode Maintenance
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  Une fois activé, seule l&apos;administration aura accès à la plateforme.
                                </p>
                             </div>
                             <Switch />
                          </div>
                          <Badge variant="outline" className="mt-4 w-fit bg-background text-[10px] font-bold">STATUT : OPÉRATIONNEL</Badge>
                       </div>
                    </div>

                    <div className="space-y-2 pt-4">
                       <Label>Description SEO de la plateforme</Label>
                       <Textarea 
                          className="min-h-[120px] resize-none" 
                          placeholder="Décrivez votre plateforme pour les moteurs de recherche..." 
                          defaultValue="Zua Place est la plateforme de référence pour la gestion et la réservation d'hôtels en République Démocratique du Congo."
                       />
                    </div>
                 </CardContent>
                 <CardFooter className="bg-muted/10 border-t border-border p-6 flex justify-end">
                    <Button className="bg-primary hover:bg-primary/90 gap-2 px-8 shadow-lg shadow-primary/20">
                       Appliquer les changements <CheckCircle2 className="w-4 h-4" />
                    </Button>
                 </CardFooter>
               </Card>
            </TabsContent>

            {/* TABS CONTENT: SECURITY (Mockup) */}
            <TabsContent value="security" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <Card className="border-none shadow-xl bg-card">
                 <CardHeader>
                   <CardTitle className="font-serif text-2xl">Sécurité du Compte</CardTitle>
                   <CardDescription>Protégez votre accès avec un mot de passe robuste.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                       <Label>Mot de passe actuel</Label>
                       <Input type="password" placeholder="••••••••" className="h-11" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                       <div className="space-y-2">
                          <Label>Nouveau mot de passe</Label>
                          <Input type="password" placeholder="••••••••" className="h-11" />
                       </div>
                       <div className="space-y-2">
                          <Label>Confirmer le mot de passe</Label>
                          <Input type="password" placeholder="••••••••" className="h-11" />
                       </div>
                    </div>
                 </CardContent>
                 <CardFooter className="bg-muted/10 border-t border-border p-6 flex justify-end">
                    <Button className="bg-primary hover:bg-primary/90 px-8">Changer le mot de passe</Button>
                 </CardFooter>
               </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
