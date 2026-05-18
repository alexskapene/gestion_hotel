import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schéma de validation pour les identifiants
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe est trop court"),
});

export class AuthService {
  /**
   * Valide les identifiants d'un utilisateur pour tous les rôles.
   * Utilise Zod pour la validation des données et Prisma pour la sécurité SQL.
   */
  static async validateCredentials(email: string, password: string) {
    try {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        throw new Error("Données de connexion invalides");
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Identifiants incorrects");
      }

      if (!user.isActive) {
        throw new Error("Votre compte a été suspendu. Veuillez contacter le support.");
      }

      if (!user.isVerified) {
        throw new Error("Votre compte n'est pas encore vérifié. Veuillez valider votre email.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Identifiants incorrects");
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };
    } catch (error: any) {
      console.error("[AUTH_ERROR]:", error.message);
      throw error;
    }
  }

  /**
   * La déconnexion est gérée par NextAuth.
   * On peut ajouter ici des logs de déconnexion si nécessaire.
   */
  static async logout() {
    return { success: true };
  }
}
