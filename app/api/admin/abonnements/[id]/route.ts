import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminSubscriptionService } from "@/services/admin/subscription.service";

const extractId = (req: Request) => {
  const pathname = new URL(req.url).pathname;
  const segments = pathname.split("/");
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

    const subscription = await AdminSubscriptionService.getSubscriptionById(id);
    if (!subscription) {
      return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTION_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = extractId(req);
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
    }

    const subscription = await AdminSubscriptionService.updateSubscriptionStatus(id, status);
    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTION_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
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

    await AdminSubscriptionService.deleteSubscription(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTION_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
