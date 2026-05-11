import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminRoomService } from "@/services/admin/room.service";

/**
 * GET: Liste des chambres avec filtres
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const rooms = await AdminRoomService.getAllRooms({ hotelId, categoryId, status, search });
    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error("[ROOMS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * POST: Création d'une nouvelle chambre
 */
export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    
    if (!data.roomNumber || !data.hotelId || !data.categoryId || !data.price) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const room = await AdminRoomService.createRoom(data);
    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    console.error("[ROOM_POST_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}) as any;
