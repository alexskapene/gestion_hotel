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
  Lock,
  ArrowLeft,
  ChevronLeft,
  CreditCard,
  Smartphone,
} from "lucide-react";
import PayPal from "@/assets/paypal-3.svg";
import Orange from "@/assets/Orange_Money-Logo.wine.svg";
import Airtel from "@/assets/Airtel_Networks_Limited-Logo.wine.svg";
import Vodacom from "@/assets/Vodacom-Logo.wine.svg";

import { Button } from "@/components/ui/button";
import Image from "next/image";
type ModalStep = "DETAILS" | "ROOMS" | "BOOKING" | "PAYMENT" | "SUCCESS";

type PendingBooking = {
  hotelId: string | number;
  step: Exclude<ModalStep, "SUCCESS">;
  roomIndex?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  restaurant: <Coffee className="w-3 h-3" />,
  tv: <Tv2Icon className="w-3 h-3" />,
  ac: <Phone className="w-3 h-3" />,
};

const stepLabels: Record<Exclude<ModalStep, "SUCCESS">, string> = {
  DETAILS: "Détails",
  ROOMS: "Chambres",
  BOOKING: "Réservation",
  PAYMENT: "Paiement",
};

export const HotelDetailModal = () => {
  const {
    selectedHotel,
    closeHotel,
    addReservation,
    savePendingBooking,
    bookingRestore,
    clearBookingRestore,
  } = useApp();

  const [step, setStep] = useState<ModalStep>("DETAILS");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "paypal" | "airtel" | "orange" | "mpesa"
  >("paypal");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [payerName, setPayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoadingSession = status === "loading";

  useEffect(() => {
    if (selectedHotel) {
      setActiveImage(0);
      const roomsLength = selectedHotel.rooms?.length ?? 0;
      setSelectedRoom(
        roomsLength > 0
          ? Math.min(bookingRestore?.roomIndex ?? 0, roomsLength - 1)
          : 0,
      );
      setCheckIn(bookingRestore?.checkIn ?? "");
      setCheckOut(bookingRestore?.checkOut ?? "");
      setGuests(bookingRestore?.guests ?? 2);
      setStep(bookingRestore?.step ?? "DETAILS");
      clearBookingRestore();

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedHotel, bookingRestore, clearBookingRestore]);

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
  const rooms = hotel.rooms ?? [];
  const room = rooms.length > 0 ? rooms[selectedRoom] ?? rooms[0] : null;
  const roomAvailable = room ? room.available !== false : false;

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

  const total = room ? Math.round(room.price * nights) : 0;

  const redirectToLogin = () => {
    const callbackUrl = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    window.location.href = `/auth/login?callbackUrl=${callbackUrl}`;
  };

  const saveBookingState = (step: Exclude<ModalStep, "SUCCESS">) => {
    if (!selectedHotel) return;

    savePendingBooking({
      hotelId: selectedHotel.id,
      step,
      roomIndex: selectedRoom,
      checkIn,
      checkOut,
      guests,
    });
  };

  const handleReserve = () => {
    if (isLoadingSession) return;

    if (!session) {
      saveBookingState("ROOMS");
      redirectToLogin();
      return;
    }

    setStep("ROOMS");
  };

  const handleRoomContinue = () => {
    if (!session) {
      saveBookingState("BOOKING");
      redirectToLogin();
      return;
    }

    setStep("BOOKING");
  };

  const handlePaymentStep = () => {
    if (!session) {
      saveBookingState("PAYMENT");
      redirectToLogin();
      return;
    }

    setStep("PAYMENT");
  };

  const handleBook = async () => {
    if (isLoadingSession) return;

    if (!session) {
      saveBookingState("PAYMENT");
      redirectToLogin();
      return;
    }

    setErrorMessage(null);

    if (!checkIn || !checkOut || nights <= 0) {
      setErrorMessage("Veuillez saisir des dates de séjour valides.");
      return;
    }

    if (!roomAvailable) {
      setErrorMessage("Cette chambre est actuellement indisponible.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!payerName.trim() || !paymentDetail.trim()) {
        setErrorMessage(
          "Veuillez saisir le nom du titulaire et les détails du paiement.",
        );
        return;
      }

      const createResponse = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: String(room.id),
          checkIn,
          checkOut,
          guests,
          totalPrice: total,
          clientId: String((session.user as any).id),
          paymentMethod,
          paymentReference: paymentDetail,
          payerName,
        }),
      });

      const createData = await createResponse.json();
      if (!createResponse.ok) {
        setErrorMessage(
          createData.error || "Impossible de créer la réservation.",
        );
        return;
      }

      const confirmResponse = await fetch(
        `/api/reservations/${createData.id}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const confirmData = await confirmResponse.json();
      if (!confirmResponse.ok) {
        setErrorMessage(
          confirmData.error || "Impossible de confirmer la réservation.",
        );
        return;
      }

      addReservation({
        hotelId: hotel.id,
        hotel: hotel.name,
        room: room?.type ?? "",
        roomNumber: String(room?.id ?? ""),
        userId: (session.user as any).id,
        userName: session.user?.name || "",
        checkIn,
        checkOut,
        guests,
        price: room?.price ?? 0,
        acompte: 0,
        image: (hotel.image ?? [])[0] ?? "",
        hotelPhone: "",
        hotelAddress: hotel.city,
        status: "confirmed",
      });

      setStep("SUCCESS");
    } catch (error) {
      setErrorMessage(
        "Une erreur est survenue lors du processus de réservation. Réessayez plus tard.",
      );
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-20 bg-foreground/20 backdrop-blur-sm">
      <div className="bg-card w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
        <Button
          onClick={closeHotel}
          variant="destructive"
          size="icon"
          className=" hidden md:flex fixed top-4 right-4 rounded-full z-50"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="p-6 space-y-8">
          {step !== "SUCCESS" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4">
                {(["DETAILS", "ROOMS", "BOOKING", "PAYMENT"] as const).map(
                  (s, i) => {
                    const locked = !isAuthenticated && s !== "DETAILS";
                    return (
                      <div
                        key={s}
                        className={`flex flex-col items-center gap-2 ${
                          step === s
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold ${
                            step === s
                              ? "bg-foreground text-background border-foreground"
                              : "border-border"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span className="hidden lg:block text-sm font-medium">
                          {stepLabels[s]}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {step === "DETAILS" && (
            <>
              <div className="flex flex-col max-h-[520px] lg:flex-row gap-6">
                <div className=" lg:flex-3 overflow-hidden">
                  <img
                    src={(hotel.image ?? [])[activeImage] ?? ""}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:flex-1 overflow-x-scroll">
                  <div className="flex lg:flex-col gap-4">
                    {(hotel.image ?? []).slice(1).map((img, i) => (
                      <div
                        key={i}
                        className="w-[32%] h-full lg:w-full lg:h-[80%]"
                      >
                        <img
                          src={img}
                          onClick={() => setActiveImage(i + 1)}
                          className={`object-cover w-full h-full ${activeImage === i + 1 ? "opacity-50" : "opacity-100"} cursor-pointer hover:opacity-80 transition`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold mb-2">{hotel.name}</h2>

                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.city}
                  </span>

                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {hotel.rating} ({hotel.reviews})
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 mb-4 text-sm">
                  {hotel.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-2">
                      {amenityIcons[a]}
                      {a}
                    </div>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description}
                </p>
              </div>
            </>
          )}

          {step === "ROOMS" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-extrabold">
                  Choisissez une chambre
                </h2>
                <p className="text-muted-foreground mt-2">
                  Sélectionnez la chambre idéale pour votre séjour.
                </p>
              </div>

              {rooms.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  Aucune chambre disponible pour cet hôtel.
                </p>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((r: any, i: number) => {
                  const available = r.available !== false;
                  const active = i === selectedRoom;
                  return (
                    <div
                      key={r.id}
                      role="button"
                      onClick={() => available && setSelectedRoom(i)}
                      className={`border-2 transition overflow-hidden p-2 ${
                        active
                          ? "border-foreground"
                          : "border-border hover:border-foreground/40"
                      } ${available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                    >
                      <img
                        src={r.image}
                        className="w-full h-60 object-cover"
                        alt={r.type}
                      />

                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-semibold">{r.type}</h3>
                          {!available && (
                            <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                              Indisponible
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {r.capacity} personnes
                        </div>

                        <p className="text-3xl font-bold">
                          ${r.price}
                          <span className="text-sm text-muted-foreground">
                            /nuit
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {step === "BOOKING" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold">Informations réservation</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">
                      Date d'entrée
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full border p-4 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Date de sortie
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border p-4 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Nombre de personnes
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full border p-4 outline-none"
                    />
                  </div>
                </div>

                <div className="border border-border bg-muted/50 p-6">
                  <h3 className="text-2xl font-semibold mb-6">Résumé</h3>

                  <table>
                    <tbody className="divide-y">
                      <tr>
                        <td scope="row" className="py-3 ">
                          Hotel
                        </td>
                        <td className="pl-12 font-bold">{hotel.name}</td>
                      </tr>
                      <tr>
                        <td scope="row" className="py-3">
                          Chambre
                        </td>
                        <td className="pl-12 font-bold">{room?.type ?? "-"}</td>
                      </tr>
                      <tr>
                        <td scope="row" className="py-3">
                          Nombre de nuits
                        </td>
                        <td className="pl-12 font-bold">{nights}</td>
                      </tr>
                      <tr>
                        <td scope="row" className="py-3">
                          Prix par nuit
                        </td>
                        <td className="pl-12 font-bold">${room?.price ?? 0}</td>
                      </tr>
                      <tr>
                        <td scope="row" className="py-3">
                          Prix total
                        </td>
                        <td className="pl-12 font-bold">${total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === "PAYMENT" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold">Paiement</h2>
                <p className="text-muted-foreground mt-2">
                  Choisissez un mode de paiement et confirmez votre réservation.
                </p>
              </div>

              <div className="md:w-1/2 mx-auto">
                <div className="space-y-6 border border-border  p-8">
                  <div className="flex gap-4">
                    {[
                      {
                        id: "airtel",
                        label: "Airtel Money",
                        icon: Airtel,
                      },

                      {
                        id: "orange",
                        label: "Orange Money",
                        icon: Orange,
                      },

                      {
                        id: "mpesa",
                        label: "MPesa",
                        icon: Vodacom,
                      },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="w-[30%] h-12 flex items-center justitfy-center  gap-2 cursor-pointer "
                      >
                        {/* radio */}
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id as any)}
                          className=" appearance-none w-5 h-5 rounded-full border border-foreground/15 relative p-2 after:content-[''] after:absolute after:inset-[4px] after:rounded-full after:bg-secondary after:scale-0 checked:after:scale-100  transition-all"
                        />
                        <div
                          className={`w-full h-full border ${paymentMethod === method.id ? "border-secondary" : "border-foreground/15"} transition-all `}
                        >
                          <Image
                            src={method.icon}
                            alt={method.label}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-foreground">
                        Nom du titulaire
                      </label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="Nom complet"
                        className="w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-foreground"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-foreground">
                        {paymentMethod === "paypal"
                          ? "Adresse email PayPal"
                          : "Numéro de téléphone mobile"}
                      </label>
                      <input
                        type="text"
                        value={paymentDetail}
                        onChange={(e) => setPaymentDetail(e.target.value)}
                        placeholder={
                          paymentMethod === "paypal"
                            ? "email@example.com"
                            : "+243 000 000 000"
                        }
                        className="w-full  border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-center leading-6 text-muted-foreground">
                    Votre réservation sera enregistrée une fois le paiement
                    simulé validé.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={handleBook}
                  disabled={isSubmitting}
                  className="w-full md:w-1/2 h-14 text-lg m-auto"
                >
                  {isSubmitting ? "Validation..." : "Confirmer et payer"}
                </Button>
              </div>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Check className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-5xl font-bold mb-4">Réservation confirmée</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Votre réservation a été enregistrée avec succès.
              </p>
              <Button onClick={closeHotel}>Fermer</Button>
            </div>
          )}
        </div>

        {step !== "SUCCESS" && (
          <div className="flex gap-4 justify-between px-6 pb-6">
            <div
              onClick={() => {
                if (step === "DETAILS") setStep("DETAILS");
                if (step === "ROOMS") setStep("DETAILS");
                if (step === "BOOKING") setStep("ROOMS");
                if (step === "PAYMENT") setStep("BOOKING");
              }}
              className={`absolute top-8 left-5 md:hidden ${step === "DETAILS" ? "hidden" : ""}`}
            >
              <ChevronLeft className="text-secondary hover:text-secondary/75 hover:bg-muted w-7 h-7 transition-colors rounded-sm" />
            </div>
            <Button
              variant={"outline"}
              onClick={() => {
                if (step === "ROOMS") setStep("DETAILS");
                if (step === "BOOKING") setStep("ROOMS");
                if (step === "PAYMENT") setStep("BOOKING");
              }}
              className="hidden md:flex gap-2 hover:gap-4"
            >
              <ArrowLeft /> Retour
            </Button>
            <div className=" w-full md:w-auto flex justify-end gap-4">
              <Button variant="destructive" onClick={closeHotel}>
                Annuler
              </Button>
              {step === "DETAILS" && (
                <Button
                  variant={"default"}
                  size={"default"}
                  onClick={handleReserve}
                  disabled={isLoadingSession}
                >
                  {isLoadingSession ? "Chargement..." : "Réserver"}
                </Button>
              )}
              {step === "ROOMS" && (
                <Button onClick={handleRoomContinue} disabled={!roomAvailable}>
                  Continuer
                </Button>
              )}
              {step === "BOOKING" && (
                <Button
                  disabled={
                    !checkIn || !checkOut || nights <= 0 || !roomAvailable
                  }
                  onClick={handlePaymentStep}
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
