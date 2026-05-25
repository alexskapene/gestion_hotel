import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientProfileService } from "@/services/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const userId = req.auth.user.id as string;
    const { searchParams } = new URL(req.url);
    const checkUsername = searchParams.get("checkUsername");

    if (checkUsername) {
      const available = await ClientProfileService.checkUsernameAvailability(
        checkUsername,
        userId
      );
      return NextResponse.json({ available });
    }

    const [profile, stats] = await Promise.all([
      ClientProfileService.getProfile(userId),
      ClientProfileService.getProfileStats(userId),
    ]);

    if (!profile) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    }

    return NextResponse.json({ profile, stats });
  } catch (error) {
    console.error("Erreur récupération profil client:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const userId = req.auth.user.id as string;
    const body = await req.json();
    const { username, phone, avatar } = body;

    const updated = await ClientProfileService.updateProfile(userId, {
      ...(username !== undefined && { username: username?.trim() || null }),
      ...(phone !== undefined && { phone: phone?.trim() || null }),
      ...(avatar !== undefined && { avatar: avatar?.trim() || null }),
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur serveur";
    const status = message.includes("déjà utilisé") ? 409 : 500;
    console.error("Erreur mise à jour profil client:", error);
    return NextResponse.json({ error: message }, { status });
  }
}) as any;
