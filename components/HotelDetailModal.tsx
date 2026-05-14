"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useSession } from "next-auth/react";
import {
  X,
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv2Icon,
  Phone,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ModalStep = "DETAILS" | "ROOMS" | "BOOKING" | "PAYMENT" | "SUCCESS";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  restaurant: <Coffee className="w-3 h-3" />,
  tv: <Tv2Icon className="w-3 h-3" />,
  ac: <Phone className="w-3 h-3" />,
};

export const HotelDetailModal = () => {
  const { selectedHotel, closeHotel, user, addReservation } = useApp();
  const [step, setStep] = useState<ModalStep>("DETAILS");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (selectedHotel) {
      setActiveImage(0);
      setSelectedRoom(0);
      setStep("DETAILS");

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedHotel]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeHotel();
      }
    };

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

  const handleReserve = () => {
    // session loading
    if (status === "loading") return;

    // utilisateur non connecté
    if (!session) {
      const callbackUrl = encodeURIComponent(window.location.pathname);

      window.location.href = `/auth/login?callbackUrl=${callbackUrl}`;

      return;
    }

    // utilisateur connecté
    setStep("ROOMS");
  };

  const handleBook = () => {
    if (!session) {
      window.location.href = "/auth/login";

      return;
    }

    if (!checkIn || !checkOut || nights <= 0) return;

    addReservation({
      hotelId: hotel.id,
      hotel: hotel.name,
      room: room.type,
      roomNumber: String(room.id),
      userId: (session.user as any).id,
      userName: session.user?.name || "",
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

    setStep("SUCCESS");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-20 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
        {/* CLOSE BUTTON */}
        <Button
          onClick={closeHotel}
          variant="destructive"
          size="icon"
          className="fixed top-4 right-4 rounded-full z-50"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* CONTENT */}
        <div className="p-6 space-y-8">
          {/* STEP INDICATOR */}
          {step !== "SUCCESS" && (
            <div className="flex items-center justify-center gap-4">
              {["DETAILS", "ROOMS", "BOOKING", "PAYMENT"].map((s, i) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 ${
                    step === s ? "text-black" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold ${
                      step === s
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <span className="hidden lg:block text-sm font-medium">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ========================= */}
          {/* DETAILS */}
          {/* ========================= */}

          {step === "DETAILS" && (
            <>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* MAIN IMAGE */}
                <div className="lg:flex-3 overflow-hidden">
                  <img
                    src={hotel.image[activeImage]}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* GALLERY */}
                <div className="lg:flex-1 overflow-x-scroll">
                  <div className="flex lg:flex-col gap-4">
                    {hotel.image.slice(1).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        onClick={() => setActiveImage(i + 1)}
                        className="object-cover w-[30%] lg:w-full h-full cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div>
                <h2 className="text-4xl font-bold mb-4">{hotel.name}</h2>

                <div className="flex items-center justify-between gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.city}
                  </span>

                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {hotel.rating} ({hotel.reviews})
                  </span>
                </div>

                {/* AMENITIES */}
                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                  {hotel.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-2">
                      {amenityIcons[a]}
                      {a}
                    </div>
                  ))}
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 leading-relaxed">
                  {hotel.description}
                </p>
              </div>
            </>
          )}

          {/* ========================= */}
          {/* ROOMS */}
          {/* ========================= */}

          {step === "ROOMS" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold">Choisissez une chambre</h2>

                <p className="text-gray-500 mt-2">
                  Sélectionnez la chambre idéale pour votre séjour
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotel.rooms.map((r: any, i: number) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoom(i)}
                    className={`border cursor-pointer transition overflow-hidden ${
                      i === selectedRoom
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <img src={r.image} className="w-full h-60 object-cover" />

                    <div className="p-4 space-y-3">
                      <h3 className="text-2xl font-semibold">{r.type}</h3>

                      <div className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        {r.capacity} personnes
                      </div>

                      <p className="text-3xl font-bold">
                        ${r.price}
                        <span className="text-sm text-gray-500">/nuit</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* BOOKING */}
          {/* ========================= */}

          {step === "BOOKING" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold">Informations réservation</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FORM */}
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Check-in</label>

                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full border p-4 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Check-out</label>

                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border p-4 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Invités</label>

                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full border p-4 outline-none"
                    />
                  </div>
                </div>

                {/* SUMMARY */}
                <div className="border bg-gray-50 p-6">
                  <h3 className="text-2xl font-semibold mb-6">Résumé</h3>

                  <div className="space-y-3">
                    <p>
                      Hôtel : <strong>{hotel.name}</strong>
                    </p>

                    <p>
                      Chambre : <strong>{room.type}</strong>
                    </p>

                    <p>
                      Nombre de nuits : <strong>{nights}</strong>
                    </p>

                    <p className="text-4xl font-bold pt-6">${total}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* PAYMENT */}
          {/* ========================= */}

          {step === "PAYMENT" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold">Paiement</h2>

                <p className="text-gray-500 mt-2">
                  Vérifiez les informations avant confirmation
                </p>
              </div>

              <div className="border p-8 bg-gray-50 space-y-4">
                <p>
                  Hôtel : <strong>{hotel.name}</strong>
                </p>

                <p>
                  Chambre : <strong>{room.type}</strong>
                </p>

                <p>
                  Invités : <strong>{guests}</strong>
                </p>

                <p>
                  Séjour : <strong>{nights} nuits</strong>
                </p>

                <div className="pt-4 border-t">
                  <p className="text-4xl font-bold">${total}</p>
                </div>
              </div>

              <Button onClick={handleBook} className="w-full h-14 text-lg">
                Confirmer et payer
              </Button>
            </div>
          )}

          {/* ========================= */}
          {/* SUCCESS */}
          {/* ========================= */}

          {step === "SUCCESS" && (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-5xl font-bold mb-4">Réservation confirmée</h2>

              <p className="text-gray-500 max-w-md mb-8">
                Votre réservation a été enregistrée avec succès.
              </p>

              <Button onClick={closeHotel}>Fermer</Button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {step !== "SUCCESS" && (
          <div className="flex items-center justify-between px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => {
                if (step === "ROOMS") setStep("DETAILS");

                if (step === "BOOKING") setStep("ROOMS");

                if (step === "PAYMENT") setStep("BOOKING");
              }}
            >
              Retour
            </Button>

            <div className="flex gap-4">
              <Button variant="destructive" onClick={closeHotel}>
                Annuler
              </Button>

              {step === "DETAILS" && (
                <Button onClick={handleReserve} disabled={status === "loading"}>
                  {status === "loading" ? "Chargement..." : "Réserver"}
                </Button>
              )}

              {step === "ROOMS" && (
                <Button onClick={() => setStep("BOOKING")}>Continuer</Button>
              )}

              {step === "BOOKING" && (
                <Button
                  disabled={!checkIn || !checkOut || nights <= 0}
                  onClick={() => setStep("PAYMENT")}
                >
                  Paiement
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
