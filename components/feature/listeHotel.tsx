"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Car,
  Coffee,
  MapPin,
  Search,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Hotels } from "@/data/mockData";
import { HotelCard } from "../HotelCard";

const cities = ["Toutes", "Nice", "Mahagi", "Aru", "Djugu", "Irumu", "Mambasa"];

// Mapping des icônes basé sur l'ID de l'équipement
const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  restaurant: <Coffee className="w-4 h-4" />,
};

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Toutes");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("rating");

  // CORRECTION : On stocke les IDs (string), pas les objets complets
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const filteredHotels = Hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === "Toutes" || hotel.city === selectedCity;

    const matchesPrice =
      hotel.price >= priceRange[0] && hotel.price <= priceRange[1];

    // CORRECTION : Vérification si l'hôtel possède TOUS les équipements sélectionnés
    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((id) => hotel.amenities.includes(id as any));
    // Note: 'as any' ou un cast est utilisé ici selon si hotel.amenities est string[] ou Amenity[]

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto px-4 md:px-6 container">
            <div className="space-y-4 mx-auto max-w-2xl text-center">
              <h1 className="font-serif font-bold text-foreground text-3xl md:text-4xl">
                Trouvez Votre Hôtel Idéal
              </h1>
              <p className="text-muted-foreground">
                Explorez notre sélection d&apos;hôtels dans toute la province de
                l&apos;Ituri
              </p>

              <div className="flex sm:flex-row flex-col justify-center items-center gap-3 mt-6">
                <div className="relative flex-1 w-full">
                  <Search className="top-1/2 left-4 absolute w-5 h-5 text-muted-foreground -translate-y-1/2" />
                  <Input
                    placeholder="Rechercher un hôtel..."
                    className="pl-12 rounded-full h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="relative pl-12 rounded-full w-full sm:w-50 h-12">
                    <MapPin className="top-1/2 left-4 absolute w-5 h-5 text-muted-foreground -translate-y-1/2" />
                    <SelectValue />
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
          </div>
        </section>

        {/* Hotels List */}
        <section className="py-8 md:py-12">
          <div className="mx-auto px-4 md:px-6 container">
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {filteredHotels.length}
                </span>{" "}
                hôtels trouvés
              </p>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="rounded-full w-44">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="reviews">Plus d&apos;avis</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      <SlidersHorizontal className="mr-2 w-4 h-4" />
                      Filtres
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col p-0 h-full">
                    <div className="space-y-2 px-6 py-5 border-b">
                      <SheetHeader>
                        <SheetTitle className="font-semibold text-xl">
                          Filtres
                        </SheetTitle>
                        <SheetDescription>
                          Personnalisez votre recherche
                        </SheetDescription>
                      </SheetHeader>
                      <p className="font-bold text-primary text-xl">
                        {filteredHotels.length} hôtel
                        {filteredHotels.length > 1 ? "s" : ""} trouvé
                        {filteredHotels.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex-1 space-y-10 px-6 py-6 overflow-y-auto">
                      {/* Budget Slider */}
                      <div className="space-y-5">
                        <div>
                          <h4 className="font-semibold text-base">Budget</h4>
                          <p className="text-muted-foreground text-sm">
                            ${priceRange[0]} — ${priceRange[1]} / nuit
                          </p>
                        </div>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={500}
                          step={10}
                        />
                      </div>

                      {/* Amenities Checkboxes */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-base">Équipements</h4>
                        <div className="space-y-3">
                          {[
                            { id: "wifi", label: "WiFi" },
                            { id: "parking", label: "Parking" },
                            { id: "restaurant", label: "Restaurant" },
                          ].map((amenity) => {
                            const active = selectedAmenities.includes(
                              amenity.id,
                            );
                            return (
                              <label
                                key={amenity.id}
                                className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition ${active ? "bg-muted/60" : "hover:bg-muted/40"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={active}
                                    onCheckedChange={() =>
                                      toggleAmenity(amenity.id)
                                    }
                                  />
                                  <span className="text-sm">
                                    {amenity.label}
                                  </span>
                                </div>
                                {active && (
                                  <span className="font-medium text-primary text-xs">
                                    Actif
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setPriceRange([0, 150]);
                          setSelectedAmenities([]);
                        }}
                        className="text-muted-foreground hover:text-foreground text-sm text-left transition"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>

                    <div className="p-5 border-t">
                      <Button
                        className="rounded-full w-full h-12 text-base"
                        onClick={() => setOpen(false)}
                      >
                        Appliquer les filtres
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Hotels Grid */}
            {filteredHotels.length > 0 ? (
              <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={`${hotel.id}-${hotel.name}`} hotel={hotel} />
                ))}
              </div>
            ) : (
              <Card className="rounded-3xl">
                <CardContent className="py-16 text-center">
                  <Search className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                  <h3 className="mb-2 font-serif font-semibold text-xl">
                    Aucun hôtel trouvé
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCity("Toutes");
                      setPriceRange([0, 150]);
                      setSelectedAmenities([]);
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
