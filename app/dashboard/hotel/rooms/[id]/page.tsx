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
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BedDouble,
  Users,
  DollarSign,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Maximize2,
  Bath,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function EditRoomPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    roomNumber: "",
    title: "",
    description: "",
    price: "",
    capacity: "2",
    bedCount: "1",
    bathroomCount: "1",
    size: "",
    categoryId: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchData() {
      try {
        const [roomRes, categoriesRes] = await Promise.all([
          fetch(`/api/rooms/${id}`),
          fetch("/api/hotels/rooms"),
        ]);

        if (roomRes.ok && categoriesRes.ok) {
          const roomData = await roomRes.json();
          const categoriesData = await categoriesRes.json();

          setCategories(categoriesData.categories || []);
          setFormData({
            roomNumber: roomData.roomNumber,
            title: roomData.title,
            description: roomData.description || "",
            price: roomData.price.toString(),
            capacity: roomData.capacity.toString(),
            bedCount: (roomData.bedCount || 1).toString(),
            bathroomCount: (roomData.bathroomCount || 1).toString(),
            size: (roomData.size || "").toString(),
            categoryId: roomData.categoryId,
            status: roomData.status,
          });
          // Load existing images
          if (roomData.images && Array.isArray(roomData.images)) {
            setRoomImages(roomData.images.map((img: any) => img.imageUrl));
          }
        } else {
          toast.error("Erreur lors du chargement des données");
          router.push("/dashboard/hotel/rooms");
        }
      } catch (error) {
        toast.error("Erreur réseau");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, session, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (roomImages.length + files.length > 2) {
      toast.error("Maximum 2 images autorisées");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        toast.error(`L'image ${file.name} dépasse 2MB`);
        return;
      }
    }

    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data && Array.isArray(data.urls)) {
        const combined = [...roomImages, ...data.urls];
        setRoomImages(combined);
        toast.success(`${data.urls.length} image(s) téléversée(s)`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setRoomImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          bedCount: parseInt(formData.bedCount),
          bathroomCount: parseInt(formData.bathroomCount),
          size: formData.size ? parseFloat(formData.size) : null,
          images: roomImages,
        }),
      });

      if (response.ok) {
        toast.success("Chambre mise à jour avec succès !");
        router.push("/dashboard/hotel/rooms");
      } else {
        const error = await response.json();
        toast.error(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Chargement de la chambre...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/hotel/rooms">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Modifier la Chambre</h1>
            <p className="text-muted-foreground">Mettez à jour les informations de la chambre {formData.roomNumber}.</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <Card className="border-none shadow-2xl bg-card overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Informations de la chambre</CardTitle>
            <CardDescription>Modifiez les détails de votre chambre</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Numéro et Titre */}
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
                <Label htmlFor="title">Titre d'affichage</Label>
                <Input
                  id="title"
                  placeholder="Ex: Suite Deluxe"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie de chambre</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
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

            {/* Prix et Capacité */}
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

            {/* Lits, Salle de bain, Taille */}
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

            {/* Statut */}
            <div className="space-y-2">
              <Label>Statut de la chambre</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Disponible</SelectItem>
                  <SelectItem value="OCCUPIED">Occupée</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Images */}
            <div className="space-y-3">
              <Label>Images de la chambre (Max 2, max 2MB chacune)</Label>
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading || roomImages.length >= 2}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">Cliquez pour uploader les images</p>
                  <p className="text-xs text-muted-foreground">{roomImages.length}/2 images</p>
                </div>
              </label>
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Téléversement en cours...
                </div>
              )}
              {roomImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {roomImages.map((src, i) => (
                    <div key={i} className="relative group">
                      <div className="w-full aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={src}
                          alt={`room-${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          <div className="p-6 border-t border-border flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/hotel/rooms")}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
