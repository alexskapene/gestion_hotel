import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientDashboardService } from "@/services/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }

  try {
    const userId = req.auth.user.id as string;
    const stats = await ClientDashboardService.getDashboardStats(userId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur dashboard client:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
