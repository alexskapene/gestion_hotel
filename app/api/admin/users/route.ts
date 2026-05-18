import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdminUserService } from "@/services/admin/user.service";

/**
 * GET: Liste des utilisateurs avec filtres
 */
export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;
    const isActive = searchParams.get("isActive") || undefined;
    const isVerified = searchParams.get("isVerified") || undefined;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const { users, total } = await AdminUserService.getAllUsers({ 
      search, role, isActive, isVerified, page, limit 
    });

    return NextResponse.json({ 
      users,
      pagination: { total }
    });
  } catch (error: any) {
    console.error("[USERS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * POST: Créer un utilisateur
 */
export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const user = await AdminUserService.createUser(data);
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("[USER_POST_ERROR]:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création" }, 
      { status: 400 }
    );
  }
}) as any;
