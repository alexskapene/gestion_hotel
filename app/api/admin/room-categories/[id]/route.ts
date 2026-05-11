import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminRoomCategoryService } from "@/services/admin/room-category.service";

/**
 * GET: Détails d'une catégorie
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const category = await AdminRoomCategoryService.getCategoryById(id);

    if (!category) {
      return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("[ROOM_CATEGORY_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * PATCH: Mise à jour d'une catégorie
 */
export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const body = await req.json();
    const updatedCategory = await AdminRoomCategoryService.updateCategory(id, body);

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error("[ROOM_CATEGORY_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}) as any;

/**
 * DELETE: Suppression d'une catégorie
 */
export const DELETE = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await AdminRoomCategoryService.deleteCategory(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ROOM_CATEGORY_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}) as any;
