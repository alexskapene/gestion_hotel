import prisma from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export class PaymentService {
    /**
     * Create a new payment
     */
    static async createPayment(data: any) {
        return prisma.payment.create({
            data,
        });
    }

    /**
     * Get all payments
     */
    static async getAllPayments(filters?: { search?: string; status?: string; method?: string; reservationId?: string }) {
        const where: any = {};

        if (filters?.search) {
            const search = filters.search;
            where.OR = [
                { transactionId: { contains: search } },
                { paymentMethod: { contains: search } },
                { reservation: { id: { contains: search } } },
                { reservation: { user: { email: { contains: search } } } },
                { reservation: { user: { username: { contains: search } } } },
            ];
        }

        if (filters?.status && filters.status !== "ALL") {
            where.status = filters.status;
        }

        if (filters?.method && filters.method !== "ALL") {
            where.paymentMethod = { contains: filters.method };
        }

        if (filters?.reservationId) {
            where.reservationId = filters.reservationId;
        }

        return prisma.payment.findMany({
            where,
            include: {
                reservation: {
                    include: {
                        user: true,
                        room: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    /**
     * Get a single payment by ID
     */
    static async getPaymentById(id: string) {
        return prisma.payment.findUnique({
            where: { id },
            include: {
                reservation: {
                    include: {
                        user: true,
                        room: true,
                    },
                },
            },
        });
    }

    /**
     * Update a payment
     */
    static async updatePayment(id: string, data: any) {
        return prisma.payment.update({
            where: { id },
            data,
        });
    }

    /**
     * Refund a payment
     */
    static async refundPayment(id: string) {
        return prisma.payment.update({
            where: { id },
            data: { status: PaymentStatus.REFUNDED },
            include: {
                reservation: {
                    include: {
                        user: true,
                        room: true,
                    },
                },
            },
        });
    }

    /**
     * Delete a payment
     */
    static async deletePayment(id: string) {
        return prisma.payment.delete({
            where: { id },
        });
    }

    /**
     * Get all payments for a specific reservation
     */
    static async getReservationPayments(reservationId: string) {
        return prisma.payment.findMany({
            where: { reservationId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Calculate the remaining balance for a reservation
     */
    static async calculateBalance(reservationId: string) {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { payments: true },
        });

        if (!reservation) throw new Error("Reservation not found");

        const totalPaid = reservation.payments.reduce((sum, payment) => {
            if (payment.status === PaymentStatus.COMPLETED) {
                return sum + payment.amount;
            }
            return sum;
        }, 0);

        return {
            totalPrice: reservation.totalPrice,
            totalPaid,
            remainingBalance: reservation.totalPrice - totalPaid,
        };
    }

    /**
     * Process a new payment and update reservation if necessary
     */
    static async processPayment(data: {
        reservationId: string;
        amount: number;
        paymentMethod: string;
        transactionId?: string;
    }) {
        return prisma.$transaction(async (tx) => {
            const reservation = await tx.reservation.findUnique({
                where: { id: data.reservationId },
            });

            if (!reservation) {
                throw new Error("Réservation introuvable.");
            }

            const payment = await tx.payment.create({
                data: {
                    ...data,
                    status: PaymentStatus.COMPLETED,
                },
            });

            const paidAmount = reservation.paidAmount + data.amount;
            await tx.reservation.update({
                where: { id: data.reservationId },
                data: {
                    paidAmount,
                    status:
                        reservation.status === BookingStatus.PENDING
                            ? BookingStatus.CONFIRMED
                            : reservation.status,
                },
            });

            return payment;
        });
    }
}
