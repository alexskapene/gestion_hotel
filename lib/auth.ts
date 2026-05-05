import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // adapter: PrismaAdapter(prisma), // Gardez désactivé comme demandé précédemment
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        const email = (credentials.email as string).toLowerCase().trim()
        const password = credentials.password as string

        console.log("Processing login for:", email)

        // --- Mock login for demo/testing without backend ---
        if (email === "admin@demo.com") {
          console.log("Mock admin matched!")
          return { id: "mock-admin", email: "admin@demo.com", role: "ADMIN", name: "Mock Admin" }
        }
        if (email === "hotel@demo.com") {
          console.log("Mock hotel matched!")
          return { id: "mock-hotel", email: "hotel@demo.com", role: "HOTEL", name: "Mock Hotel" }
        }
        if (email === "client@demo.com") {
          console.log("Mock client matched!")
          return { id: "mock-client", email: "client@demo.com", role: "CLIENT", name: "Mock Client" }
        }
        // ----------------------------------------------------

        try {
          console.log("Searching for user with email:", email)
          const user = await prisma.user.findUnique({
            where: {
              email: email
            }
          })

          if (!user || !user.password) {
            console.log("User not found or no password in DB")
            return null
          }

          console.log("User found, comparing passwords...")
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          )

          if (!isPasswordCorrect) {
            console.log("Password mismatch")
            return null
          }

          console.log("Login successful for:", email)
          return user
        } catch (error) {
          console.error("Critical Auth error:", error)
          return null
        }
      }
    })
  ],
})
