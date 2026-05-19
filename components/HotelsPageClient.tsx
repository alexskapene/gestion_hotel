"use client";

import { useState } from "react";
import { HotelCard } from "@/components/HotelCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Hotel } from "@/types/types";

const cities = ["Toutes", "Nice", "Mahagi", "Aru", "Djugu", "Irumu", "Mambasa"];

interface HotelsPageClientProps {
  hotels: Hotel[];
}

export function HotelsPageClient({ hotels }: HotelsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Toutes");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === "Toutes" || hotel.city === selectedCity;

    const matchesPrice =
      hotel.price >= priceRange[0] && hotel.price <= priceRange[1];

    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((id) => hotel.amenities.includes(id as any));

    return matchesSearch && matchesCity && matchesPrice && matchesAmenities;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden py-16 md:py-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: "url('/room.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white space-y-6">
            <h1 className="font-serif text-4xl sm:text-4xl md:text-6xl font-bold leading-[1.1] max-w-4xl mx-auto text-balance">
              Découvrez nos <span className="text-primary">établissements</span>{" "}
              d&apos;exception
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-balance leading-relaxed">
              Explorez une sélection d&apos;hôtels soigneusement choisis pour
              vous offrir confort et élégance dans toute la province de
              l&apos;Ituri.
            </p>
          </div>
        </section>

        {/* RESULTS SECTION & SEARCH */}
        <section className="py-24 container mx-auto px-6">
          <div className="flex flex-col gap-12">
            {/* Header & Search combined */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div className="space-y-2">
                  <h2 className="font-serif text-4xl md:text-5xl font-bold">
                    Nos sélections
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Découvrez{" "}
                    <span className="font-bold text-foreground">
                      {Math.min(filteredHotels.length, 8)}
                    </span>{" "}
                    établissements d&apos;exception sur les{" "}
                    {filteredHotels.length} disponibles.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                    Trier par :
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-background border-border rounded-none h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Mieux notés</SelectItem>
                      <SelectItem value="price-low">Prix croissant</SelectItem>
                      <SelectItem value="price-high">
                        Prix décroissant
                      </SelectItem>
                      <SelectItem value="reviews">Plus d&apos;avis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="bg-white border border-border p-3 flex items-center gap-3 max-w-4xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un hôtel, une destination..."
                    className="pl-12 bg-transparent border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-0 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="h-8 w-px bg-border hidden md:block" />

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-12 px-6 flex items-center gap-2 hover:bg-muted font-semibold"
                    >
                      <SlidersHorizontal className="w-5 h-5 text-primary" />
                      <span className="hidden sm:inline hover:text-primary">
                        Filtres
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col p-0 h-full bg-background border-l border-border w-full sm:max-w-md">
                    <div className="space-y-2 px-6 py-2 border-b border-border">
                      <SheetHeader>
                        <SheetTitle className="font-serif text-2xl">
                          Affiner la recherche
                        </SheetTitle>
                        <SheetDescription>
                          Personnalisez vos critères pour trouver le séjour
                          parfait.
                        </SheetDescription>
                      </SheetHeader>
                    </div>

                    <div className="flex-1 space-y-12 px-8 py-2 overflow-y-auto">
                      {/* Destination / Ville */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
                          Destination
                        </h4>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <Select
                            value={selectedCity}
                            onValueChange={setSelectedCity}
                          >
                            <SelectTrigger className="pl-10 bg-muted/50 border-border h-14 focus:ring-primary">
                              <SelectValue placeholder="Choisir une ville" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Budget par nuit
                          </h4>
                          <span className="text-lg font-bold">
                            ${priceRange[0]} — ${priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={500}
                          step={10}
                          className="py-4"
                        />
                      </div>

                      {/* Amenities */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
                          Équipements
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: "wifi", label: "WiFi Haut débit" },
                            { id: "parking", label: "Parking Sécurisé" },
                            { id: "restaurant", label: "Restauration" },
                          ].map((amenity) => {
                            const active = selectedAmenities.includes(
                              amenity.id,
                            );
                            return (
                              <label
                                key={amenity.id}
                                className={`flex items-center justify-between p-3 cursor-pointer transition border ${active ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 border-transparent hover:bg-muted/50"}`}
                              >
                                <div className="flex items-center gap-4">
                                  <Checkbox
                                    checked={active}
                                    onCheckedChange={() =>
                                      toggleAmenity(amenity.id)
                                    }
                                  />
                                  <span className="font-medium">
                                    {amenity.label}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="px-8 py-4 border-t border-border bg-muted/20">
                      <Button
                        className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/80 text-lg font-bold"
                        onClick={() => setOpen(false)}
                      >
                        Voir les résultats
                      </Button>
                      <button
                        onClick={() => {
                          setPriceRange([0, 500]);
                          setSelectedAmenities([]);
                          setSelectedCity("Toutes");
                        }}
                        className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition underline underline-offset-4"
                      >
                        Réinitialiser tous les filtres
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Grid Limited to 8 results */}
            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredHotels.slice(0, 8).map((hotel) => (
                  <HotelCard key={`${hotel.id}-${hotel.name}`} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 border border-borderl p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-muted flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Nous n&apos;avons trouvé aucun établissement correspondant à
                    vos critères actuels. Essayez d&apos;élargir votre
                    recherche.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/ px-8"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("Toutes");
                    setPriceRange([0, 500]);
                    setSelectedAmenities([]);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
