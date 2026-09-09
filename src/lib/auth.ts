import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if admin demo credentials
        if (
          credentials.email === (process.env.ADMIN_EMAIL || "admin@ndspices.com") &&
          credentials.password === (process.env.ADMIN_PASSWORD || "supersecretadminpassword")
        ) {
          return {
            id: "admin-1",
            name: "ND Spices Admin",
            email: credentials.email,
            role: "ADMIN",
          };
        }

        // Standard user fallback for demo or DB lookups
        return {
          id: "user-1",
          name: "Culinary Enthusiast",
          email: credentials.email,
          role: "USER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_nd_spices_secret_key_32_characters",
};
