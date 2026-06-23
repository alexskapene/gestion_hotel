"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Upload, Image, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Hotel = {
  id?: string;
  slug?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  hotelType?: string;
  stars?: number;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  country?: string;
  city?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  cancellationPolicy?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: string[];
  amenities?: string[];
};

const HOTEL_TYPES = [
  "HOTEL",
  "MOTEL",
  "RESORT",
  "APARTMENT",
  "VILLA",
  "HOSTEL",
  "LODGE",
  "GUEST_HOUSE",
];

export default function HotelProfileForm({ initial }: { initial?: any }) {
  const router = useRouter();

  const initialImages = initial?.images ? initial.images.map((i: any) => i.imageUrl) : [];
  const initialAmenities = initial?.amenities ? initial.amenities.map((a: any) => a.name) : [];

  const [form, setForm] = useState<Hotel>({
    slug: initial?.slug || "",
    name: initial?.name || "",
    shortDescription: initial?.shortDescription || "",
    description: initial?.description || "",
    hotelType: initial?.hotelType || "HOTEL",
    stars: initial?.stars ?? 0,
    email: initial?.email || "",
    phone: initial?.phone || "",
    whatsapp: initial?.whatsapp || "",
    website: initial?.website || "",
    country: initial?.country || "",
    city: initial?.city || "",
    address: initial?.address || "",
    latitude: initial?.latitude ?? null,
    longitude: initial?.longitude ?? null,
    checkInTime: initial?.checkInTime || "",
    checkOutTime: initial?.checkOutTime || "",
    cancellationPolicy: initial?.cancellationPolicy || "",
    logo: initial?.logo || "",
    coverImage: initial?.coverImage || "",
    isFeatured: !!initial?.isFeatured,
    isActive: initial?.isActive ?? true,
    images: initialImages,
    amenities: initialAmenities,
  });

  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [imagesInput, setImagesInput] = useState(initialImages.join(", "));
  const [amenitiesInput, setAmenitiesInput] = useState(initialAmenities.join(", "));
  const [amenitiesList, setAmenitiesList] = useState<string[]>(initialAmenities);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(form.logo || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(form.coverImage || null);

  const handleChange = (k: keyof Hotel, v: any) => setForm({ ...form, [k]: v });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data && Array.isArray(data.urls) && data.urls.length > 0) {
        handleChange("logo", data.urls[0]);
        setLogoPreview(data.urls[0]);
        toast.success("Logo téléversé avec succès");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError("Erreur lors de l'upload du logo.");
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data && Array.isArray(data.urls) && data.urls.length > 0) {
        handleChange("coverImage", data.urls[0]);
        setCoverPreview(data.urls[0]);
        toast.success("Image de couverture téléversée avec succès");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError("Erreur lors de l'upload de l'image de couverture.");
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload: any = {
        ...form,
        images: imagesInput
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        amenities: amenitiesList,
      };

      const res = await fetch("/api/hotels/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const json = await res.json();
          const errMsg = json?.errors ? Object.values(json.errors).join(" ") : json?.error || "Erreur";
          setMessage(errMsg);
        } else {
          throw new Error("Failed to save");
        }
      } else {
        setMessage("Profil hôtel mis à jour.");
        router.refresh();
      }
    } catch (err) {
      setMessage("Erreur lors de la sauvegarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <div className="text-sm text-muted-foreground">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Slug (lecture seule)</label>
          <Input value={form.slug || ""} readOnly />
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <select value={form.hotelType} onChange={(e) => handleChange("hotelType", e.target.value)} className="w-full rounded-md border">
            {HOTEL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nom de l'hôtel</label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Étoiles</label>
          <Input type="number" min={0} max={5} value={String(form.stars ?? 0)} onChange={(e) => handleChange("stars", Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Courte description</label>
        <Input value={form.shortDescription} onChange={(e) => handleChange("shortDescription", e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Description complète</label>
        <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Adresse</label>
          <Input value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Ville</label>
          <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Pays</label>
          <Input value={form.country} onChange={(e) => handleChange("country", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Téléphone</label>
          <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">WhatsApp</label>
          <Input value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Site web</label>
          <Input value={form.website} onChange={(e) => handleChange("website", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Logo</label>
          <div className="space-y-2">
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary transition-colors">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Cliquez pour uploader le logo</p>
              </div>
            </label>
            {logoPreview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Image de couverture</label>
          <div className="space-y-2">
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary transition-colors">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Cliquez pour uploader l'image de couverture</p>
              </div>
            </label>
            {coverPreview && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Coordonnées (lat, lng)</label>
          <div className="flex gap-2">
            <Input value={String(form.latitude ?? "")} onChange={(e) => handleChange("latitude", e.target.value ? Number(e.target.value) : null)} />
            <Input value={String(form.longitude ?? "")} onChange={(e) => handleChange("longitude", e.target.value ? Number(e.target.value) : null)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Check-in (heure)</label>
          <Input type="time" value={form.checkInTime || ""} onChange={(e) => handleChange("checkInTime", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Check-out (heure)</label>
          <Input type="time" value={form.checkOutTime || ""} onChange={(e) => handleChange("checkOutTime", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Politique d'annulation</label>
        <Textarea value={form.cancellationPolicy || ""} onChange={(e) => handleChange("cancellationPolicy", e.target.value)} />
      </div>

      {/* Improved Image Upload Section */}
      <Card className="rounded-xl border-2 border-dashed p-6 bg-muted/30">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Galerie d'images</h3>
          </div>

          {/* File Input */}
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;
                setUploading(true);
                setUploadError(null);
                try {
                  const fd = new FormData();
                  files.forEach((f) => fd.append("files", f));
                  const res = await fetch("/api/uploads", { method: "POST", body: fd });
                  if (!res.ok) throw new Error("Upload failed");
                  const data = await res.json();
                  if (data && Array.isArray(data.urls)) {
                    const combined = [...imageUrls, ...data.urls];
                    setImageUrls(combined);
                    setImagesInput(combined.join(", "));
                    toast.success(`${data.urls.length} image(s) téléversée(s)`);
                  }
                } catch (err: any) {
                  console.error(err);
                  setUploadError("Erreur lors de l'upload des images.");
                  toast.error("Erreur lors de l'upload");
                } finally {
                  setUploading(false);
                }
              }}
              className="hidden"
            />
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">
                Cliquez pour sélectionner des images
              </p>
              <p className="text-xs text-muted-foreground">
                ou glissez-les ici (JPG, PNG, WebP)
              </p>
            </div>
          </label>

          {/* Upload Status */}
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin">⏳</div>
              Téléversement en cours…
            </div>
          )}
          {uploadError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
              <AlertCircle className="w-4 h-4" />
              {uploadError}
            </div>
          )}

          {/* Image Preview Grid */}
          {imageUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{imageUrls.length} image(s) ajoutée(s)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imageUrls.map((src, i) => (
                  <div key={i} className="relative group">
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={src}
                        alt={`preview-${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextUrls = imageUrls.filter((_, index) => index !== i);
                        setImageUrls(nextUrls);
                        setImagesInput(nextUrls.join(", "));
                      }}
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden URLs input */}
          <Input
            type="hidden"
            value={imagesInput}
            onChange={(e) => {
              const value = e.target.value;
              setImagesInput(value);
              setImageUrls(value.split(",").map((s) => s.trim()).filter(Boolean));
            }}
          />
        </div>
      </Card>

      {/* Amenities Section */}
      <Card className="rounded-xl border p-6 bg-muted/50">
        <div className="space-y-4">
          <h3 className="font-semibold">Commodités / Équipements</h3>
          <Input
            value={amenitiesInput}
            onChange={(e) => {
              const value = e.target.value;
              setAmenitiesInput(value);
              setAmenitiesList(value.split(",").map((item) => item.trim()).filter(Boolean));
            }}
            placeholder="Wifi, Parking, Climatisation, Téléviseur, Minibar... (séparés par des virgules)"
          />
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const nextAmenities = amenitiesList.filter((_, idx) => idx !== index);
                    setAmenitiesList(nextAmenities);
                    setAmenitiesInput(nextAmenities.join(", "));
                  }}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-foreground hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  {amenity}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.isFeatured} onChange={(e) => handleChange("isFeatured", e.target.checked)} />
          <span className="text-sm">À la une</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} />
          <span className="text-sm">Actif</span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
