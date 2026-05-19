import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
  /**
   * Create a new user without créant l'hôtel.
   */
  static async createUser(data: any) {
    const { email, password, username, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role || Role.CLIENT,
      },
    });
  }

  /**
   * Update user profile fields for client onboarding.
   */
  static async updateUserProfile(id: string, data: { username?: string; phone?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Get user by email (used for auth checks)
   */
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        role: true,
      },
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
