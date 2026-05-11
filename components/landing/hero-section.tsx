"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export function HeroSection() {
  const [searchCity, setSearchCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [guests, setGuests] = useState("2");

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage: "url('/room.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center justify-center space-y-8">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance">
          Trouvez le <span className="text-primary">lieu idéal</span> pour votre
          prochain <span className="text-primary text-italic">séjour</span>.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl text-balance leading-relaxed">
          Découvrez des établissements soigneusement sélectionnés pour votre
          confort dans un cadre élégant et raffiné en Ituri.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 px-4 sm:px-0">
          <Link
            href={`/hotels?city=${searchCity}&date=${checkIn}&guests=${guests}`}
            className="w-full sm:w-auto"
          >
            <Button className="text-base h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/80 w-full transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20">
              Explorer les hôtels
            </Button>
          </Link>

          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="text-base h-14 px-8 border-white/20 w-full text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
