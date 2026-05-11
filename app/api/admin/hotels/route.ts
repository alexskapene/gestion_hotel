import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminHotelService } from "@/services/admin/hotel.service";

/**
 * GET: Liste des hôtels avec recherche
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    
    const hotels = await AdminHotelService.getAllHotels(search);
    return NextResponse.json(hotels);
  } catch (error: any) {
    console.error("[HOTELS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * POST: Création d'un nouvel hôtel
 */
export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    
    // Validation minimale ici, le service gère le reste
    if (!data.name || !data.ownerId || !data.city) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const hotel = await AdminHotelService.createHotel(data);
    return NextResponse.json(hotel, { status: 201 });
  } catch (error: any) {
    console.error("[HOTEL_POST_ERROR]:", error);
    return NextResponse.json({ error: error.message || "Erreur lors de la création" }, { status: 500 });
  }
}) as any;
