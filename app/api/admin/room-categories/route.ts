import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminRoomCategoryService } from "@/services/admin/room-category.service";

/**
 * GET: Liste des catégories de chambres
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId") || undefined;
    
    const categories = await AdminRoomCategoryService.getAllCategories(hotelId);
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("[ROOM_CATEGORIES_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * POST: Création d'une nouvelle catégorie
 */
export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    
    if (!data.name || !data.hotelId) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const category = await AdminRoomCategoryService.createCategory(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("[ROOM_CATEGORY_POST_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}) as any;
