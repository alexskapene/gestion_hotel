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

    const users = await AdminUserService.getAllUsers({ search, role });
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("[USERS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;
