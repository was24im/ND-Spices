import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secret = process.env.NEXTAUTH_SECRET || "nd_spices_super_secret_local_dev_jwt_key_2025";
  const token = await getToken({ req, secret });

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/wishlist");

  // 1. Guest-only routes: redirect authenticated users
  if (isAuthPage && token) {
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // 2. Admin-only routes: require token and role === 'ADMIN'
  if (isAdminRoute) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account?error=unauthorized", req.url));
    }
  }

  // 3. Customer protected routes: require active session
  if (isCustomerRoute && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/account/:path*",
    "/checkout",
    "/orders/:path*",
    "/wishlist",
    "/admin/:path*",
  ],
};
