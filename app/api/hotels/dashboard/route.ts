import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { HotelDashboardService } from "@/services/hotel";
import { HotelService } from "@/services/hotel";

export const dynamic = "force-dynamic";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "HOTEL_OWNER") {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }

  try {
    const userId = req.auth.user.id as string;

    // Récupérer l'hôtel associé à cet utilisateur
    const hotel = await HotelService.getHotelByOwner(userId);

    if (!hotel) {
      return NextResponse.json(
        { error: "Aucun hôtel trouvé" },
        { status: 404 }
      );
    }

    const stats = await HotelDashboardService.getDashboardStats(hotel.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur dashboard hôtel:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
