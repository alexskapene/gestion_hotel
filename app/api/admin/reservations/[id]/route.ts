import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminReservationService } from "@/services/admin/reservation.service";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const segments = req.nextUrl.pathname.split("/");
    const id = segments[segments.length - 1];
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const reservation = await AdminReservationService.getReservationById(id);
    if (!reservation) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error: any) {
    console.error("[ADMIN_RESERVATION_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const segments = req.nextUrl.pathname.split("/");
    const id = segments[segments.length - 1];
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const body = await req.json();
    if (!body.status) {
      return NextResponse.json({ error: "Statut requis" }, { status: 400 });
    }

    const reservation = await AdminReservationService.updateReservationStatus(id, body.status);
    return NextResponse.json(reservation);
  } catch (error: any) {
    console.error("[ADMIN_RESERVATION_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}) as any;

export const DELETE = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const segments = req.nextUrl.pathname.split("/");
    const id = segments[segments.length - 1];
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await AdminReservationService.deleteReservation(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_RESERVATION_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
