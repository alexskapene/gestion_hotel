import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const deleteLocalImages = (urls: string[]) => {
  const uploadDir = path.join(process.cwd(), "public");
  urls.forEach((url) => {
    if (!url || !url.startsWith("/uploads/")) return;
    const filepath = path.join(uploadDir, url.replace(/^\//, ""));
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (error) {
        console.error("Failed to delete local hotel image file:", filepath, error);
      }
    }
  });
};

export class HotelService {
  /**
   * Create or update hotel details for a given owner.
   */
  static async upsertHotel(userId: string, data: any) {
    const images: string[] = Array.isArray(data.images)
      ? data.images
      : typeof data.images === "string"
      ? data.images.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const amenities: string[] = Array.isArray(data.amenities)
      ? data.amenities
      : typeof data.amenities === "string"
      ? data.amenities.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const hotelData: any = {
      ...data,
      images: undefined,
      amenities: undefined,
      slug: data.slug || (data.name ? toSlug(data.name) : `hotel-${Date.now()}`),
    };

    const existingHotel = await prisma.hotel.findFirst({
      where: { ownerId: userId },
      include: { images: true },
    });

    if (existingHotel) {
      const oldImageUrls = existingHotel.images?.map((image) => image.imageUrl) || [];
      const removedUrls = oldImageUrls.filter((url) => !images.includes(url));
      deleteLocalImages(removedUrls);

      return prisma.hotel.update({
        where: { id: existingHotel.id },
        data: {
          ...hotelData,
          images: { deleteMany: {}, create: images.map((url) => ({ imageUrl: url })) },
          amenities: amenities.length
            ? { deleteMany: {}, create: amenities.map((name) => ({ name })) }
            : { deleteMany: {} },
        },
      });
    }

    return prisma.hotel.create({
      data: {
        ownerId: userId,
        ...hotelData,
        images: images.length ? { create: images.map((url) => ({ imageUrl: url })) } : undefined,
        amenities: amenities.length ? { create: amenities.map((name) => ({ name })) } : undefined,
      },
    });
  }

  static async getHotels(filters: { city?: string; stars?: number; isActive?: boolean } = {}) {
    return prisma.hotel.findMany({
      where: {
        ...filters,
        isActive: filters.isActive ?? true,
      },
      include: {
        _count: { select: { rooms: true } },
      },
      orderBy: { averageRating: "desc" },
    });
  }

  static async getHotelById(id: string) {
    return prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: { include: { category: true } },
        roomCategories: true,
        images: true,
        amenities: true,
        subscriptions: { where: { status: "ACTIVE" }, take: 1 },
      },
    });
  }

  static async getHotelByOwner(ownerId: string) {
    return prisma.hotel.findFirst({
      where: { ownerId },
      include: {
        rooms: { include: { category: true } },
        roomCategories: true,
        images: true,
        amenities: true,
        subscriptions: { where: { status: "ACTIVE" }, take: 1 },
      },
    });
  }

  static async updateStatus(id: string, isActive: boolean) {
    return prisma.hotel.update({ where: { id }, data: { isActive } });
  }
}
