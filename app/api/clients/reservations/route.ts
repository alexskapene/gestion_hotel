import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientReservationService } from "@/services/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }

  try {
    const userId = req.auth.user.id as string;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const reservations = await ClientReservationService.getClientReservations(
      userId,
      {
        status: status as any,
        search: search || undefined,
      }
    );

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Erreur récupération réservations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
