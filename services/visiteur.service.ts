import prisma from "@/lib/prisma";
const db: any = prisma as any;

export class VisiteurService {
    /**
     * Create a new visiteur
     */
    static async createVisiteur(data: any) {
        return db.visiteur.create({
            data,
        });
    }

    /**
     * Get all visiteurs
     */
    static async getAllVisiteurs() {
        return db.visiteur.findMany();
    }

    /**
     * Get a single visiteur by ID
     */
    static async getVisiteurById(id: string) {
        return db.visiteur.findUnique({
            where: { id },
        });
    }

    /**
     * Update a visiteur
     */
    static async updateVisiteur(id: string, data: any) {
        return db.visiteur.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete a visiteur
     */
    static async deleteVisiteur(id: string) {
        return db.visiteur.delete({
            where: { id },
        });
    }

    /**
     * Get a visiteur with all their reservations
     */
    static async getVisiteurWithReservations(id: string) {
        return db.visiteur.findUnique({
            where: { id },
            include: {
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
     * Search visiteurs by name or phone
     */
    static async searchVisiteurs(query: string) {
        return db.visiteur.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { phone: { contains: query } },
                    { email: { contains: query } },
                ],
            },
        });
    }
}