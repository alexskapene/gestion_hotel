import prisma from "@/lib/prisma";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export class HotelService {
  /**
   * Create or update hotel details for a given owner.
   */
  static async upsertHotel(userId: string, data: any) {
    const hotelData: any = {
      ...data,
      slug: data.slug || (data.name ? toSlug(data.name) : `hotel-${Date.now()}`),
    };

    const existingHotel = await prisma.hotel.findFirst({
      where: { ownerId: userId },
    });

    if (existingHotel) {
      return prisma.hotel.update({
        where: { id: existingHotel.id },
        data: hotelData,
      });
    }

    return prisma.hotel.create({
      data: {
        ownerId: userId,
        ...hotelData,
      },
    });
  }

  /**
   * Get all hotels with search and filters
   */
  static async getHotels(filters: { city?: string; stars?: number; isActive?: boolean } = {}) {
    return prisma.hotel.findMany({
      where: {
        ...filters,
        isActive: filters.isActive ?? true,
      },
      include: {
        _count: {
          select: { rooms: true },
        },
      },
      orderBy: { rating: "desc" },
    });
  }

  /**
   * Get a single hotel with its rooms and categories
   */
  static async getHotelById(id: string) {
    return prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: {
          include: { category: true },
        },
        categories: true,
        abonnements: {
          where: { isActive: true },
          take: 1,
        },
      },
    });
  }

  /**
   * Update hotel status
   */
  static async updateStatus(id: string, isActive: boolean) {
    return prisma.hotel.update({
      where: { id },
      data: { isActive },
    });
  }
}
