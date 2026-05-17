import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminReviewService } from "@/services/admin/review.service";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;

    const reviews = await AdminReviewService.getAllReviews(search);
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("[ADMIN_REVIEWS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;
