"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, MapPin, Star, Users, Wifi, Calendar } from "lucide-react";

export const HotelDetailModal = () => {
  const { selectedHotel, closeHotel, user, addReservation } = useApp();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (selectedHotel) {
      setActiveImage(0);
      setSelectedRoom(0);
      setBooked(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedHotel]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && closeHotel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeHotel]);

  if (!selectedHotel) return null;
  const hotel = selectedHotel;
  const room = hotel.rooms[selectedRoom];
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000,
          ),
        )
      : 0;
  const total = Math.round(room.price * nights);

  const handleBook = () => {
    if (!checkIn || !checkOut || nights <= 0) return;

    addReservation({
      hotelId: hotel.id,
      hotel: hotel.name, // ✅ FIX
      room: room.type,
      roomNumber: String(room.id),
      userId: user.id,
      userName: user.name,
      checkIn,
      checkOut,
      guests,
      price: room.price,
      acompte: 0,
      image: hotel.image[0],
      hotelPhone: "",
      hotelAddress: hotel.city,
      status: "confirmed",
    });
    setBooked(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
        onClick={closeHotel}
      />
      <div className="relative bg-card rounded-3xl shadow-[var(--shadow-elegant)] max-w-6xl w-full max-h-[92vh] overflow-y-auto">
        <button
          onClick={closeHotel}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-secondary transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Gallery */}
          <div className="p-6 lg:p-8">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3">
              <img
                src={hotel.image[activeImage]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {hotel.image.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${i === activeImage ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Map zone */}
            <div className="mt-6 relative aspect-[2/1] rounded-2xl overflow-hidden border border-border bg-secondary">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, hsl(var(--accent-soft)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--accent-soft)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--accent-soft)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--accent-soft)) 75%)",
                  backgroundSize: "30px 30px",
                  backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-[var(--shadow-gold)] animate-pulse">
                    <MapPin className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </div>
              <button className="absolute bottom-3 right-3 btn-ghost text-xs px-3 py-1.5 bg-background/95 backdrop-blur">
                Voir sur la carte
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 lg:p-8 lg:pl-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" /> {hotel.city}
            </div>
            <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-3">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-semibold">{hotel.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({hotel.reviews} avis)
                </span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {hotel.description}
            </p>

            <div className="mb-6">
              <h3 className="font-display text-lg mb-3">Équipements</h3>
              <div className="grid grid-cols-2 gap-2">
                {hotel.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Wifi className="w-4 h-4 text-accent" /> {a}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-display text-lg mb-3">Choisir une chambre</h3>
              <div className="space-y-2">
                {hotel.rooms.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoom(i)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${i === selectedRoom ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
                  >
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {r.capacity} pers ·{" "}
                        {r.available} dispo
                      </p>
                    </div>
                    <p className="font-display text-lg">
                      {Math.round(r.price)}$
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking */}
            <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
              {booked ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-success" />
                  </div>
                  <p className="font-display text-xl mb-1">
                    Réservation confirmée
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Retrouvez-la dans votre dashboard.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Arrivée
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="input-luxe mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Départ
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="input-luxe mt-1"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-xs text-muted-foreground">
                      Voyageurs
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={room.capacity}
                      value={guests}
                      onChange={(e) => setGuests(+e.target.value)}
                      className="input-luxe mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-3 pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      {nights} nuit{nights > 1 ? "s" : ""}
                    </span>
                    <span className="font-display text-2xl">{total}€</span>
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={!nights}
                    className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Réserver maintenant
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
