import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminRoomService } from "@/services/admin/room.service";

/**
 * GET: Détails d'une chambre
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = new URL(req.url).pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const room = await AdminRoomService.getRoomById(id);

    if (!room) {
      return NextResponse.json({ error: "Chambre introuvable" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error: any) {
    console.error("[ROOM_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * PATCH: Mise à jour d'une chambre
 */
export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = new URL(req.url).pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const body = await req.json();
    const updatedRoom = await AdminRoomService.updateRoom(id, body);

    return NextResponse.json(updatedRoom);
  } catch (error: any) {
    console.error("[ROOM_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}) as any;

/**
 * DELETE: Suppression d'une chambre
 */
export const DELETE = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = new URL(req.url).pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await AdminRoomService.deleteRoom(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ROOM_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
