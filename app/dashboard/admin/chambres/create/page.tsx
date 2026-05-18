"use client";

import { useState, useEffect, useCallback } from "react";
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
  DoorOpen,
  Users,
  BedDouble,
  DollarSign,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Hotel,
  Maximize2,
  Bath,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Configuration", description: "Hôtel et type de chambre", icon: Hotel },
  { id: 2, title: "Détails & Prix", description: "Capacité, taille et tarif", icon: DollarSign },
  { id: 3, title: "Médias", description: "Photos de la chambre", icon: ImageIcon },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [hotels, setHotels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    title: "",
    description: "",
    price: "",
    capacity: "2",
    bedCount: "1",
    bathroomCount: "1",
    size: "",
    hotelId: "",
    categoryId: "",
    status: "AVAILABLE",
  });

  // Fetch hotels on mount
  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/admin/hotels");
        if (res.ok) {
          const data = await res.json();
          setHotels(data);
        }
      } catch (error) {
        toast.error("Erreur de chargement des hôtels");
      }
    }
    fetchHotels();
  }, []);

  // Fetch categories when hotelId changes
  useEffect(() => {
    async function fetchCategories() {
      if (!formData.hotelId) {
        setCategories([]);
        return;
      }
      try {
        const res = await fetch(`/api/admin/room-categories?hotelId=${formData.hotelId}`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        toast.error("Erreur de chargement des catégories");
      }
    }
    fetchCategories();
  }, [formData.hotelId]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length) {
      nextStep();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          bedCount: parseInt(formData.bedCount),
          bathroomCount: parseInt(formData.bathroomCount),
          size: formData.size ? parseFloat(formData.size) : null,
        }),
      });

      if (response.ok) {
        toast.success("Chambre ajoutée avec succès !");
        router.push("/dashboard/admin/chambres");
      } else {
        const error = await response.json();
        toast.error(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/admin/chambres">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Ajouter une Chambre</h1>
            <p className="text-muted-foreground">Créez une nouvelle unité pour l&apos;un de vos établissements.</p>
          </div>
        </div>
      </div>

      {/* Stepper Horizontal */}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-10 ${currentStep >= step.id
                    ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110"
                    : "bg-background border-muted text-muted-foreground"
                  }`}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <div className="mt-3 text-center hidden md:block">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= step.id ? "text-primary" : "text-muted-foreground/60"
                  }`}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <Card className="border-none shadow-2xl bg-card overflow-hidden transition-all duration-500">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-3">
              {STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* STEP 1: Configuration */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel">Hôtel de rattachement</Label>
                    <Select value={formData.hotelId} onValueChange={(val) => setFormData({ ...formData, hotelId: val, categoryId: "" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir l'hôtel" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map((h) => (
                          <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie de chambre</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                      disabled={!formData.hotelId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.hotelId ? "Choisir la catégorie" : "Sélectionnez d'abord un hôtel"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Numéro de chambre</Label>
                    <Input
                      id="roomNumber"
                      placeholder="Ex: 101"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre d&apos;affichage</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Suite Deluxe Vue Mer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optionnel)</Label>
                  <Textarea
                    id="description"
                    placeholder="Détails sur la chambre..."
                    className="min-h-[100px] resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Details & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix par nuit ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        className="pl-10"
                        placeholder="Ex: 150"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité (Personnes)</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="capacity"
                        type="number"
                        className="pl-10"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="beds">Nombre de lits</Label>
                    <div className="relative">
                      <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="beds"
                        type="number"
                        className="pl-10"
                        value={formData.bedCount}
                        onChange={(e) => setFormData({ ...formData, bedCount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Salles de bain</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="bathrooms"
                        type="number"
                        className="pl-10"
                        value={formData.bathroomCount}
                        onChange={(e) => setFormData({ ...formData, bathroomCount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Taille (m²)</Label>
                    <div className="relative">
                      <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="size"
                        type="number"
                        className="pl-10"
                        placeholder="Ex: 35"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Media */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-12 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-primary w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-serif font-bold">Photos de la chambre</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Glissez-déposez ou cliquez pour ajouter les photos de l&apos;intérieur. (Max. 5 photos)
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Prêt à l&apos;emploi</p>
                    <p className="text-xs text-primary/70 leading-relaxed">
                      Une fois enregistrée, la chambre sera immédiatement visible pour les réservations en ligne selon l&apos;état de disponibilité défini.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-muted/10 p-6 flex justify-between items-center border-t border-border mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
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
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 gap-2 px-8 h-11 shadow-lg shadow-primary/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Créer la chambre
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
