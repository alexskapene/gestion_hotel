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

    if (role === "HOTEL_OWNER") {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
      });

        if (!hotel || hotel.ownerId !== userId) {
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

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || undefined;
    const searchParam = searchParams.get("search") || undefined;
    const fromParam = searchParams.get("from") || undefined;
    const toParam = searchParams.get("to") || undefined;

    const fromDate = fromParam ? new Date(fromParam) : undefined;
    const toDate = toParam ? new Date(toParam) : undefined;

    const reservations = await ReservationService.getHotelReservations(hotelId, {
      status: statusParam as any,
      search: searchParam,
      from: fromDate,
      to: toDate,
    });
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
