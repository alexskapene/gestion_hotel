import prisma from "@/lib/prisma";

export class AdminReviewService {
  static async getAllReviews(search?: string) {
    return prisma.review.findMany({
      where: search
        ? {
            OR: [
              { comment: { contains: search } },
              { user: { username: { contains: search } } },
              { user: { email: { contains: search } } },
              { hotel: { name: { contains: search } } },
            ],
          }
        : {},
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getReviewById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async deleteReview(id: string) {
    return prisma.review.delete({
      where: { id },
    });
  }
}
