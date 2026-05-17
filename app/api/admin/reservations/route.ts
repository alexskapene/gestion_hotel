import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminReservationService } from "@/services/admin/reservation.service";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const reservations = await AdminReservationService.getAllReservations({ search, status });
    return NextResponse.json(reservations);
  } catch (error: any) {
    console.error("[ADMIN_RESERVATIONS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;
