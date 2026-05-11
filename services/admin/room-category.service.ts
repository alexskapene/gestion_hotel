import prisma from "@/lib/prisma";

export class AdminRoomCategoryService {
  /**
   * Récupérer toutes les catégories de chambres, éventuellement filtrées par hôtel
   */
  static async getAllCategories(hotelId?: string) {
    return prisma.roomCategory.findMany({
      where: hotelId ? { hotelId } : {},
      include: {
        hotel: {
          select: { id: true, name: true }
        },
        _count: {
          select: { rooms: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Récupérer une catégorie par son ID
   */
  static async getCategoryById(id: string) {
    return prisma.roomCategory.findUnique({
      where: { id },
      include: {
        hotel: {
          select: { id: true, name: true }
        },
        rooms: true
      }
    });
  }

  /**
   * Créer une nouvelle catégorie de chambres
   */
  static async createCategory(data: { name: string; description?: string; hotelId: string }) {
    return prisma.roomCategory.create({
      data
    });
  }

  /**
   * Mettre à jour une catégorie de chambres
   */
  static async updateCategory(id: string, data: { name?: string; description?: string; hotelId?: string }) {
    return prisma.roomCategory.update({
      where: { id },
      data
    });
  }

  /**
   * Supprimer une catégorie de chambres
   */
  static async deleteCategory(id: string) {
    return prisma.roomCategory.delete({
      where: { id }
    });
  }
}
