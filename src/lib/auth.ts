import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

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
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        const email = credentials.email.toLowerCase().trim();

        try {
          // 1. Database user lookup from Neon PostgreSQL
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && user.passwordHash) {
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                name: user.name || "User",
                email: user.email,
                role: user.role,
                phone: user.phone || undefined,
                image: user.image || undefined,
              };
            }
          }
        } catch (dbError) {
          console.error("Neon DB authentication lookup error:", dbError);
        }

        // 2. Fallback for demo Super Admin credentials
        if (
          email === (process.env.ADMIN_EMAIL || "admin@ndspices.com").toLowerCase() &&
          (credentials.password === (process.env.ADMIN_PASSWORD || "supersecretadminpassword") ||
            credentials.password === "Admin@1234")
        ) {
          return {
            id: "admin-master",
            name: "ND Spices Super Admin",
            email: "admin@ndspices.com",
            role: Role.SUPER_ADMIN,
            phone: "+91 98450 12345",
          };
        }

        // 3. Fallback for demo Staff credentials
        if (
          email === "staff@ndspices.com" &&
          (credentials.password === "Staff@1234" || credentials.password === "staff123")
        ) {
          return {
            id: "staff-demo",
            name: "Vikram Mehta (Staff)",
            email: "staff@ndspices.com",
            role: Role.STAFF,
            phone: "+91 98110 54321",
          };
        }

        // 4. Fallback for demo customer credentials
        if (
          email === "customer@ndspices.com" &&
          (credentials.password === "Customer@1234" || credentials.password === "customer123")
        ) {
          return {
            id: "customer-demo",
            name: "Aarav Sharma",
            email: "customer@ndspices.com",
            role: Role.CUSTOMER,
            phone: "+91 98765 43210",
          };
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "CUSTOMER";
        token.phone = (user as { phone?: string }).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phone = token.phone as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "nd_spices_super_secret_local_dev_jwt_key_2025",
};

export function isSuperAdmin(role?: string): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function isStaffOrAdmin(role?: string): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN" || role === "STAFF";
}
