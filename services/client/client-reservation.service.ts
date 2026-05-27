import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export class ClientReservationService {
  /**
   * Récupérer toutes les réservations du client avec filtrage
   */
  static async getClientReservations(
    userId: string,
    params: { status?: BookingStatus; search?: string } = {}
  ) {
    const { status, search } = params;

    return prisma.reservation.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(search && {
            OR: [
            { id: { contains: search } },
            { room: { title: { contains: search } } },
            { room: { hotel: { name: { contains: search } } } },
            { room: { hotel: { city: { contains: search } } } },
          ],
        }),
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                city: true,
                address: true,
                phone: true,
                logo: true,
                coverImage: true,
              },
            },
            images: {
              take: 1,
            },
          },
        },
        payments: true,
      },
      orderBy: { checkIn: "desc" },
    });
  }

  /**
   * Récupérer les réservations actives/confirmées du client
   */
  static async getActiveReservations(userId: string) {
    return prisma.reservation.findMany({
      where: {
        userId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                city: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { checkIn: "asc" },
    });
  }

  /**
   * Récupérer les réservations passées du client
   */
  static async getPastReservations(userId: string) {
    const today = new Date();
    return prisma.reservation.findMany({
      where: {
        userId,
        checkOut: { lt: today },
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy: { checkOut: "desc" },
      take: 5,
    });
  }

  /**
   * Historique des séjours passés (réservations terminées ou passées)
   */
  static async getReservationHistory(
    userId: string,
    params: { status?: BookingStatus } = {}
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.reservation.findMany({
      where: {
        userId,
        ...(params.status
          ? { status: params.status }
          : {
              OR: [
                { checkOut: { lt: today } },
                {
                  status: {
                    in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
                  },
                },
              ],
            }),
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                city: true,
                address: true,
                phone: true,
                logo: true,
                coverImage: true,
              },
            },
            images: {
              take: 1,
            },
          },
        },
        payments: true,
      },
      orderBy: { checkOut: "desc" },
    });
  }

  /**
   * Récupérer une réservation par ID
   */
  static async getReservationById(reservationId: string, userId: string) {
    return prisma.reservation.findFirst({
      where: {
        id: reservationId,
        userId,
      },
      include: {
        room: {
          include: {
            hotel: true,
            images: true,
            amenities: true,
          },
        },
        payments: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * Compter les réservations par statut
   */
  static async countReservationsByStatus(userId: string) {
    const statuses = await prisma.reservation.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    });

    return statuses.reduce(
      (acc, item) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Calculer le nombre total de nuits réservées
   */
  static async calculateTotalNights(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    return reservations.reduce((total, res) => {
      const nights = Math.ceil(
        (new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return total + nights;
    }, 0);
  }
}
