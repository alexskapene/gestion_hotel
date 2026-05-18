"use client";

import { use, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Users, 
  BedDouble, 
  CreditCard,
  History,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Loader2,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [hotel, setHotel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHotelDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/hotels/${id}`);
      const data = await response.json();
      if (response.ok) {
        setHotel(data);
      } else {
        toast.error("Erreur lors de la récupération des détails");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement des détails de l&apos;établissement...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Hôtel introuvable</h2>
        <Button asChild>
          <Link href="/dashboard/admin/hotels">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/admin/hotels">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-foreground">{hotel.name}</h1>
              <div className="flex gap-2">
                <Badge className={hotel.isActive ? "bg-green-500/10 text-green-600 border-green-200" : "bg-red-500/10 text-red-600 border-red-200"}>
                  {hotel.isActive ? "Actif" : "Inactif"}
                </Badge>
                <Badge variant="outline" className={hotel.isVerified ? "text-blue-600 border-blue-200" : "text-orange-600 border-orange-200"}>
                  {hotel.isVerified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-primary" /> {hotel.address}, {hotel.city}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled>
            <Link href={`/dashboard/admin/hotels/${id}/edit`}>
              <Edit className="w-4 h-4 mr-2" /> Modifier
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            Gérer les Chambres
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Stats & Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl bg-card">
            <div className="h-32 bg-primary relative overflow-hidden">
               {hotel.coverImage && <Image src={hotel.coverImage} alt="Cover" fill className="object-cover opacity-60" />}
              <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl shadow-lg border-4 border-card flex items-center justify-center overflow-hidden">
                {hotel.logo ? (
                   <Image src={hotel.logo} alt="Logo" width={60} height={60} className="object-contain" />
                ) : (
                   <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {hotel.name.charAt(0)}
                   </div>
                )}
              </div>
            </div>
            <CardContent className="pt-14 pb-6 px-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < hotel.stars ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                ))}
                <span className="text-sm font-bold ml-2">{hotel.averageRating}</span>
                <span className="text-xs text-muted-foreground">({hotel.reviewCount} avis)</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">{hotel.email || "Non renseigné"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{hotel.phone || "Non renseigné"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-primary hover:underline cursor-pointer">{hotel.website || "Pas de site web"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Horaires & Infos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted-foreground">Check-in</span>
                <span className="font-bold flex items-center gap-1 text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {hotel.checkInTime || "14:00"}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-bold flex items-center gap-1 text-primary">
                  <History className="w-3.5 h-3.5" /> {hotel.checkOutTime || "11:00"}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-muted-foreground">Total Chambres</span>
                <span className="font-bold">{hotel._count?.rooms || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-card border border-border p-1 rounded-xl mb-6">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Aperçu Général
              </TabsTrigger>
              <TabsTrigger value="rooms" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Chambres
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Avis Clients
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Abonnement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="border-none shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="font-serif">À propos de l&apos;établissement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {hotel.description || "Aucune description fournie pour cet établissement."}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                      <BedDouble className="w-4 h-4" /> Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{hotel.hotelType}</div>
                    <p className="text-xs text-muted-foreground">Catégorie d&apos;hébergement</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                      <Users className="w-4 h-4" /> Propriétaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-primary truncate">@{hotel.owner?.username || "Admin"}</div>
                    <p className="text-xs text-muted-foreground">{hotel.owner?.email || "Compte système"}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="animate-in fade-in slide-in-from-top-4 duration-300">
              <Card className="border-none shadow-lg bg-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <BedDouble className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">Gestion des Chambres</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Cet hôtel dispose de {hotel._count?.rooms || 0} chambres enregistrées.
                </p>
                <Button className="mt-6" asChild>
                  <Link href={`/dashboard/admin/chambres?hotel=${id}`}>Ouvrir l&apos;inventaire</Link>
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="animate-in fade-in slide-in-from-top-4 duration-300">
               <Card className="border-none shadow-lg bg-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">Avis et Feedback</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  {hotel.reviewCount} avis ont été laissés par les voyageurs.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                   <Link href={`/dashboard/admin/avis?hotel=${id}`}>Voir les avis</Link>
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <Card className="border-none shadow-xl bg-card overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-serif">État de l&apos;abonnement</CardTitle>
                      <CardDescription>Informations sur la facturation et les services</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                   <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">Aucun abonnement actif trouvé pour cet établissement.</p>
                   <Button variant="link" className="text-primary mt-2">Voir les offres de service</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
