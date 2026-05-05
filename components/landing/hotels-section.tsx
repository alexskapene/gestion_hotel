"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Coffee, MapPin, Star, Wifi } from "lucide-react";
import Link from "next/link";
import { Hotels } from "@/data/mockData";
import { HotelCard } from "../HotelCard";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  restaurant: <Coffee className="w-3 h-3" />,
};

export function HotelsSection() {
  return (
    <section className="pb-12 pt-28 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
            Prêt à trouver votre prochain séjour idéal ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Rejoignez notre plateforme et accédez à des centaines d’hôtels
            soigneusement sélectionnés pour votre confort.
          </p>
        </div>
        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Hotels.slice(0, 8).map((hotel) => (
            <HotelCard key={`${hotel.id} - ${hotel.name}`} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
}
