import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientAvailableHotelsService } from "@/services/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }

  try {
    const cities = await ClientAvailableHotelsService.getAvailableCities();

    return NextResponse.json({
      cities: ["Tous", ...cities],
    });
  } catch (error) {
    console.error("Erreur récupération villes:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
