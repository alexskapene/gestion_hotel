import prisma from "@/lib/prisma";

export class ClientHotelService {
  /**
   * Récupérer les hôtels visités par le client
   */
  static async getVisitedHotels(userId: string) {
    const hotels = await prisma.hotel.findMany({
      where: {
        rooms: {
          some: {
            reservations: {
              some: {
                userId,
              },
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return hotels;
  }

  /**
   * Compter le nombre d'hôtels visités
   */
  static async countVisitedHotels(userId: string) {
    return prisma.hotel.count({
      where: {
        rooms: {
          some: {
            reservations: {
              some: {
                userId,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Récupérer les avis du client pour les hôtels
   */
  static async getClientReviews(userId: string) {
    return prisma.review.findMany({
      where: { userId },
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
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Obtenir les détails d'un hôtel avec les avis du client
   */
  static async getHotelWithClientReview(hotelId: string, userId: string) {
    return prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        amenities: true,
        images: true,
        reviews: {
          where: { userId },
          take: 1,
        },
        _count: {
          select: {
            rooms: true,
            reviews: true,
          },
        },
      },
    });
  }

  /**
   * Récupérer les avis récents de tous les hôtels
   */
  static async getRecentReviews(userId: string, limit: number = 5) {
    return prisma.review.findMany({
      where: { userId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
