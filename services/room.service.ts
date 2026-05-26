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
  }) {
    return prisma.room.create({
      data,
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
    return prisma.room.update({
      where: { id },
      data,
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
}
