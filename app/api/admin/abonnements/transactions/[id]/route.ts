import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminSubscriptionService } from "@/services/admin/subscription.service";

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

    const transaction = await AdminSubscriptionService.getTransactionById(id);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTION_TRANSACTION_GET_ERROR]:", error);
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

    await AdminSubscriptionService.deleteTransaction(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTION_TRANSACTION_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
