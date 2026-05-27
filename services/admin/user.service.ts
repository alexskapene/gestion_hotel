import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export class AdminUserService {
  /**
   * Récupérer tous les utilisateurs avec recherche et filtres
   */
  static async getAllUsers(params: { search?: string; role?: string; isActive?: string; isVerified?: string; page?: string; limit?: string } = {}) {
    const { search, role, isActive, isVerified } = params;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          AND: [
            role && role !== "ALL" ? { role: role as Role } : {},
            isActive && isActive !== "ALL" ? { isActive: isActive === "true" } : {},
            isVerified && isVerified !== "ALL" ? { isVerified: isVerified === "true" } : {},
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
        orderBy: { createdAt: "desc" },
        skip: (params.page ? (parseInt(params.page) - 1) : 0) * (params.limit ? parseInt(params.limit) : 10),
        take: params.limit ? parseInt(params.limit) : 10,
      }),
      prisma.user.count({
        where: {
          AND: [
            role && role !== "ALL" ? { role: role as Role } : {},
            isActive && isActive !== "ALL" ? { isActive: isActive === "true" } : {},
            isVerified && isVerified !== "ALL" ? { isVerified: isVerified === "true" } : {},
            search ? {
              OR: [
                { username: { contains: search } },
                { email: { contains: search } },
              ]
            } : {}
          ]
        }
      })
    ]);

    return { users, total };
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

  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(data: any) {
    const { username, email, password, role, phone } = data;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw new Error("L'email ou le nom d'utilisateur est déjà utilisé");
    }

    const hashedPassword = await import("bcryptjs").then(m => m.default.hash(password, 10));

    return prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
        phone,
        isActive: true,
        isVerified: true, // L'admin crée des comptes déjà vérifiés par défaut
      }
    });
  }
}
