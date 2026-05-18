import prisma from "@/lib/prisma";

export class AbonnementService {
  /**
   * Create a new subscription for a hotel
   */
  static async createAbonnement(hotelId: string, planName: string, amount: number, days: number) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return prisma.subscription.create({
      data: {
        hotelId,
        planName,
        amount,
        startDate,
        endDate,
        status: "ACTIVE",
      },
      include: {
        hotel: true,
      },
    });
  }

  /**
   * Get active subscription for a hotel
   */
  static async getActiveAbonnement(hotelId: string) {
    return prisma.subscription.findFirst({
      where: {
        hotelId,
        status: "ACTIVE",
        endDate: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * List all subscriptions (Admin only)
   */
  static async getAllAbonnements() {
    return prisma.subscription.findMany({
      include: {
        hotel: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
