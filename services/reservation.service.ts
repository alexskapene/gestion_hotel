import prisma from "@/lib/prisma";
import { BookingStatus, RoomStatus } from "@prisma/client";

export class ReservationService {
  /**
   * Create a reservation and reserve the room immediately to prevent double booking
   */
  static async createReservation(data: {
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    roomId: string;
    clientId?: string;
    visiteurId?: string;
    acompte?: number;
    guests?: number;
  }) {
    if (data.checkOut <= data.checkIn) {
      throw new Error(
        "La date de départ doit être postérieure à la date d'arrivée.",
      );
    }

    return prisma.$transaction(async (tx) => {
      const room = await tx.chambre.findUnique({
        where: { id: data.roomId },
      });

      if (!room || room.status !== RoomStatus.AVAILABLE) {
        throw new Error("La chambre n'est pas disponible.");
      }

      const overlap = await tx.reservation.findFirst({
        where: {
          roomId: data.roomId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          AND: [
            { checkIn: { lte: data.checkOut } },
            { checkOut: { gte: data.checkIn } },
          ],
        },
      });

      if (overlap) {
        throw new Error("Cette chambre est déjà réservée pour ces dates.");
      }

      const reservation = await tx.reservation.create({
        data: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          totalPrice: data.totalPrice,
          guests: data.guests ?? 1,
          acompte: data.acompte ?? 0,
          status: BookingStatus.PENDING,
          roomId: data.roomId,
          clientId: data.clientId,
          visiteurId: data.visiteurId,
        },
      });

      await tx.chambre.update({
        where: { id: data.roomId },
        data: { status: RoomStatus.OCCUPIED },
      });

      return reservation;
    });
  }

  /**
   * Confirm reservation and update room status
   */
  static async confirmReservation(id: string) {
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
        include: { room: true },
      });

      if (!reservation) {
        throw new Error("Réservation introuvable.");
      }

      if (reservation.status !== BookingStatus.PENDING) {
        throw new Error("La réservation ne peut pas être confirmée.");
      }

      const confirmedReservation = await tx.reservation.update({
        where: { id },
        data: { status: BookingStatus.CONFIRMED },
      });

      await tx.chambre.update({
        where: { id: reservation.roomId },
        data: { status: RoomStatus.OCCUPIED },
      });

      return confirmedReservation;
    });
  }

  /**
   * Get all reservations for a hotel dashboard
   */
  static async getHotelReservations(hotelId: string) {
    return prisma.reservation.findMany({
      where: {
        room: { hotelId },
      },
      include: {
        room: true,
        client: true,
        visiteur: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Create a payment for a reservation
   */
  static async addPayment(
    reservationId: string,
    amount: number,
    method: string,
  ) {
    return prisma.payment.create({
      data: {
        reservationId,
        amount,
        method,
      },
    });
  }
}
