"use client";

import { useState, useEffect, use } from "react";
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
  Smartphone,
  Loader2,
  X,
  Upload,
  Save
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

export default function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [owners, setOwners] = useState<any[]>([]);

  // Images state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [hotelFiles, setHotelFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    hotelType: "HOTEL",
    stars: 0,
    description: "",
    ownerId: "",
    country: "République Démocratique du Congo",
    city: "",
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "",
  });

  // Charger les données de l'hôtel et les propriétaires
  useEffect(() => {
    async function fetchData() {
      try {
        const [ownersRes, hotelRes] = await Promise.all([
          fetch("/api/admin/users?role=HOTEL_OWNER"),
          fetch(`/api/admin/hotels/${id}`)
        ]);

        const ownersData = await ownersRes.json();
        const hotelData = await hotelRes.json();

        if (ownersRes.ok) setOwners(ownersData.users);
        
        if (hotelRes.ok) {
          setFormData({
            name: hotelData.name,
            slug: hotelData.slug,
            hotelType: hotelData.hotelType,
            stars: hotelData.stars,
            description: hotelData.description || "",
            ownerId: hotelData.ownerId,
            country: hotelData.country,
            city: hotelData.city,
            address: hotelData.address,
            email: hotelData.email || "",
            phone: hotelData.phone || "",
            whatsapp: hotelData.whatsapp || "",
            website: hotelData.website || "",
            checkInTime: hotelData.checkInTime || "14:00",
            checkOutTime: hotelData.checkOutTime || "11:00",
            cancellationPolicy: hotelData.cancellationPolicy || "",
          });
        } else {
          toast.error("Hôtel introuvable");
          router.push("/dashboard/admin/hotels");
        }
      } catch (error) {
        toast.error("Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

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
      setHotelFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/hotels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Hôtel mis à jour avec succès !");
        router.push(`/dashboard/admin/hotels/${id}`);
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

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement de l&apos;éditeur...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href={`/dashboard/admin/hotels/${id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-serif font-bold text-foreground">Modifier l&apos;Hôtel</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-xs font-bold uppercase text-muted-foreground">Étape {currentStep} sur 3</p>
              <p className="text-sm text-primary font-medium">{steps[currentStep-1].title}</p>
           </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex flex-col items-center justify-center space-y-4">
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
            </div>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l&apos;hôtel</Label>
                  <Input 
                    id="name" 
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
                    <Label>Propriétaire</Label>
                    <Select value={formData.ownerId} onValueChange={(v) => handleInputChange("ownerId", v)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Changer le propriétaire" />
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
                        <SelectValue />
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea 
                  id="description" 
                  className="min-h-[150px] resize-none"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Localisation & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    className="h-12"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse physique</Label>
                  <Input 
                    id="address" 
                    className="h-12"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Professionnel</Label>
                    <Input 
                      className="h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Téléphone</Label>
                    <Input 
                      className="h-12"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Site Web</Label>
                    <Input 
                      className="h-12"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                 </div>
              </div>
            </CardContent>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Politiques & Médias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Check-in</Label>
                          <Input type="time" className="h-12" value={formData.checkInTime} onChange={(e) => handleInputChange("checkInTime", e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <Label>Check-out</Label>
                          <Input type="time" className="h-12" value={formData.checkOutTime} onChange={(e) => handleInputChange("checkOutTime", e.target.value)} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Politique d&apos;annulation</Label>
                       <Textarea 
                         className="min-h-[100px]"
                         value={formData.cancellationPolicy}
                         onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 bg-muted/10 opacity-50 cursor-not-allowed">
                       <ImageIcon className="w-10 h-10 text-muted-foreground" />
                       <div className="text-center">
                          <p className="font-bold text-sm text-muted-foreground">Médias non modifiables ici</p>
                          <p className="text-[10px] text-muted-foreground">La gestion des photos arrive bientôt</p>
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
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="h-12 px-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Mettre à jour l&apos;Hôtel
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
