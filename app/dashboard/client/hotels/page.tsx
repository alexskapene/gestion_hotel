"use client";

import { useMemo, useState } from "react";
import { Hotels } from "@/data/mockData";
import { HotelCard } from "@/components/HotelCard";

export default function HotelsPage() {
  const [city, setCity] = useState("Tous");

  // filtre les Hotels
  const filteredHotels = useMemo(() => {
    if (city === "Tous") return Hotels;
    return Hotels.filter((h) => h.city === city);
  }, [city]);

  // récupérer villes uniques
  const cities = ["Tous", ...new Set(Hotels.map((h) => h.city))];

  return (
    <div className="px-4 md:px-10 py-6 overflow-x-hidden">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Hôtels disponibles</h1>
        <p className="text-muted-foreground">Trouve ton séjour parfait</p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-start items-center gap-2 mb-4">
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={` flex-1 md:flex-0  px-4 py-2 rounded-full text-sm border transition ${
              city === c ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <HotelCard key={`${hotel.id}-${hotel.name}`} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
