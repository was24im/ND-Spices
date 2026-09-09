import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secret = process.env.NEXTAUTH_SECRET || "nd_spices_super_secret_local_dev_jwt_key_2025";
  const token = await getToken({ req, secret });
  const role = token?.role as string | undefined;

  const isStaffLogin = pathname === "/staff/login";
  const isStaffRoute = pathname.startsWith("/staff") && !isStaffLogin;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isCustomerRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/wishlist");

  // 1. Staff Login page handling
  if (isStaffLogin && token) {
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role === "STAFF") {
      return NextResponse.redirect(new URL("/staff/crm", req.url));
    }
    // If ordinary customer visits staff login, stay or redirect
  }

  // 2. Public customer auth pages: redirect authenticated users
  if (isAuthPage && token) {
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role === "STAFF") {
      return NextResponse.redirect(new URL("/staff/crm", req.url));
    }
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // 3. Super Admin-only routes (/admin/*): strictly require SUPER_ADMIN or ADMIN
  if (isAdminRoute) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      // If staff tries to access admin, redirect to staff portal
      if (role === "STAFF") {
        return NextResponse.redirect(new URL("/staff/crm", req.url));
      }
      return NextResponse.redirect(new URL("/account?error=unauthorized", req.url));
    }
  }

  // 4. Staff-only routes (/staff/*): require STAFF or SUPER_ADMIN
  if (isStaffRoute) {
    if (!token) {
      const url = new URL("/staff/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (role !== "STAFF" && role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/staff/login?error=unauthorized", req.url));
    }
  }

  // 5. Customer protected routes: require active session
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
    "/staff/:path*",
    "/account/:path*",
    "/checkout",
    "/orders/:path*",
    "/wishlist",
    "/admin/:path*",
  ],
};
