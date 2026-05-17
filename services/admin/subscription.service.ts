import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

export class AdminSubscriptionService {
  static async getAllSubscriptions(search?: string, status?: string) {
    return prisma.subscription.findMany({
      where: {
        AND: [
          status && status !== "ALL"
            ? { status: status as SubscriptionStatus }
            : {},
          search
            ? {
                OR: [
                  { planName: { contains: search, mode: "insensitive" } },
                  { hotel: { name: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {},
        ],
      },
      include: {
        hotel: true,
        transactions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getSubscriptionById(id: string) {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        hotel: true,
        transactions: true,
      },
    });
  }

  static async createSubscription(data: {
    hotelId: string;
    planName: string;
    amount: number;
    startDate?: Date;
    endDate: Date;
    status?: SubscriptionStatus;
  }) {
    return prisma.subscription.create({
      data: {
        hotelId: data.hotelId,
        planName: data.planName,
        amount: data.amount,
        startDate: data.startDate || new Date(),
        endDate: data.endDate,
        status: data.status || SubscriptionStatus.ACTIVE,
      },
    });
  }

  static async updateSubscriptionStatus(id: string, status: SubscriptionStatus) {
    return prisma.subscription.update({
      where: { id },
      data: { status },
    });
  }

  static async deleteSubscription(id: string) {
    return prisma.subscription.delete({
      where: { id },
    });
  }

  static async getAllTransactions(search?: string) {
    return prisma.subscriptionTransaction.findMany({
      where: search
        ? {
            OR: [
              { transactionId: { contains: search, mode: "insensitive" } },
              { paymentMethod: { contains: search, mode: "insensitive" } },
              { subscription: { hotel: { name: { contains: search, mode: "insensitive" } } } },
            ],
          }
        : {},
      include: {
        subscription: {
          include: {
            hotel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTransactionById(id: string) {
    return prisma.subscriptionTransaction.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            hotel: true,
          },
        },
      },
    });
  }

  static async deleteTransaction(id: string) {
    return prisma.subscriptionTransaction.delete({
      where: { id },
    });
  }
}
