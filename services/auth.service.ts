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
   * Valide les identifiants d'un utilisateur et vérifie s'il a le rôle ADMIN.
   * Utilise Zod pour la validation des données et Prisma pour la sécurité SQL.
   */
  static async validateAdminCredentials(email: string, password: string) {
    try {
      // 1. Validation du format des données (Sécurité anti-XSS / Injections)
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        throw new Error("Données de connexion invalides");
      }

      // 2. Recherche de l'utilisateur (Prisma utilise des requêtes préparées anti-injection)
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Message générique pour éviter le "user enumeration"
        throw new Error("Identifiants incorrects");
      }

      // 3. Vérification stricte du rôle ADMIN
      if (user.role !== "ADMIN") {
        throw new Error("Accès non autorisé : Droits administrateur requis");
      }

      // 4. Vérification si le compte est actif
      if (!user.isActive) {
        throw new Error("Votre compte a été suspendu. Veuillez contacter le support.");
      }

      // 5. Comparaison sécurisée du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Identifiants incorrects");
      }

      // 6. Retourne l'utilisateur sans les données sensibles
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
