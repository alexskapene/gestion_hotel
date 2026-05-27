import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ReservationService } from "@/services/reservation.service";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        room: { include: { hotel: true } },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Réservation introuvable." },
        { status: 404 },
      );
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role === "CLIENT" && reservation.userId !== userId) {
      return NextResponse.json(
        { error: "Accès non autorisé." },
        { status: 403 },
      );
    }

    if (role === "HOTEL_OWNER" && reservation.room.hotel.ownerId !== userId) {
      return NextResponse.json(
        { error: "Accès non autorisé." },
        { status: 403 },
      );
    }

    const confirmed = await ReservationService.confirmReservation(id);
    return NextResponse.json(confirmed);
  } catch (error) {
    const { id } = await params;
    console.error(`POST /api/reservations/${id}/confirm error:`, error);
    return NextResponse.json(
      {
        error:
          (error as Error).message || "Impossible de confirmer la réservation.",
      },
      { status: 500 },
    );
  }
}
