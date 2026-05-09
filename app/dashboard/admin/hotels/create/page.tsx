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
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Globe,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import Link from "next/link";

const steps = [
  { id: 1, title: "Informations Générales", icon: Building2 },
  { id: 2, title: "Localisation & Contact", icon: MapPin },
  { id: 3, title: "Politiques & Médias", icon: ImageIcon },
];

export default function CreateHotelPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    slug: "",
    hotelType: "",
    stars: "0",
    shortDescription: "",
    description: "",
    // Step 2
    country: "République Démocratique du Congo",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    // Step 3
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "",
    logo: "",
    coverImage: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Auto-slug generation from name
    if (field === "name") {
      const slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setFormData((prev) => ({ ...prev, name: value, slug }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Stepper */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        <div className="flex items-center w-full max-w-3xl justify-between relative px-2">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-card border-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        
        {/* STEP 1: GENERAL INFO */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-serif">Informations Générales</CardTitle>
              <CardDescription>Définissez l&apos;identité et la catégorie de votre établissement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l&apos;hôtel</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Zua Palace Kinshasa" 
                    className="h-12"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input 
                    id="slug" 
                    placeholder="zua-palace-kinshasa" 
                    className="h-12 bg-muted/30"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)} readOnly
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Type d&apos;établissement</Label>
                  <Select onValueChange={(v) => handleInputChange("hotelType", v)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choisir le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOTEL">Hôtel classique</SelectItem>
                      <SelectItem value="RESORT">Complexe hôtelier (Resort)</SelectItem>
                      <SelectItem value="APARTMENT">Appart-hôtel</SelectItem>
                      <SelectItem value="VILLA">Villa de luxe</SelectItem>
                      <SelectItem value="HOSTEL">Auberge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nombre d&apos;étoiles</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Button 
                        key={s}
                        type="button"
                        variant={parseInt(formData.stars) >= s ? "default" : "outline"}
                        className="h-12 w-12 p-0"
                        onClick={() => handleInputChange("stars", s.toString())}
                      >
                        <Star className={`w-4 h-4 ${parseInt(formData.stars) >= s ? "fill-white" : ""}`} />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Description courte (Slogan/Accroche)</Label>
                <Input 
                  id="shortDescription" 
                  placeholder="Ex: Un havre de paix au coeur de la capitale..." 
                  className="h-12"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez les services, l'ambiance et l'histoire de l'hôtel..." 
                  className="min-h-[150px] resize-none"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </div>
        )}

        {/* STEP 2: LOCATION & CONTACT */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-serif">Localisation & Contact</CardTitle>
              <CardDescription>Précisez où se situe l&apos;hôtel et comment le contacter directement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input id="country" defaultValue="République Démocratique du Congo" className="h-12 bg-muted/30" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    placeholder="Ex: Kinshasa, Goma, Lubumbashi..." 
                    className="h-12"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse physique</Label>
                <Input 
                  id="address" 
                  placeholder="Numéro, Avenue, Quartier..." 
                  className="h-12"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Professionnel</Label>
                    <Input 
                      placeholder="contact@hotel.com" 
                      className="h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Téléphone Réception</Label>
                    <Input 
                      placeholder="+243 ..." 
                      className="h-12"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-primary" /> WhatsApp Business</Label>
                    <Input 
                      placeholder="+243 ..." 
                      className="h-12"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Site Web</Label>
                    <Input 
                      placeholder="https://www.hotel.com" 
                      className="h-12"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                 </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* STEP 3: POLICIES & MEDIA */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle className="text-3xl font-serif">Politiques & Médias</CardTitle>
              <CardDescription>Définissez les règles de séjour et l&apos;aspect visuel de l&apos;établissement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Check-in</Label>
                          <Input type="time" defaultValue="14:00" className="h-12" onChange={(e) => handleInputChange("checkInTime", e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Check-out</Label>
                          <Input type="time" defaultValue="11:00" className="h-12" onChange={(e) => handleInputChange("checkOutTime", e.target.value)} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Politique d&apos;annulation</Label>
                       <Textarea 
                         placeholder="Ex: Annulation gratuite jusqu'à 24h avant l'arrivée..." 
                         className="min-h-[100px]"
                         value={formData.cancellationPolicy}
                         onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                       <ImageIcon className="w-10 h-10 text-muted-foreground" />
                       <div className="text-center">
                          <p className="font-bold text-sm">Logo de l&apos;hôtel</p>
                          <p className="text-[10px] text-muted-foreground">PNG, JPG ou SVG (Max 2MB)</p>
                       </div>
                    </div>
                    <div className="p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                       <ImageIcon className="w-10 h-10 text-muted-foreground" />
                       <div className="text-center">
                          <p className="font-bold text-sm">Image de couverture</p>
                          <p className="text-[10px] text-muted-foreground">Recommandé : 1920x1080 px</p>
                       </div>
                    </div>
                 </div>
              </div>
            </CardContent>
          </div>
        )}

        <CardFooter className="bg-muted/10 border-t border-border p-6 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="h-12 px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="h-12 px-8 bg-primary hover:bg-primary/90">
              Continuer <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="h-12 px-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              Enregistrer l&apos;Hôtel <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
