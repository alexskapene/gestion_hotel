"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Hotel, Reservation, User } from "@/types/types";
import { Hotels, Reservations, Users } from "@/data/mockData";

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
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(Users[0]);
  const [hotels] = useState<Hotel[]>(Hotels);
  const [reservations, setReservations] = useState<Reservation[]>(Reservations);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const openHotel = useCallback((h: Hotel) => setSelectedHotel(h), []);
  const closeHotel = useCallback(() => setSelectedHotel(null), []);

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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
