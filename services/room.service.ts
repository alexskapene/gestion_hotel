import prisma from "@/lib/prisma";
import { RoomStatus } from "@prisma/client";

export class RoomService {
  /**
   * Add a new room to a hotel
   */
  static async createRoom(data: {
    roomNumber: string;
    title: string;
    price: number;
    capacity: number;
    hotelId: string;
    categoryId: string;
    description?: string;
    bedCount?: number;
    bathroomCount?: number;
    size?: number;
    status?: RoomStatus;
    images?: string[];
  }) {
    const { images, ...roomData } = data;

    return prisma.room.create({
      data: {
        ...roomData,
        images: images && images.length > 0
          ? { create: images.map((url) => ({ imageUrl: url })) }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        amenities: true,
      },
    });
  }

  /**
   * Get all rooms for a specific hotel
   */
  static async getRoomsByHotel(hotelId: string) {
    return prisma.room.findMany({
      where: { hotelId },
      include: {
        category: true,
        images: true,
        amenities: true,
        reservations: {
          where: {
            status: "CONFIRMED",
          },
        },
      },
      orderBy: { roomNumber: "asc" },
    });
  }

  /**
   * Get a single room
   */
  static async getRoomById(id: string) {
    return prisma.room.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        amenities: true,
        reservations: true,
      },
    });
  }

  /**
   * Update room details or status
   */
  static async updateRoom(id: string, data: any) {
    const { images, ...roomData } = data;

    // Get existing room to manage images
    const existingRoom = await prisma.room.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingRoom) {
      throw new Error("Room not found");
    }

    // Handle images update
    let imagesData: any = {};
    if (images !== undefined) {
      // Delete all existing images
      await prisma.roomImage.deleteMany({
        where: { roomId: id },
      });

      // Create new images if provided
      if (images.length > 0) {
        imagesData = {
          images: {
            create: images.map((url: string) => ({ imageUrl: url })),
          },
        };
      }
    }

    return prisma.room.update({
      where: { id },
      data: {
        ...roomData,
        ...imagesData,
      },
      include: {
        category: true,
        images: true,
        amenities: true,
      },
    });
  }

  /**
   * Delete a room
   */
  static async deleteRoom(id: string) {
    return prisma.room.delete({
      where: { id },
    });
  }

  /**
   * Get room categories for a hotel
   */
  static async getCategoriesByHotel(hotelId: string) {
    return prisma.roomCategory.findMany({
      where: { hotelId },
      include: {
        _count: {
          select: { rooms: true },
        },
      },
    });
  }

  /**
   * Create a room category
   */
  static async createCategory(hotelId: string, name: string, description?: string) {
    return prisma.roomCategory.create({
      data: {
        hotelId,
        name,
        description,
      },
    });
  }

  /**
   * Find or create a room category by name for a hotel
   */
  static async findOrCreateCategory(hotelId: string, name: string, description?: string) {
    const categoryName = name.trim();
    const existingCategory = await prisma.roomCategory.findFirst({
      where: {
        hotelId,
        name: categoryName,
      },
    });

    if (existingCategory) {
      return existingCategory;
    }

    return prisma.roomCategory.create({
      data: {
        hotelId,
        name: categoryName,
        description,
      },
    });
  }
}
