import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminHotelService } from "@/services/admin/hotel.service";

/**
 * GET: Détails d'un hôtel spécifique
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const hotel = await AdminHotelService.getHotelById(id);

    if (!hotel) {
      return NextResponse.json({ error: "Hôtel introuvable" }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error: any) {
    console.error("[HOTEL_GET_INDIVIDUAL_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * PATCH: Mise à jour d'un hôtel
 */
export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const body = await req.json();
    const updatedHotel = await AdminHotelService.updateHotel(id, body);

    return NextResponse.json(updatedHotel);
  } catch (error: any) {
    console.error("[HOTEL_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}) as any;

/**
 * DELETE: Suppression d'un hôtel
 */
export const DELETE = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await AdminHotelService.deleteHotel(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[HOTEL_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
