import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export class ClientProfileService {
  /**
   * Récupérer le profil du client
   */
  static async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatar: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reservations: true,
            reviews: true,
          },
        },
      },
    });
  }

  /**
   * Mettre à jour le profil du client
   */
  static async updateProfile(
    userId: string,
    data: {
      username?: string;
      phone?: string;
      avatar?: string;
    }
  ) {
    // Vérifier l'unicité du username si modifié
    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error("Ce nom d'utilisateur est déjà utilisé");
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatar: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Récupérer les statistiques du profil
   */
  static async getProfileStats(userId: string) {
    const [reservationCount, reviewCount, totalSpent] = await Promise.all([
      prisma.reservation.count({
        where: { userId },
      }),
      prisma.review.count({
        where: { userId },
      }),
      prisma.reservation.aggregate({
        where: { userId },
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      reservationCount,
      reviewCount,
      totalSpent: totalSpent._sum.totalPrice || 0,
    };
  }

  /**
   * Vérifier l'unicité d'un username
   */
  static async checkUsernameAvailability(username: string, userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: userId },
      },
    });

    return !user;
  }

  /**
   * Changer le mot de passe du client
   */
  static async changePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const isCurrentValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );

    if (!isCurrentValid) {
      throw new Error("Mot de passe actuel incorrect");
    }

    if (data.newPassword.length < 6) {
      throw new Error(
        "Le nouveau mot de passe doit contenir au moins 6 caractères"
      );
    }

    if (data.currentPassword === data.newPassword) {
      throw new Error(
        "Le nouveau mot de passe doit être différent de l'ancien"
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, updatedAt: new Date() },
    });

    return { success: true };
  }

  /**
   * Récupérer les informations de contact
   */
  static async getContactInfo(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        phone: true,
      },
    });
  }

  /**
   * Mettre à jour les informations de contact
   */
  static async updateContactInfo(
    userId: string,
    data: {
      phone?: string;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        email: true,
        phone: true,
      },
    });
  }
}
