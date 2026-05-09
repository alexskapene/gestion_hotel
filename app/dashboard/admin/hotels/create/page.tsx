"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Hotel,
  MapPin,
  Phone,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Informations", description: "Nom et type d'établissement", icon: Hotel },
  { id: 2, title: "Localisation", description: "Adresse et coordonnées GPS", icon: MapPin },
  { id: 3, title: "Contact", description: "Email, Téléphone, WhatsApp", icon: Phone },
  { id: 4, title: "Politiques", description: "Check-in/out et annulation", icon: Clock },
  { id: 5, title: "Photos", description: "Logo et images de couverture", icon: ImageIcon },
];

export default function CreateHotelPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    hotelType: "",
    stars: "0",
    ownerId: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    country: "République Démocratique du Congo",
    city: "",
    address: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "",
    isFeatured: false,
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données de l'hôtel à enregistrer:", formData);
    alert("Hôtel enregistré avec succès !");
    router.push("/dashboard/admin/hotels");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/admin/hotels">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Ajouter un Hôtel</h1>
            <p className="text-muted-foreground">Remplissez les informations pour créer un nouvel établissement.</p>
          </div>
        </div>
      </div>

      {/* Stepper Horizontal en haut */}
      <div className="relative px-4">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0 hidden md:block" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary -z-0 transition-all duration-500 hidden md:block" 
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        <div className="relative flex justify-between items-start">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center group">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-10 ${
                  currentStep >= step.id 
                    ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110" 
                    : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <div className="mt-3 text-center hidden md:block">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground/60"
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-5xl mx-auto w-full">
        <Card className="border-none shadow-2xl bg-card overflow-hidden transition-all duration-500">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-3">
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* STEP 1: General Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l&apos;établissement</Label>
                      <Input 
                        id="name" 
                        placeholder="Ex: Zua Palace Kinshasa" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotelType">Type d&apos;hébergement</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, hotelType: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOTEL">Hôtel</SelectItem>
                          <SelectItem value="MOTEL">Motel</SelectItem>
                          <SelectItem value="RESORT">Resort</SelectItem>
                          <SelectItem value="APARTMENT">Appartement</SelectItem>
                          <SelectItem value="VILLA">Villa</SelectItem>
                          <SelectItem value="HOSTEL">Auberge (Hostel)</SelectItem>
                          <SelectItem value="LODGE">Lodge</SelectItem>
                          <SelectItem value="GUEST_HOUSE">Maison d&apos;hôtes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stars">Nombre d&apos;étoiles</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, stars: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir le niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Pas d&apos;étoiles</SelectItem>
                          <SelectItem value="1">1 Étoile</SelectItem>
                          <SelectItem value="2">2 Étoiles</SelectItem>
                          <SelectItem value="3">3 Étoiles</SelectItem>
                          <SelectItem value="4">4 Étoiles</SelectItem>
                          <SelectItem value="5">5 Étoiles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner">Propriétaire (Owner)</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, ownerId: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Assigner un propriétaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cl123">Jean Dupont (Owner Demo)</SelectItem>
                          <SelectItem value="cl456">Marie Mbaye</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description détaillée</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Décrivez les atouts de votre établissement..." 
                      className="min-h-[150px] resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" value={formData.country} readOnly disabled className="bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input 
                        id="city" 
                        placeholder="Ex: Kinshasa" 
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse complète</Label>
                    <Textarea 
                      id="address" 
                      placeholder="Ex: 45 Avenue Colonel Mondjiba, Gombe" 
                      className="resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contact */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="contact@hotel.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        placeholder="+243 81 000 0000" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input 
                        id="whatsapp" 
                        placeholder="+243 81 000 0000" 
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Site Web (Optionnel)</Label>
                      <Input 
                        id="website" 
                        placeholder="https://www.votrehotel.com" 
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Policies */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Heure de Check-in</Label>
                      <Input 
                        id="checkIn" 
                        type="time" 
                        value={formData.checkInTime}
                        onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Heure de Check-out</Label>
                      <Input 
                        id="checkOut" 
                        type="time" 
                        value={formData.checkOutTime}
                        onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancellation">Politique d&apos;annulation</Label>
                    <Textarea 
                      id="cancellation" 
                      placeholder="Ex: Annulation gratuite jusqu'à 24h avant l'arrivée..." 
                      className="min-h-[100px] resize-none"
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Images */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-primary w-6 h-6" />
                      </div>
                      <p className="font-medium text-sm">Logo de l&apos;hôtel</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou SVG (Max. 2MB)</p>
                    </div>
                    <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-primary w-6 h-6" />
                      </div>
                      <p className="font-medium text-sm">Image de couverture</p>
                      <p className="text-xs text-muted-foreground mt-1">Paysage recommandé (Max. 5MB)</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-start gap-3">
                    <FileText className="text-primary w-5 h-5 mt-0.5" />
                    <p className="text-xs text-primary-foreground/80 leading-relaxed font-medium">
                      Vous pourrez ajouter des photos supplémentaires de l&apos;établissement et des chambres une fois que l&apos;hôtel sera créé dans votre espace de gestion.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-muted/10 p-6 flex justify-between items-center border-t border-border mt-8">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Précédent
              </Button>

              {currentStep < STEPS.length ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary/90 gap-2 px-8 h-11"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 gap-2 px-8 h-11 shadow-lg shadow-primary/20"
                >
                  Enregistrer l&apos;établissement <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
