"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Clock,
  ShieldCheck,
  Smartphone,
  Loader2,
  X,
  Upload
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";

const steps = [
  { id: 1, title: "Informations Générales", icon: Building2 },
  { id: 2, title: "Localisation & Contact", icon: MapPin },
  { id: 3, title: "Politiques & Médias", icon: ImageIcon },
];

export default function CreateHotelPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(true);

  // Images state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [hotelFiles, setHotelFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    slug: "",
    hotelType: "HOTEL",
    stars: 0,
    description: "",
    ownerId: "",
    // Step 2
    country: "République Démocratique du Congo",
    city: "",
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    // Step 3
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "",
  });

  // Charger les propriétaires potentiels
  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await fetch("/api/admin/users?role=HOTEL_OWNER");
        const data = await res.json();
        if (res.ok) setOwners(data.users);
      } catch (error) {
        toast.error("Impossible de charger les propriétaires");
      } finally {
        setIsLoadingOwners(false);
      }
    }
    fetchOwners();
  }, []);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Slug generation
    if (field === "name") {
      const slug = slugify(value, { lower: true, strict: true });
      setFormData((prev) => ({ ...prev, name: value, slug }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'images') => {
    const files = e.target.files;
    if (!files) return;

    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (type === 'logo') {
      const file = files[0];
      if (file.size > maxFileSize) {
        toast.error("Le logo ne doit pas dépasser 2Mo");
        return;
      }
      setLogoFile(file);
    } else {
      const newFiles = Array.from(files);
      if (hotelFiles.length + newFiles.length > 4) {
        toast.error("Maximum 4 images additionnelles autorisées");
        return;
      }

      const validFiles = newFiles.filter(file => {
        if (file.size > maxFileSize) {
          toast.error(`${file.name} est trop lourd (> 2Mo)`);
          return false;
        }
        return true;
      });

      setHotelFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setHotelFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.ownerId || !formData.city) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      // NOTE: Dans un cas réel avec des fichiers, on utiliserait FormData
      // Pour cet exemple, on simule l'envoi (on pourrait convertir en Base64 ou utiliser S3/Cloudinary)
      
      const payload = {
        ...formData,
        logo: logoFile ? "logo_url_placeholder" : null, // Simulation
        images: hotelFiles.map(() => "image_url_placeholder"), // Simulation
      };

      const response = await fetch("/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Hôtel créé avec succès ! Il est en attente de vérification.");
        router.push("/dashboard/admin/hotels");
      } else {
        const error = await response.json();
        toast.error(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Stepper */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        <div className="flex items-center w-full max-w-3xl justify-between relative px-2">
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
                  <Label htmlFor="name">Nom de l&apos;hôtel <span className="text-destructive">*</span></Label>
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
                    className="h-12 bg-muted/30"
                    value={formData.slug}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>Propriétaire <span className="text-destructive">*</span></Label>
                    <Select value={formData.ownerId} onValueChange={(v) => handleInputChange("ownerId", v)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={isLoadingOwners ? "Chargement..." : "Choisir un propriétaire"} />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map(owner => (
                          <SelectItem key={owner.id} value={owner.id}>
                            @{owner.username} ({owner.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type d&apos;établissement</Label>
                    <Select value={formData.hotelType} onValueChange={(v) => handleInputChange("hotelType", v)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOTEL">Hôtel classique</SelectItem>
                        <SelectItem value="RESORT">Complexe hôtelier (Resort)</SelectItem>
                        <SelectItem value="APARTMENT">Appart-hôtel</SelectItem>
                        <SelectItem value="VILLA">Villa de luxe</SelectItem>
                        <SelectItem value="HOSTEL">Auberge</SelectItem>
                        <SelectItem value="LODGE">Lodge</SelectItem>
                        <SelectItem value="GUEST_HOUSE">Maison d&apos;hôtes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
              
              <div className="space-y-2">
                <Label>Nombre d&apos;étoiles</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Button 
                      key={s}
                      type="button"
                      variant={formData.stars >= s ? "default" : "outline"}
                      className="h-12 w-12 p-0"
                      onClick={() => handleInputChange("stars", s)}
                    >
                      <Star className={`w-4 h-4 ${formData.stars >= s ? "fill-white" : ""}`} />
                    </Button>
                  ))}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="ml-2" 
                    onClick={() => handleInputChange("stars", 0)}
                  >Réinitialiser</Button>
                </div>
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
                  <Input id="country" value={formData.country} className="h-12 bg-muted/30" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="address">Adresse physique <span className="text-destructive">*</span></Label>
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
              <CardDescription>Images (Logo + 4 max, 2Mo max chacune).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Check-in</Label>
                          <Input type="time" className="h-12" value={formData.checkInTime} onChange={(e) => handleInputChange("checkInTime", e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Check-out</Label>
                          <Input type="time" className="h-12" value={formData.checkOutTime} onChange={(e) => handleInputChange("checkOutTime", e.target.value)} />
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
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label>Logo de l&apos;hôtel (2Mo max)</Label>
                      <div className="relative group">
                        <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl transition-all cursor-pointer ${logoFile ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 bg-muted/10'}`}>
                          {logoFile ? (
                            <div className="flex items-center gap-3 px-4">
                              <ImageIcon className="w-6 h-6 text-primary" />
                              <span className="text-xs font-medium truncate max-w-[150px]">{logoFile.name}</span>
                              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={(e) => { e.preventDefault(); setLogoFile(null); }}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">Téléverser Logo</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                        </label>
                      </div>
                    </div>

                    {/* Gallery Upload */}
                    <div className="space-y-2">
                      <Label>Galerie (Max 4 images, 2Mo max chacune)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {hotelFiles.map((file, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg border border-border bg-muted/20 flex items-center justify-center p-2 group">
                             <span className="text-[10px] truncate max-w-full">{file.name}</span>
                             <button onClick={() => removeFile(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                               <X className="w-3 h-3" />
                             </button>
                          </div>
                        ))}
                        {hotelFiles.length < 4 && (
                          <label className="aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
                            <Plus className="w-5 h-5 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground mt-1">AJOUTER</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'images')} />
                          </label>
                        )}
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
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="h-12 px-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Enregistrer l&apos;Hôtel <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
