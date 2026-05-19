"use client";

import { useState } from "react";
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

interface HotelsFiltersProps {
  onSearchChange: (query: string) => void;
  onCityChange: (city: string) => void;
  onPriceRangeChange: (range: number[]) => void;
  onSortChange: (sort: string) => void;
  onAmenityToggle: (amenity: string) => void;
  selectedAmenities: string[];
  searchQuery: string;
  selectedCity: string;
  priceRange: number[];
  sortBy: string;
  cities: string[];
}

export const HotelsFilters = ({
  onSearchChange,
  onCityChange,
  onPriceRangeChange,
  onSortChange,
  onAmenityToggle,
  selectedAmenities,
  searchQuery,
  selectedCity,
  priceRange,
  sortBy,
  cities,
}: HotelsFiltersProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header & Search combined */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-2">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Nos sélections
            </h2>
            <p className="text-muted-foreground text-lg">
              Découvrez nos établissements d'exception
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
              Trier par :
            </span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48 bg-background border-border rounded-none h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mieux notés</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="reviews">Plus d'avis</SelectItem>
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
              onChange={(e) => onSearchChange(e.target.value)}
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
                    Personnalisez vos critères pour trouver le séjour parfait.
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
                    <Select value={selectedCity} onValueChange={onCityChange}>
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
                    onValueChange={onPriceRangeChange}
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
                      const active = selectedAmenities.includes(amenity.id);
                      return (
                        <label
                          key={amenity.id}
                          className={`flex items-center justify-between p-3 cursor-pointer transition border ${active ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 border-transparent hover:bg-muted/50"}`}
                        >
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={active}
                              onCheckedChange={() =>
                                onAmenityToggle(amenity.id)
                              }
                            />
                            <span className="font-medium">{amenity.label}</span>
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
