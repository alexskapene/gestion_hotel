import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientReservationService } from "@/services/client";
import { BookingStatus } from "@prisma/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const userId = req.auth.user.id as string;
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const status =
      statusParam && statusParam !== "ALL"
        ? (statusParam as BookingStatus)
        : undefined;

    const history = await ClientReservationService.getReservationHistory(
      userId,
      { status }
    );

    return NextResponse.json(history);
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;
