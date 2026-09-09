"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { AnnouncementBar } from "./AnnouncementBar";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { toggleDrawer, getTotalItems } = useCartStore();
  const { getTotalItems: getWishlistCount } = useWishlistStore();

  const totalCartCount = getTotalItems();
  const totalWishlistCount = getWishlistCount();

  const role = (session?.user as any)?.role || "USER";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "All Spices", href: "/products" },
    { name: "Whole Spices", href: "/products?category=whole-spices" },
    { name: "Stone Ground", href: "/products?category=ground-spices" },
    { name: "Saffron & Exotics", href: "/products?category=exotics-and-saffron" },
    { name: "Heritage Blends", href: "/products?category=heritage-blends" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-cream-300">
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-spice-dark hover:text-primary rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary via-cinnamon to-secondary flex items-center justify-center shadow-spice-sm group-hover:scale-105 transition-transform">
                <span className="text-white font-serif font-black text-xl tracking-tight">ND</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-xl sm:text-2xl text-spice-dark tracking-tight leading-none group-hover:text-primary transition-colors">
                  ND Spices
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-secondary-600 mt-0.5">
                  Pure Heritage Aromatics
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-spice-dark/90 hover:text-primary transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search */}
            <Link
              href="/products"
              className="p-2 text-spice-dark hover:text-primary hover:bg-cream-200 rounded-full transition-colors hidden sm:flex"
              aria-label="Search spices"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/products"
              className="relative p-2 text-spice-dark hover:text-cinnamon hover:bg-cream-200 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cinnamon-500 text-[10px] font-bold text-white shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* User Auth Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              {session?.user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-cream-200 transition-colors"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs border border-primary-300">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-full border border-cream-300 bg-white hover:bg-cream-100 px-3 py-1.5 text-xs font-bold text-spice-dark transition-all shadow-xs"
                >
                  <UserIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && session?.user && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-cream-300 bg-white p-2 shadow-spice-md animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="border-b border-cream-200 px-3 py-2">
                    <p className="text-xs font-bold text-spice-dark truncate font-serif">
                      {session.user.name || "Spice Member"}
                    </p>
                    <p className="text-[11px] text-spice-muted truncate">{session.user.email}</p>
                    <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      role === "ADMIN" ? "bg-turmeric-100 text-turmeric-800" : "bg-secondary-100 text-secondary-800"
                    }`}>
                      {role === "ADMIN" ? "👑 Admin" : "🌿 Customer"}
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs">
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-spice-dark hover:bg-cream-100 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-spice-muted" />
                      <span>My Profile & Addresses</span>
                    </Link>

                    {role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-spice-dark hover:bg-cream-100 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="font-bold text-primary">Admin Dashboard</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-cream-200 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={toggleDrawer}
              className="flex items-center gap-2.5 rounded-full bg-primary px-3.5 sm:px-4 py-2 text-white shadow-spice-sm hover:bg-primary-600 hover:shadow-saffron-glow transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-primary shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold font-display">
                Basket
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-300 bg-[#FAF7F2] px-4 py-5 space-y-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-spice-dark hover:text-primary border-b border-cream-200/60"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 flex items-center justify-between text-xs text-spice-muted">
            {session?.user ? (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold text-primary"
              >
                Go to Account ({session.user.name})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold text-primary"
              >
                Sign In to Your Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
