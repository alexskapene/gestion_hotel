import prisma from "@/lib/prisma";
import { BookingStatus, RoomStatus } from "@prisma/client";

export class AdminReservationService {
  static async getAllReservations(params: { search?: string; status?: string } = {}) {
    const { search, status } = params;

    return prisma.reservation.findMany({
      where: {
        AND: [
          status ? { status: status as BookingStatus } : {},
          search
            ? {
                OR: [
                  { id: { contains: search } },
                  { room: { roomNumber: { contains: search } } },
                  { room: { title: { contains: search } } },
                  { room: { hotel: { name: { contains: search } } } },
                  { user: { username: { contains: search } } },
                  { user: { email: { contains: search } } },
                ],
              }
            : {},
        ],
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
        user: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getReservationById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
        user: true,
        payments: true,
      },
    });
  }

  static async updateReservationStatus(id: string, status: string) {
    const newStatus = status as BookingStatus;

    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.update({
        where: { id },
        data: { status: newStatus },
      });

      if (newStatus === BookingStatus.CONFIRMED) {
        await tx.room.update({
          where: { id: reservation.roomId },
          data: { status: RoomStatus.OCCUPIED },
        });
      }

      if (newStatus === BookingStatus.COMPLETED || newStatus === BookingStatus.CANCELLED) {
        await tx.room.update({
          where: { id: reservation.roomId },
          data: { status: RoomStatus.AVAILABLE },
        });
      }

      return reservation;
    });
  }

  static async deleteReservation(id: string) {
    return prisma.reservation.delete({
      where: { id },
    });
  }
}
