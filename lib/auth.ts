import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { authConfig } from "@/auth.config"
import { providers } from "@/auth.providers"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [...providers],
  adapter: PrismaAdapter(prisma),
})
