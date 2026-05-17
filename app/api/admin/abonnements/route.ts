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

    const subscriptions = await AdminSubscriptionService.getAllSubscriptions(search);
    return NextResponse.json(subscriptions);
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTIONS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { hotelId, planName, amount, days } = body;

    if (!hotelId || !planName || !amount || !days) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(days));

    const subscription = await AdminSubscriptionService.createSubscription({
      hotelId,
      planName,
      amount: Number(amount),
      startDate,
      endDate,
      status: "ACTIVE",
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_SUBSCRIPTIONS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}) as any;
