"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  MapPin,
  Star,
  Users,
  Wifi,
  Calendar,
  Car,
  Coffee,
  Tv2Icon,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3 " />,
  parking: <Car className="w-3 h-3 " />,
  restaurant: <Coffee className="w-3 h-3 " />,
  tv: <Tv2Icon className="w-3 h-3 " />,
  ac: <Phone className="w-3 h-3 " />,
};

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
      hotel: hotel.name,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white  w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-xl relative">
        {/* CLOSE */}
        <button
          onClick={closeHotel}
          className="fixe top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            {/* IMAGE GRID */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
                <img
                  src={hotel.image[activeImage]}
                  className="w-full h-full object-cover"
                />
              </div>

              {hotel.image.slice(1, 5).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(i + 1)}
                  className="rounded-xl object-cover w-full h-full cursor-pointer hover:opacity-80"
                />
              ))}
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-bold mb-2">{hotel.name}</h2>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hotel.city}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {hotel.rating} ({hotel.reviews})
              </span>
            </div>

            {/* TAGS */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <Badge>Minimalist</Badge>
              <Badge>Beach</Badge>
              <Badge>Luxury</Badge>
            </div>

            {/* FEATURES */}
            <div className="flex gap-6 mb-6 text-sm">
              {hotel.amenities.map((a) => (
                <div key={a} className="flex items-center gap-1">
                  {amenityIcons[a]} {a}
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {hotel.description}
            </p>

            {/* ROOMS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.rooms.map((r, i) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoom(i)}
                  className={`border rounded-xl p-3 cursor-pointer transition ${
                    i === selectedRoom ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img
                    src={r.image}
                    className="rounded-lg mb-2 w-full h-32 object-cover"
                  />

                  <p className="font-semibold text-sm">{r.type}</p>

                  <p className="text-xs text-gray-500 mb-2">
                    {r.capacity} pers.
                  </p>

                  <p className="font-bold">${r.price}/nuit</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (BOOKING CARD) */}
          <div className="bg-gray-50 rounded-2xl p-5 h-fit border relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                ${room.price}
                <span className="text-sm text-gray-500"> / nuit</span>
              </h3>
              <Badge>10% Off</Badge>
            </div>

            {/* DATES */}
            <div className="mb-3">
              <label className="text-xs">Check In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs">Check Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* GUESTS */}
            <div className="mb-4">
              <label className="text-xs">Guests</label>
              <input
                type="number"
                min={1}
                max={room.capacity}
                value={guests}
                onChange={(e) => setGuests(+e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* PRICE */}
            <div className="border-t pt-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span>{nights} nights</span>
                <span>${room.price * nights}</span>
              </div>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>${total}</span>
            </div>

            {/* BUTTON */}
            <Button
              onClick={handleBook}
              disabled={!nights}
              variant={"default"}
              size={"default"}
              className="w-full disabled:opacity-60"
            >
              Réserver
            </Button>

            {/* SUCCESS */}
            {booked && (
              <div className="absolute top-0 left-0 flex flex-col w-full h-auto md:w-1/4 bg-card border justify-center items-center p-12 gap-4 z-50">
                <div className="flex justify-center items-center w-24 h-24 rounded-full bg-primary text-4xl transition ease-in-out">
                  😁
                </div>
                <p className="font-black text-2xl text-center mt-3">
                  Réservation confirmée
                </p>

                <Button variant={"default"} size={"lg"}>
                  Continuer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
