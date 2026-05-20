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
    // Extract relational arrays (images, amenities) if provided
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

    // Prepare scalar hotel data
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
          // replace images and amenities by clearing and recreating
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
      orderBy: { averageRating: "desc" },
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
        roomCategories: true,
        images: true,
        amenities: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });
  }

  /**
   * Get a hotel by its owner user id
   */
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
