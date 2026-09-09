"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  ChevronDown,
  ArrowRight,
  Leaf,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { AnnouncementBar } from "./AnnouncementBar";
import { LiveSearchModal } from "../search/LiveSearchModal";
import { MOCK_CATEGORIES } from "@/lib/mockData";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { toggleDrawer, getTotalItems: getCartCount } = useCartStore();
  const { getTotalItems: getWishlistCount } = useWishlistStore();

  const totalCartCount = getCartCount();
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

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-cream-300">
        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-charcoal hover:text-cinnamon rounded-lg focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cinnamon via-primary to-cardamom flex items-center justify-center shadow-spice-sm group-hover:scale-105 transition-transform">
                  <span className="text-white font-serif font-black text-xl tracking-tight">ND</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-extrabold text-xl sm:text-2xl text-charcoal tracking-tight leading-none group-hover:text-cinnamon transition-colors">
                    ND Spices
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-cardamom mt-0.5">
                    Pure Heritage Aromatics
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav with Mega-Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Mega-Menu Trigger */}
              <div
                className="relative py-3"
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button className="flex items-center gap-1.5 text-sm font-bold text-charcoal hover:text-cinnamon transition-colors">
                  <span>Explore Harvests</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${megaMenuOpen ? "rotate-180 text-cinnamon" : ""}`} />
                </button>

                {/* Mega-Menu Dropdown Panel */}
                {megaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[760px] rounded-3xl border border-cream-300 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left category list */}
                      <div className="col-span-8 grid grid-cols-2 gap-4">
                        {MOCK_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="group flex gap-3 rounded-2xl p-2.5 hover:bg-cream-100 transition-colors border border-transparent hover:border-cream-300"
                          >
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                              {cat.image && (
                                <Image
                                  src={cat.image}
                                  alt={cat.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              )}
                            </div>
                            <div>
                              <h4 className="font-serif text-sm font-bold text-charcoal group-hover:text-cinnamon transition-colors">
                                {cat.name}
                              </h4>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                                {cat.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Right featured harvest card */}
                      <div className="col-span-4 rounded-2xl bg-gradient-to-br from-cinnamon via-primary to-cardamom p-4 text-white flex flex-col justify-between shadow-spice-sm">
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                            <Sparkles className="h-3 w-3 text-turmeric-300" />
                            Direct Factory Supply
                          </span>
                          <h4 className="font-serif text-base font-bold">
                            Pure Red Chilli &amp; Coriander Powders
                          </h4>
                          <p className="text-xs text-cream-200 leading-relaxed">
                            Stone-ground from high-pungency stemless chillies and bold green coriander seeds of Rajasthan.
                          </p>
                        </div>
                        <Link
                          href="/products/pure-red-chilli-powder"
                          onClick={() => setMegaMenuOpen(false)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-turmeric-300 hover:text-white transition-colors"
                        >
                          <span>Explore Pure Powders</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/products?category=ground-spices"
                className="text-sm font-semibold text-charcoal/90 hover:text-cinnamon transition-colors"
              >
                Pure Powders
              </Link>
              <Link
                href="/products?category=whole-spices"
                className="text-sm font-semibold text-charcoal/90 hover:text-cinnamon transition-colors"
              >
                Whole Spices &amp; Seeds
              </Link>
              <Link
                href="/products?category=heritage-blends"
                className="text-sm font-semibold text-charcoal/90 hover:text-cinnamon transition-colors"
              >
                Masala Blends
              </Link>
              <Link
                href="/products"
                className="text-sm font-semibold text-cinnamon hover:text-cinnamon-700 transition-colors flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5 text-turmeric" />
                <span>All Spices</span>
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              {/* Instant Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-charcoal hover:text-cinnamon hover:bg-cream-200 rounded-full transition-colors flex items-center gap-1.5"
                aria-label="Search spices"
              >
                <Search className="h-5 w-5" />
                <span className="hidden md:inline text-xs font-semibold text-muted-foreground">Search</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-charcoal hover:text-cinnamon hover:bg-cream-200 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cinnamon text-[10px] font-bold text-white shadow-xs">
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
                    <div className="h-8 w-8 rounded-full bg-cinnamon-100 text-cinnamon font-bold text-xs flex items-center justify-center border border-cinnamon-300">
                      {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-full border border-cream-300 bg-white hover:bg-cream-100 px-3.5 py-1.5 text-xs font-bold text-charcoal transition-all shadow-xs"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-cinnamon" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {userDropdownOpen && session?.user && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-cream-300 bg-white p-2 shadow-spice-md animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="border-b border-cream-200 px-3 py-2">
                      <p className="text-xs font-bold text-charcoal truncate font-serif">
                        {session.user.name || "Spice Member"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                      <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        role === "ADMIN" ? "bg-turmeric-100 text-turmeric-800" : "bg-cardamom-100 text-cardamom-800"
                      }`}>
                        {role === "ADMIN" ? "👑 Admin" : "🌿 Customer"}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-cream-100 transition-colors"
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>My Account & Addresses</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-cream-100 transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span>Order History & Invoices</span>
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-charcoal hover:bg-cream-100 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>Saved Wishlist ({totalWishlistCount})</span>
                      </Link>

                      {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-cinnamon hover:bg-cream-100 transition-colors"
                        >
                          <ShieldCheck className="h-4 w-4 text-cinnamon" />
                          <span className="font-bold">Super Admin Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-cream-200 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut({ callbackUrl: "/login" });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-cinnamon hover:bg-cinnamon-50 transition-colors"
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
                className="flex items-center gap-2.5 rounded-full bg-cinnamon px-3.5 sm:px-4 py-2 text-white shadow-spice-sm hover:bg-cinnamon-600 transition-all active:scale-95"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-turmeric text-[10px] font-extrabold text-charcoal shadow-xs">
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-300 bg-[#FDFBF7] px-4 py-5 space-y-3 animate-in slide-in-from-top duration-200">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-charcoal hover:text-cinnamon border-b border-cream-200/60"
            >
              All Single-Origin Spices
            </Link>
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-charcoal hover:text-cinnamon border-b border-cream-200/60"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
              {session?.user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-cinnamon"
                >
                  My Account ({session.user.name})
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-cinnamon"
                >
                  Sign In to ND Spices
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Live Search Modal */}
      <LiveSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
