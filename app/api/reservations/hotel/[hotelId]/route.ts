import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ReservationService } from "@/services/reservation.service";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hotelId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    const { hotelId } = await params;
    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    if (role === "HOTEL") {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
      });

      if (!hotel || hotel.userId !== userId) {
        return NextResponse.json(
          { error: "Accès non autorisé." },
          { status: 403 },
        );
      }
    } else if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé." },
        { status: 403 },
      );
    }

    const reservations = await ReservationService.getHotelReservations(hotelId);
    return NextResponse.json(reservations);
  } catch (error) {
    const { hotelId } = await params;
    console.error(`GET /api/reservations/hotel/${hotelId} error:`, error);
    return NextResponse.json(
      { error: "Impossible de récupérer les réservations." },
      { status: 500 },
    );
  }
}
