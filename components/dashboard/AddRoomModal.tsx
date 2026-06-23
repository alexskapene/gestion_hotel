"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface AddRoomModalProps {
  categories: any[];
  hotelId: string;
  onRoomAdded: () => void;
}

export default function AddRoomModal({
  categories,
  hotelId,
  onRoomAdded,
}: AddRoomModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    roomNumber: "",
    title: "",
    description: "",
    price: "",
    capacity: "1",
    categoryId: "",
    categoryName: "",
    bedCount: "",
    bathroomCount: "",
    size: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const nextState = { ...prev, [field]: value };

      if (field === "categoryName" && value.trim().length > 0) {
        nextState.categoryId = "";
      }

      if (field === "categoryId" && value) {
        nextState.categoryName = "";
      }

      return nextState;
    });
  };

  const handleToggleNewCategory = () => {
    setShowNewCategory((current) => {
      if (current) {
        setFormData((prev) => ({ ...prev, categoryName: "" }));
      }
      return !current;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check max 2 images total
    if (roomImages.length + files.length > 2) {
      toast.error("Maximum 2 images autorisées");
      return;
    }

    // Check each file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
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
    setLoading(true);

    try {
      // Validation
      if (!formData.roomNumber || !formData.title || !formData.price || (!formData.categoryId && !formData.categoryName)) {
        toast.error("Veuillez remplir tous les champs requis");
        setLoading(false);
        return;
      }

      const payload = {
        roomNumber: formData.roomNumber,
        title: formData.title,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        categoryId: formData.categoryId || undefined,
        categoryName: formData.categoryName ? formData.categoryName.trim() : undefined,
        bedCount: formData.bedCount ? parseInt(formData.bedCount) : undefined,
        bathroomCount: formData.bathroomCount ? parseInt(formData.bathroomCount) : undefined,
        size: formData.size ? parseFloat(formData.size) : undefined,
        images: roomImages,
      };

      const response = await fetch("/api/hotels/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      toast.success("Chambre créée avec succès !");
      setOpen(false);
      setFormData({
        roomNumber: "",
        title: "",
        description: "",
        price: "",
        capacity: "1",
        categoryId: "",
        categoryName: "",
        bedCount: "",
        bathroomCount: "",
        size: "",
      });
      setRoomImages([]);
      onRoomAdded();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la création de la chambre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Chambre
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Ajouter une Chambre</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la nouvelle chambre
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Numéro et Titre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Numéro de chambre *</label>
              <Input
                value={formData.roomNumber}
                onChange={(e) => handleChange("roomNumber", e.target.value)}
                placeholder="ex: 101"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Titre *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="ex: Suite Deluxe"
                required
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">Catégorie *</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={handleToggleNewCategory}
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
            <Select value={formData.categoryId} onValueChange={(value) => handleChange("categoryId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showNewCategory && (
              <div className="mt-3">
                <label className="text-sm font-medium">Nouvelle catégorie</label>
                <Input
                  value={formData.categoryName}
                  onChange={(e) => handleChange("categoryName", e.target.value)}
                  placeholder="ex: Suite Familiale"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Décrivez la chambre..."
              rows={3}
            />
          </div>

          {/* Prix et Capacité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prix (par nuit) *</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="ex: 85"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Capacité (personnes) *</label>
              <Select value={formData.capacity} onValueChange={(value) => handleChange("capacity", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "personne" : "personnes"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lits et Salle de bain */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre de lits</label>
              <Input
                type="number"
                value={formData.bedCount}
                onChange={(e) => handleChange("bedCount", e.target.value)}
                placeholder="ex: 1"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Salles de bain</label>
              <Input
                type="number"
                value={formData.bathroomCount}
                onChange={(e) => handleChange("bathroomCount", e.target.value)}
                placeholder="ex: 1"
                min="1"
              />
            </div>
          </div>

          {/* Taille */}
          <div>
            <label className="text-sm font-medium">Taille (m²)</label>
            <Input
              type="number"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder="ex: 30"
              step="0.1"
            />
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium">Images de la chambre (Max 2, max 2MB chacune)</label>
            <div className="space-y-3">
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
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Création..." : "Créer la Chambre"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
