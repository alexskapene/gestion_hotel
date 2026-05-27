import prisma from "@/lib/prisma";
import { BookingStatus, RoomStatus } from "@prisma/client";

export class HotelDashboardService {
  /**
   * Récupérer toutes les statistiques du dashboard hôtel
   */
  static async getDashboardStats(hotelId: string) {
    const [
      totalRooms,
      availableRooms,
      totalReservations,
      currentMonthReservations,
      monthlyRevenue,
      recentReservations,
      roomOccupancy,
      occupancyRate,
    ] = await Promise.all([
      this.countTotalRooms(hotelId),
      this.countAvailableRooms(hotelId),
      this.countTotalReservations(hotelId),
      this.countCurrentMonthReservations(hotelId),
      this.calculateMonthlyRevenue(hotelId),
      this.getRecentReservations(hotelId, 5),
      this.getRoomOccupancyByType(hotelId),
      this.calculateOccupancyRate(hotelId),
    ]);

    return {
      totalRooms,
      availableRooms,
      occupiedRooms: totalRooms - availableRooms,
      totalReservations,
      currentMonthReservations,
      monthlyRevenue,
      occupancyRate,
      recentReservations,
      roomOccupancy,
    };
  }

  /**
   * Compter le nombre total de chambres
   */
  static async countTotalRooms(hotelId: string) {
    return prisma.room.count({
      where: { hotelId },
    });
  }

  /**
   * Compter les chambres disponibles
   */
  static async countAvailableRooms(hotelId: string) {
    return prisma.room.count({
      where: {
        hotelId,
        status: RoomStatus.AVAILABLE,
      },
    });
  }

  /**
   * Compter le total des réservations
   */
  static async countTotalReservations(hotelId: string) {
    return prisma.reservation.count({
      where: {
        room: {
          hotelId,
        },
      },
    });
  }

  /**
   * Compter les réservations du mois actuel
   */
  static async countCurrentMonthReservations(hotelId: string) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return prisma.reservation.count({
      where: {
        room: {
          hotelId,
        },
        checkIn: {
          gte: firstDay,
          lte: lastDay,
        },
      },
    });
  }

  /**
   * Calculer les revenus du mois actuel
   */
  static async calculateMonthlyRevenue(hotelId: string) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await prisma.reservation.aggregate({
      where: {
        room: {
          hotelId,
        },
        checkIn: {
          gte: firstDay,
          lte: lastDay,
        },
        status: BookingStatus.COMPLETED,
      },
      _sum: {
        totalPrice: true,
      },
    });

    return result._sum.totalPrice || 0;
  }

  /**
   * Calculer le taux d'occupation
   */
  static async calculateOccupancyRate(hotelId: string) {
    const totalRooms = await this.countTotalRooms(hotelId);
    if (totalRooms === 0) return 0;

    const availableRooms = await this.countAvailableRooms(hotelId);
    const occupiedRooms = totalRooms - availableRooms;

    return Math.round((occupiedRooms / totalRooms) * 100);
  }

  /**
   * Récupérer les réservations récentes
   */
  static async getRecentReservations(hotelId: string, limit: number = 5) {
    return prisma.reservation.findMany({
      where: {
        room: {
          hotelId,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            title: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Récupérer l'occupation par catégorie de chambre
   */
  static async getRoomOccupancyByType(hotelId: string) {
    const roomCategories = await prisma.roomCategory.findMany({
      where: { hotelId },
      select: {
        id: true,
        name: true,
      },
    });

    const occupancy = await Promise.all(
      roomCategories.map(async (category) => {
        const total = await prisma.room.count({
          where: {
            hotelId,
            categoryId: category.id,
          },
        });

        const occupied = await prisma.room.count({
          where: {
            hotelId,
            categoryId: category.id,
            status: RoomStatus.OCCUPIED,
          },
        });

        return {
          type: category.name,
          total,
          occupied,
        };
      })
    );

    return occupancy;
  }

  /**
   * Récupérer les statistiques de paiement
   */
  static async getPaymentStats(hotelId: string) {
    const payments = await prisma.payment.groupBy({
      by: ["status"],
      where: {
        reservation: {
          room: {
            hotelId,
          },
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
  static async getReservationsByMonth(hotelId: string, months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const reservations = await prisma.reservation.groupBy({
      by: ["checkIn"],
      where: {
        room: {
          hotelId,
        },
        checkIn: {
          gte: startDate,
        },
      },
      _count: true,
      _sum: {
        totalPrice: true,
      },
    });

    return reservations;
  }
}
