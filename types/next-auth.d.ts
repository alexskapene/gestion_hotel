import { UserRole } from "./types";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string | null;
    role?: UserRole;
    phone?: string | null;
    avatar?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      username?: string | null;
      role?: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
    role?: UserRole;
  }
}
