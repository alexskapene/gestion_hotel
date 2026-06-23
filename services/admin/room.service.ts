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
        images: images && images.length > 0
          ? { create: images.map((imageUrl: string) => ({ imageUrl })) }
          : undefined
      },
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
   * Mettre à jour une chambre
   */
  static async updateRoom(id: string, data: any) {
    const { amenities, images, ...rest } = data;

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

    // Handle amenities update
    let amenitiesData: any = {};
    if (amenities !== undefined) {
      await prisma.roomAmenity.deleteMany({
        where: { roomId: id },
      });

      if (amenities.length > 0) {
        amenitiesData = {
          amenities: {
            create: amenities.map((name: string) => ({ name })),
          },
        };
      }
    }

    return prisma.room.update({
      where: { id },
      data: {
        ...rest,
        ...imagesData,
        ...amenitiesData,
      },
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
   * Supprimer une chambre
   */
  static async deleteRoom(id: string) {
    return prisma.room.delete({
      where: { id }
    });
  }
}
