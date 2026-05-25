import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientFavoritesService } from "@/services/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const userId = req.auth.user.id as string;
    const hotels = await ClientFavoritesService.getHotelsFromReservations(userId);
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Erreur récupération favoris:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;
