import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export class AdminUserService {
  /**
   * Récupérer tous les utilisateurs avec recherche et filtres
   */
  static async getAllUsers(params: { search?: string; role?: string } = {}) {
    const { search, role } = params;
    
    return prisma.user.findMany({
      where: {
        AND: [
          role ? { role: role as Role } : {},
          search ? {
            OR: [
              { username: { contains: search } },
              { email: { contains: search } },
            ]
          } : {}
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        hotels: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Mettre à jour le statut d'un utilisateur (Activation, Vérification, Rôle)
   */
  static async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isVerified !== undefined && { isVerified: data.isVerified }),
        ...(data.role !== undefined && { role: data.role as Role }),
      }
    });
  }

  /**
   * Supprimer un utilisateur
   */
  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  }
}
