import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ReservationService } from "@/services/reservation.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise pour réserver." },
        { status: 401 },
      );
    }

    const body = await request.json();
    if (!body.roomId || !body.checkIn || !body.checkOut || !body.totalPrice) {
      return NextResponse.json(
        { error: "Données de réservation invalides." },
        { status: 400 },
      );
    }

    const reservation = await ReservationService.createReservation({
      roomId: body.roomId,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
      totalPrice: Number(body.totalPrice),
      guests: Number(body.guests) || 1,
      userId: (session.user as any).id,
      acompte: 0,
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("POST /api/reservations error:", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message || "Impossible de créer la réservation.",
      },
      { status: 500 },
    );
  }
}
