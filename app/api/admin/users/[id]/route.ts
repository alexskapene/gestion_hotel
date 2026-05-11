import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminUserService } from "@/services/admin/user.service";

/**
 * PATCH: Mise à jour d'un utilisateur
 */
export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const body = await req.json();
    const updatedUser = await AdminUserService.updateUser(id, body);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[USER_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}) as any;

/**
 * DELETE: Suppression d'un utilisateur
 */
export const DELETE = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await AdminUserService.deleteUser(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[USER_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
