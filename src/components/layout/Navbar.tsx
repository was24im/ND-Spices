"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useTranslation } from "@/store/useLanguageStore";
import { LiveSearchModal } from "../search/LiveSearchModal";
import { Logo } from "../ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { isSuperAdmin } from "@/lib/auth";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, isHindi } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { toggleDrawer, getTotalItems: getCartCount } = useCartStore();
  const { getTotalItems: getWishlistCount } = useWishlistStore();

  const totalCartCount = getCartCount();
  const totalWishlistCount = getWishlistCount();

  const role = (session?.user as any)?.role || "USER";
  const userIsAdmin = isSuperAdmin(role);

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
    { href: "/", label: t("nav.home"), isActive: pathname === "/" },
    { href: "/#origins", label: isHindi ? "उत्पत्ति व स्रोत" : "Origins", isActive: false },
    { href: "/products", label: isHindi ? "मसाले" : "Spices", isActive: pathname.startsWith("/products") },
    { href: "/#contact", label: isHindi ? "संपर्क" : "Contact", isActive: false },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-[#E8E1DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu trigger + Logo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-[#2B140E] hover:bg-[#FAF8F6] rounded-lg focus-visible:outline-2 focus-visible:outline-[#3D1E16]"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Logo size="sm" href="/" />
            </div>

            {/* Minimal Single-Row Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.isActive ? "page" : undefined}
                  className={`text-sm transition-colors py-1 ${
                    link.isActive
                      ? "text-[#2B140E] font-semibold border-b-2 border-[#3D1E16]"
                      : "text-[#6E5A54] hover:text-[#2B140E] font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Minimal Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block">
                <LanguageSwitcher variant="compact" />
              </div>

              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-[#6E5A54] hover:text-[#2B140E] hover:bg-[#FAF8F6] rounded-lg transition-colors"
                aria-label={t("nav.search")}
              >
                <Search className="h-4 w-4" />
              </button>

              {/* User Menu */}
              <div className="relative" ref={userDropdownRef}>
                {session?.user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E1DD] bg-[#FAF8F6] text-xs font-semibold text-[#2B140E] hover:border-[#3D1E16] transition-colors"
                    aria-label="User menu"
                    aria-expanded={userDropdownOpen}
                  >
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#E8E1DD] bg-white hover:bg-[#FAF8F6] px-3 py-1.5 text-xs font-medium text-[#2B140E] transition-colors"
                  >
                    <span>{t("nav.signIn")}</span>
                  </Link>
                )}

                {userDropdownOpen && session?.user && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E8E1DD] bg-white p-1.5 shadow-spice-md z-50">
                    <div className="border-b border-[#E8E1DD] px-3 py-2">
                      <p className="text-xs font-semibold text-[#2B140E] truncate">
                        {session.user.name || "Member"}
                      </p>
                      <p className="text-[11px] text-[#6E5A54] truncate">{session.user.email}</p>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs">
                      {userIsAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-[#3D1E16] hover:bg-[#FAF8F6]"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>{t("nav.adminPortal")}</span>
                        </Link>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#2B140E] hover:bg-[#FAF8F6]"
                      >
                        <UserIcon className="h-4 w-4 text-[#6E5A54]" />
                        <span>{t("nav.myAccount")}</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#2B140E] hover:bg-[#FAF8F6]"
                      >
                        <ShoppingBag className="h-4 w-4 text-[#6E5A54]" />
                        <span>{t("nav.orderHistory")}</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#2B140E] hover:bg-[#FAF8F6]"
                      >
                        <Heart className="h-4 w-4 text-[#6E5A54]" />
                        <span>{t("nav.wishlist")} ({totalWishlistCount})</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#E8E1DD] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut({ callbackUrl: "/login" });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#3D1E16] hover:bg-[#FAF8F6]"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("nav.signOut")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimal Basket Trigger */}
              <button
                type="button"
                onClick={toggleDrawer}
                className="flex items-center gap-2 rounded-lg bg-[#3D1E16] px-3 py-1.5 text-white hover:bg-[#2B140E] transition-colors"
                aria-label="Shopping Basket"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {totalCartCount > 0 ? totalCartCount : t("nav.basket")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E1DD] bg-white px-4 py-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1DD]">
              <span className="text-xs text-[#6E5A54]">
                {isHindi ? "भाषा चुनें" : "Language"}
              </span>
              <LanguageSwitcher variant="compact" />
            </div>

            <nav className="space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={link.isActive ? "page" : undefined}
                  className={`block py-2 text-sm ${
                    link.isActive
                      ? "font-semibold text-[#2B140E]"
                      : "text-[#6E5A54] hover:text-[#2B140E]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#E8E1DD] text-xs">
              {session?.user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-[#3D1E16]"
                >
                  {t("nav.myAccount")} ({session.user.name})
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-[#3D1E16]"
                >
                  {t("nav.signIn")}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <LiveSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
