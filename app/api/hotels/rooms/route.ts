import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { RoomService } from "@/services/room.service";
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

    // Récupérer l'hôtel de l'utilisateur
    const hotel = await HotelService.getHotelByOwner(userId);

    if (!hotel) {
      return NextResponse.json(
        { error: "Aucun hôtel trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les chambres
    const rooms = await RoomService.getRoomsByHotel(hotel.id);
    const categories = await RoomService.getCategoriesByHotel(hotel.id);

    return NextResponse.json({ rooms, categories });
  } catch (error) {
    console.error("Erreur récupération chambres:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;

export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "HOTEL_OWNER") {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }

  try {
    const userId = req.auth.user.id as string;
    const body = await req.json();

    // Récupérer l'hôtel de l'utilisateur
    const hotel = await HotelService.getHotelByOwner(userId);

    if (!hotel) {
      return NextResponse.json(
        { error: "Aucun hôtel trouvé" },
        { status: 404 }
      );
    }

    // Valider les données
    if (!body.roomNumber || !body.title || !body.price || !body.capacity || (!body.categoryId && !body.categoryName)) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    let categoryId = body.categoryId;
    if (!categoryId && body.categoryName) {
      const category = await RoomService.findOrCreateCategory(
        hotel.id,
        body.categoryName,
      );
      categoryId = category.id;
    }

    const roomData = {
      roomNumber: body.roomNumber,
      title: body.title,
      description: body.description || undefined,
      price: Number(body.price),
      capacity: Number(body.capacity),
      hotelId: hotel.id,
      categoryId,
      bedCount: body.bedCount ? Number(body.bedCount) : undefined,
      bathroomCount: body.bathroomCount ? Number(body.bathroomCount) : undefined,
      size: body.size ? Number(body.size) : undefined,
      status: body.status,
      images: body.images,
    };

    // Créer la chambre
    const room = await RoomService.createRoom(roomData);

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Erreur création chambre:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
