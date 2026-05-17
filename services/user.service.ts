import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
  /**
   * Create a new user and, when c'est un propriétaire, un hôtel lié.
   */
  static async createUser(data: any) {
    const { email, password, username, role, ...profileData } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: role || Role.CLIENT,
        },
      });

      if (role === Role.HOTEL_OWNER) {
        await tx.hotel.create({
          data: {
            ownerId: user.id,
            name: profileData.name || "Nouveau Hôtel",
            address: profileData.address || "",
            city: profileData.city || "",
            slug: profileData.slug || `hotel-${Date.now()}`,
            description: profileData.description || "",
            shortDescription: profileData.shortDescription || "",
            hotelType: profileData.hotelType || "HOTEL",
            country: profileData.country || "",
          },
        });
      }

      return user;
    });
  }

  /**
   * Get user by ID with relations.
   */
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        hotels: true,
        reservations: true,
        reviews: true,
      },
    });
  }

  /**
   * Get all users with filters.
   */
  static async getAllUsers(filters: { role?: Role; isActive?: boolean } = {}) {
    return prisma.user.findMany({
      where: filters,
      include: {
        hotels: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update user status (Activate/Deactivate)
   */
  static async updateStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  /**
   * Delete a user and its profiles
   */
  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
