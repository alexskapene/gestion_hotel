import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientHotelService } from "@/services/client";

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
    const type = searchParams.get("type");

    if (type === "visited") {
      const hotels = await ClientHotelService.getVisitedHotels(userId);
      return NextResponse.json(hotels);
    }

    if (type === "reviews") {
      const reviews = await ClientHotelService.getClientReviews(userId);
      return NextResponse.json(reviews);
    }

    // Par défaut: tous les hôtels visités
    const hotels = await ClientHotelService.getVisitedHotels(userId);
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Erreur récupération hôtels:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
