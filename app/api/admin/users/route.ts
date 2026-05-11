import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Schéma de validation pour la création d'un utilisateur
const createUserSchema = z.object({
  username: z.string().min(3, "Le pseudo doit faire au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  role: z.enum(["ADMIN", "HOTEL_OWNER", "CLIENT"]),
  phone: z.string().optional(),
});

/**
 * GET: Liste des utilisateurs avec filtres et pagination
 */
export const GET = auth(async (req) => {
  // 1. Vérification des droits Admin
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.nextUrl);
    
    // Paramètres de filtrage
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");
    const isActive = searchParams.get("isActive");
    const isVerified = searchParams.get("isVerified");
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construction de la clause WHERE
    const where: any = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
      ];
    }
    
    if (role && role !== "ALL") {
      where.role = role;
    }
    
    if (isActive !== null && isActive !== "ALL") {
      where.isActive = isActive === "ACTIVE";
    }
    
    if (isVerified !== null && isVerified !== "ALL") {
      where.isVerified = isVerified === "VERIFIED";
    }

    // Requête Prisma
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          isVerified: true,
          phone: true,
          avatar: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("[USERS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}) as any;

/**
 * POST: Créer un nouvel utilisateur
 */
export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { username, email, password, role, phone } = validation.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email ou Pseudo déjà utilisé" }, { status: 400 });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        phone,
        isActive: true,
        isVerified: true, // L'admin crée des comptes déjà vérifiés par défaut
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error("[USER_POST_ERROR]:", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}) as any;
