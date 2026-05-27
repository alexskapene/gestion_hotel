import prisma from "@/lib/prisma";

export class ClientService {
    /**
     * Create a new client
     */
    static async createClient(data: any) {
            const db: any = prisma as any;
            return db.client.create({
                data,
            });
    }

    /**
     * Get all clients
     */
    static async getAllClients() {
        const db: any = prisma as any;
        return db.client.findMany();
    }

    /**
     * Get a single client by ID
     */
    static async getClientById(id: string) {
        const db: any = prisma as any;
        return db.client.findUnique({
            where: { id },
        });
    }

    /**
     * Update a client
     */
    static async updateClient(id: string, data: any) {
        const db: any = prisma as any;
        return db.client.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete a client
     */
    static async deleteClient(id: string) {
        const db: any = prisma as any;
        return db.client.delete({
            where: { id },
        });
    }

    /**
     * Get a client with all their reservations
     */
    static async getClientWithReservations(id: string) {
        const db: any = prisma as any;
        return db.client.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        email: true,
                        username: true,
                        role: true,
                    }
                },
                reservations: {
                    include: {
                        room: true,
                        payments: true,
                    },
                    orderBy: {
                        checkIn: 'desc'
                    }
                }
            }
        });
    }

    /**
     * Search clients by name, email or phone
     */
    static async searchClients(query: string) {
        const db: any = prisma as any;
        return db.client.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { phone: { contains: query } },
                    { user: { email: { contains: query } } },
                    { user: { username: { contains: query } } },
                ],
            },
            include: {
                user: {
                    select: {
                        email: true,
                        username: true,
                    }
                }
            }
        });
    }

    /**
     * Toggle client active status
     */
    static async toggleClientStatus(id: string, isActive: boolean) {
        const db: any = prisma as any;
        return db.client.update({
            where: { id },
            data: { isActive },
        });
    }
}