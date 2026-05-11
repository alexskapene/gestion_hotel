import prisma from "@/lib/prisma";

export class AdminRoomService {
  /**
   * Récupérer toutes les chambres avec filtres (hôtel, catégorie, statut)
   */
  static async getAllRooms(params: { hotelId?: string; categoryId?: string; status?: string; search?: string } = {}) {
    const { hotelId, categoryId, status, search } = params;

    return prisma.room.findMany({
      where: {
        AND: [
          hotelId ? { hotelId } : {},
          categoryId ? { categoryId } : {},
          status ? { status: status as any } : {},
          search ? {
            OR: [
              { roomNumber: { contains: search } },
              { title: { contains: search } },
            ]
          } : {}
        ]
      },
      include: {
        hotel: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true }
        },
        _count: {
          select: { reservations: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Récupérer une chambre par son ID
   */
  static async getRoomById(id: string) {
    return prisma.room.findUnique({
      where: { id },
      include: {
        hotel: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true }
        },
        images: true,
        amenities: true
      }
    });
  }

  /**
   * Créer une nouvelle chambre
   */
  static async createRoom(data: any) {
    const { amenities, images, ...rest } = data;

    return prisma.room.create({
      data: {
        ...rest,
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
   * Mettre à jour une chambre
   */
  static async updateRoom(id: string, data: any) {
    const { amenities, images, ...rest } = data;

    // Pour simplifier, on supprime et on recrée les relations simples si elles sont fournies
    return prisma.room.update({
      where: { id },
      data: {
        ...rest,
        ...(amenities && {
          amenities: {
            deleteMany: {},
            create: amenities.map((name: string) => ({ name }))
          }
        }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((imageUrl: string) => ({ imageUrl }))
          }
        })
      }
    });
  }

  /**
   * Supprimer une chambre
   */
  static async deleteRoom(id: string) {
    return prisma.room.delete({
      where: { id }
    });
  }
}
