import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientProfileService } from "@/services/client";

export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const userId = req.auth.user.id as string;
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    await ClientProfileService.changePassword(userId, {
      currentPassword,
      newPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur serveur";
    const status =
      message.includes("incorrect") || message.includes("caractères") || message.includes("différent")
        ? 400
        : 500;
    console.error("Erreur changement mot de passe:", error);
    return NextResponse.json({ error: message }, { status });
  }
}) as any;
