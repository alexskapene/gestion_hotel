import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminReviewService } from "@/services/admin/review.service";

const extractId = (req: Request) => {
  const segments = new URL(req.url).pathname.split("/");
  return segments[segments.length - 1];
};

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = extractId(req);
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const review = await AdminReviewService.getReviewById(id);
    if (!review) {
      return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("[ADMIN_REVIEW_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

export const DELETE = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = extractId(req);
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await AdminReviewService.deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_REVIEW_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
