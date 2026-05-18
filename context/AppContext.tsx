"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { Hotel, Reservation, User } from "@/types/types";
import { Hotels, Reservations, Users } from "@/data/mockData";

type ModalStep = "DETAILS" | "ROOMS" | "BOOKING" | "PAYMENT" | "SUCCESS";

type PendingBooking = {
  hotelId: string | number;
  step: Exclude<ModalStep, "SUCCESS">;
  roomIndex?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

const PENDING_BOOKING_KEY = "zua-pending-booking";

interface AppContextValue {
  user: User;
  setUser: (u: User) => void;
  hotels: Hotel[];
  reservations: Reservation[];
  selectedHotel: Hotel | null;
  openHotel: (h: Hotel) => void;
  closeHotel: () => void;
  addReservation: (r: Omit<Reservation, "id" | "createdAt">) => void;
  cancelReservation: (id: string) => void;
  savePendingBooking: (pendingBooking: PendingBooking) => void;
  bookingRestore: PendingBooking | null;
  clearBookingRestore: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>(Users[0]);
  const [hotels] = useState<Hotel[]>(Hotels);
  const [reservations, setReservations] = useState<Reservation[]>(Reservations);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(
    null,
  );
  const [bookingRestore, setBookingRestore] = useState<PendingBooking | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(PENDING_BOOKING_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as PendingBooking;
      setPendingBooking(parsed);
    } catch {
      window.localStorage.removeItem(PENDING_BOOKING_KEY);
    }
  }, []);

  useEffect(() => {
    if (!session?.user || !pendingBooking || selectedHotel) return;

    const hotel = hotels.find((item) => item.id === pendingBooking.hotelId);
    if (!hotel) return;

    setSelectedHotel(hotel);
    setBookingRestore(pendingBooking);
    setPendingBooking(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PENDING_BOOKING_KEY);
    }
  }, [session?.user, pendingBooking, selectedHotel, hotels]);

  const openHotel = useCallback((h: Hotel) => setSelectedHotel(h), []);
  const closeHotel = useCallback(() => setSelectedHotel(null), []);

  const savePendingBooking = useCallback((pendingBooking: PendingBooking) => {
    setPendingBooking(pendingBooking);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        PENDING_BOOKING_KEY,
        JSON.stringify(pendingBooking),
      );
    }
  }, []);

  const clearBookingRestore = useCallback(() => {
    setBookingRestore(null);
  }, []);

  const addReservation = useCallback(
    (r: Omit<Reservation, "id" | "createdAt">) => {
      const newReservation: Reservation = {
        ...r,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      setReservations((prev) => [newReservation, ...prev]);
    },
    [],
  );

  const cancelReservation = useCallback((id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      hotels,
      reservations,
      selectedHotel,
      openHotel,
      closeHotel,
      addReservation,
      cancelReservation,
      savePendingBooking,
      bookingRestore,
      clearBookingRestore,
    }),
    [
      user,
      hotels,
      reservations,
      selectedHotel,
      openHotel,
      closeHotel,
      addReservation,
      cancelReservation,
      savePendingBooking,
      bookingRestore,
      clearBookingRestore,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
