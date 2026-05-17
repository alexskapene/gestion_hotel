import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminSubscriptionService } from "@/services/admin/subscription.service";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const transactions = await AdminSubscriptionService.getAllTransactions(search);
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTION_TRANSACTIONS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;
