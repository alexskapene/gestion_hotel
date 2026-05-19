import CredentialsProvider from "next-auth/providers/credentials"

export const providers = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      try {
        const { AuthService } = await import("@/services/auth.service");
        const user = await AuthService.validateCredentials(
          credentials.email as string,
          credentials.password as string
        );
        return user;
      } catch (error: any) {
        // Rethrow with a consistent prefix so server logs show the formatted message
        const msg = (error && error.message) ? error.message : String(error);
        const formatted = `[AUTH_ERROR]: ${msg}`;
        console.error(formatted);
        throw new Error(formatted);
      }
    }
  })
];
