"use client";

import { use } from "react";
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
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Simulation de données détaillées basées sur le modèle Prisma
const mockHotelDetails = {
  id: "1",
  name: "Zua Palace Kinshasa",
  hotelType: "HOTEL",
  stars: 5,
  description: "Le Zua Palace est un établissement de luxe situé au coeur de Kinshasa, offrant des services de classe mondiale, une piscine olympique et des restaurants gastronomiques.",
  address: "45 Avenue Colonel Mondjiba, Gombe, Kinshasa",
  city: "Kinshasa",
  country: "RDC",
  email: "contact@zuapalace.com",
  phone: "+243 81 000 0000",
  website: "www.zuapalace.com",
  averageRating: 4.8,
  reviewCount: 124,
  isActive: true,
  checkInTime: "14:00",
  checkOutTime: "11:00",
  logo: "/primary_logo.png",
  coverImage: "/admin_bg.png",
  roomsCount: 120,
  activeSubscriptions: [
    { id: "sub1", plan: "Premium Pro", status: "ACTIVE", endDate: "2025-05-09" }
  ]
};

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

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
              <h1 className="text-3xl font-serif font-bold text-foreground">{mockHotelDetails.name}</h1>
              <Badge className="bg-green-500/10 text-green-600 border-green-200">Actif</Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-primary" /> {mockHotelDetails.address}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
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
            <div className="h-32 bg-primary relative">
              <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl shadow-lg border-4 border-card flex items-center justify-center overflow-hidden">
                <Image src={mockHotelDetails.logo} alt="Logo" width={60} height={60} className="object-contain" />
              </div>
            </div>
            <CardContent className="pt-14 pb-6 px-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < mockHotelDetails.stars ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                ))}
                <span className="text-sm font-bold ml-2">{mockHotelDetails.averageRating}</span>
                <span className="text-xs text-muted-foreground">({mockHotelDetails.reviewCount} avis)</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">{mockHotelDetails.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{mockHotelDetails.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-primary hover:underline cursor-pointer">{mockHotelDetails.website}</span>
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
                  <CheckCircle2 className="w-3.5 h-3.5" /> {mockHotelDetails.checkInTime}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-bold flex items-center gap-1 text-primary">
                  <History className="w-3.5 h-3.5" /> {mockHotelDetails.checkOutTime}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-muted-foreground">Total Chambres</span>
                <span className="font-bold">{mockHotelDetails.roomsCount}</span>
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
                  <p className="text-muted-foreground leading-relaxed">
                    {mockHotelDetails.description}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                      <BedDouble className="w-4 h-4" /> Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">84%</div>
                    <p className="text-xs text-muted-foreground">Taux d&apos;occupation moyen</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                      <Users className="w-4 h-4" /> Visiteurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">+1,250</div>
                    <p className="text-xs text-muted-foreground">Arrivées ce mois-ci</p>
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
                  Visualisez et gérez l&apos;inventaire des chambres, les tarifs et les disponibilités en temps réel.
                </p>
                <Button className="mt-6">Ouvrir l&apos;inventaire</Button>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="animate-in fade-in slide-in-from-top-4 duration-300">
               <Card className="border-none shadow-lg bg-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">Avis et Feedback</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Consultez ce que les voyageurs disent de cet établissement et répondez à leurs avis.
                </p>
                <Button variant="outline" className="mt-6">Voir les 124 avis</Button>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <Card className="border-none shadow-xl bg-card overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-serif">Plan Actuel : Premium Pro</CardTitle>
                      <CardDescription>Abonnement annuel actif</CardDescription>
                    </div>
                    <Badge className="bg-primary text-white h-8 px-4">ACTIF</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Date de début</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> 10 Mai 2024
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Date d&apos;expiration</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> 09 Mai 2025
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Méthode de paiement</p>
                      <p className="font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" /> Visa Card **** 4242
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
