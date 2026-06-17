import prisma from "@/lib/prisma";
import slugify from "slugify";

export class AdminHotelService {
  /**
   * Récupérer la liste des hôtels avec recherche et relations
   */
  static async getAllHotels(search?: string) {
    return prisma.hotel.findMany({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { city: { contains: search } },
        ]
      } : {},
      include: {
        owner: {
          select: { id: true, username: true, email: true }
        },
        _count: {
          select: { rooms: true, reviews: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Récupérer un hôtel par son ID avec détails complets
   */
  static async getHotelById(id: string) {
    return prisma.hotel.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, username: true, email: true, phone: true }
        },
        amenities: true,
        images: true,
        _count: {
          select: { rooms: true, reviews: true }
        }
      }
    });
  }

  /**
   * Créer un nouvel hôtel avec validations strictes
   */
  static async createHotel(data: any) {
    // Validation des images (max 4 + logo)
    if (data.images && data.images.length > 4) {
      throw new Error("Maximum 4 images autorisées");
    }

    // Génération automatique du slug
    const slug = slugify(data.name, { lower: true, strict: true });

    // Extraire les champs relationnels pour éviter les conflits Prisma
    const { images, amenities, ownerId, ...rest } = data;

    return prisma.hotel.create({
      data: {
        ...rest,
        slug,
        isActive: false,   // Par défaut inactif (attente admin)
        isVerified: false, // Par défaut non vérifié
        owner: {
          connect: { id: ownerId }
        },
        amenities: {
          create: amenities?.map((name: string) => ({ name })) || []
        },
        images: {
          create: images?.map((imageUrl: string) => ({ imageUrl })) || []
        }
      }
    });
  }

  /**
   * Mettre à jour un hôtel
   */
  static async updateHotel(id: string, data: any) {
    // Si le nom change, on régénère le slug
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    return prisma.hotel.update({
      where: { id },
      data
    });
  }

  /**
   * Supprimer un hôtel et ses dépendances
   */
  static async deleteHotel(id: string) {
    return prisma.hotel.delete({
      where: { id }
    });
  }
}
