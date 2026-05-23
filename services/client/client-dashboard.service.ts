import prisma from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export class ClientDashboardService {
  /**
   * Récupérer toutes les statistiques du dashboard client
   */
  static async getDashboardStats(userId: string) {
    const [
      activeReservations,
      totalReservations,
      totalSpent,
      visitedHotels,
      totalNights,
      recentReservations,
      upcomingReservations,
    ] = await Promise.all([
      this.countActiveReservations(userId),
      this.countTotalReservations(userId),
      this.calculateTotalSpent(userId),
      this.countVisitedHotels(userId),
      this.calculateTotalNights(userId),
      this.getRecentReservations(userId, 5),
      this.getUpcomingReservations(userId, 3),
    ]);

    return {
      activeReservations,
      totalReservations,
      totalSpent,
      visitedHotels,
      totalNights,
      recentReservations,
      upcomingReservations,
    };
  }

  /**
   * Compter les réservations actives
   */
  static async countActiveReservations(userId: string) {
    return prisma.reservation.count({
      where: {
        userId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        checkOut: { gt: new Date() },
      },
    });
  }

  /**
   * Compter le total des réservations
   */
  static async countTotalReservations(userId: string) {
    return prisma.reservation.count({
      where: { userId },
    });
  }

  /**
   * Calculer le montant total dépensé
   */
  static async calculateTotalSpent(userId: string) {
    const result = await prisma.reservation.aggregate({
      where: { userId },
      _sum: {
        totalPrice: true,
      },
    });

    return result._sum.totalPrice || 0;
  }

  /**
   * Compter les hôtels visités
   */
  static async countVisitedHotels(userId: string) {
    return prisma.hotel.count({
      where: {
        rooms: {
          some: {
            reservations: {
              some: {
                userId,
                status: BookingStatus.COMPLETED,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Calculer le nombre total de nuits
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

  /**
   * Récupérer les réservations récentes
   */
  static async getRecentReservations(userId: string, limit: number = 5) {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                city: true,
                logo: true,
                coverImage: true,
              },
            },
            images: {
              take: 1,
            },
          },
        },
      },
      orderBy: { checkIn: "desc" },
      take: limit,
    });
  }

  /**
   * Récupérer les réservations à venir
   */
  static async getUpcomingReservations(userId: string, limit: number = 3) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.reservation.findMany({
      where: {
        userId,
        checkIn: { gte: today },
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
      take: limit,
    });
  }

  /**
   * Récupérer les statistiques de paiement
   */
  static async getPaymentStats(userId: string) {
    const payments = await prisma.payment.groupBy({
      by: ["status"],
      where: {
        reservation: {
          userId,
        },
      },
      _count: true,
      _sum: {
        amount: true,
      },
    });

    return payments;
  }

  /**
   * Récupérer les statistiques de réservation par mois
   */
  static async getReservationsByMonth(userId: string, months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const reservations = await prisma.reservation.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
    });

    // Grouper par mois
    const monthlyData: Record<string, number> = {};

    reservations.forEach((res) => {
      const monthKey = new Date(res.createdAt).toLocaleString("fr-FR", {
        month: "short",
        year: "numeric",
      });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + res.totalPrice;
    });

    return Object.entries(monthlyData).map(([month, total]) => ({
      month,
      total,
    }));
  }
}
