import prisma from "@/lib/prisma";
import { formatHotelForFrontend } from "./format-hotel";

export class ClientFavoritesService {
  /**
   * Hôtels pour lesquels le client a déjà effectué au moins une réservation
   */
  static async getHotelsFromReservations(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            hotel: {
              include: {
                images: { take: 1 },
                amenities: true,
                rooms: {
                  where: { isActive: true },
                  select: { price: true },
                  take: 1,
                  orderBy: { price: "asc" },
                },
                _count: { select: { reviews: true } },
              },
            },
          },
        },
      },
      orderBy: { checkIn: "desc" },
    });

    const hotelMap = new Map<
      string,
      {
        hotel: Parameters<typeof formatHotelForFrontend>[0];
        reservationCount: number;
        lastCheckIn: Date;
        lastCheckOut: Date;
      }
    >();

    for (const reservation of reservations) {
      const hotel = reservation.room.hotel;
      const existing = hotelMap.get(hotel.id);

      if (!existing) {
        hotelMap.set(hotel.id, {
          hotel,
          reservationCount: 1,
          lastCheckIn: reservation.checkIn,
          lastCheckOut: reservation.checkOut,
        });
        continue;
      }

      existing.reservationCount += 1;
      if (reservation.checkOut > existing.lastCheckOut) {
        existing.lastCheckOut = reservation.checkOut;
        existing.lastCheckIn = reservation.checkIn;
      }
    }

    return Array.from(hotelMap.values()).map(
      ({ hotel, reservationCount, lastCheckIn, lastCheckOut }) => ({
        ...formatHotelForFrontend(hotel),
        reservationCount,
        lastCheckIn: lastCheckIn.toISOString(),
        lastCheckOut: lastCheckOut.toISOString(),
      })
    );
  }
}
