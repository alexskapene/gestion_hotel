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
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2 gap-6 p-6">
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
        </div>
      </div>
    </div>
  );
};
