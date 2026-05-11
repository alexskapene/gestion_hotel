export type UserRole = "ADMIN" | "HOTEL_OWNER" | "CLIENT";

export interface User {
  id: string;
  username?: string | null;
  email: string;
  password?: string;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Room {
  id: number;
  type: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
  image: string;
  available: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  image: string[];
  amenities: string[];
  description: string;
  rooms: Room[];
  revenue: number;
  occupancy: number;
  featured: boolean;
}

export type ReservationStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled";

export interface Reservation {
  id: string;
  createdAt: string;

  userId: string;
  userName: string;

  hotelId: number;
  hotel: string;

  room: string;
  roomNumber: string;

  checkIn: string;
  checkOut: string;

  guests: number;

  status: ReservationStatus;

  price: number;
  acompte: number;

  image: string;
  hotelPhone: string;
  hotelAddress: string;
}