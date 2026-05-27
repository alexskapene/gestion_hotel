import prisma from "@/lib/prisma";

export class ClientAvailableHotelsService {
  /**
   * Récupérer tous les hôtels disponibles avec leurs données
   */
  static async getAvailableHotels(search?: string) {
    return prisma.hotel.findMany({
      where: {
        isActive: true,
        isVerified: true,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { city: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
      include: {
        images: {
          take: 1,
        },
        amenities: true,
        rooms: {
          where: { isActive: true },
          select: {
            price: true,
          },
          take: 1,
          orderBy: { price: "asc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Récupérer les villes disponibles
   */
  static async getAvailableCities() {
    const cities = await prisma.hotel.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      distinct: ["city"],
      select: {
        city: true,
      },
      orderBy: { city: "asc" },
    });

    return cities.map((c) => c.city);
  }

  /**
   * Récupérer les hôtels filtrés par ville
   */
  static async getHotelsByCity(city: string) {
    return prisma.hotel.findMany({
      where: {
        isActive: true,
        isVerified: true,
        city,
      },
      include: {
        images: {
          take: 1,
        },
        amenities: true,
        rooms: {
          where: { isActive: true },
          select: {
            price: true,
          },
          take: 1,
          orderBy: { price: "asc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Récupérer un hôtel avec détails complets pour le modal
   */
  static async getHotelDetails(hotelId: string) {
    return prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        images: true,
        amenities: true,
        rooms: {
          where: { isActive: true },
          include: {
            images: {
              take: 3,
            },
            amenities: true,
            category: true,
          },
          orderBy: { price: "asc" },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });
  }

  /**
   * Calculer la moyenne des avis
   */
  static async calculateAverageRating(hotelId: string) {
    const result = await prisma.review.aggregate({
      where: { hotelId },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : 0;
  }
}
