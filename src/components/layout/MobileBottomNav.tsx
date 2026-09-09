"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, Grid, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { LiveSearchModal } from "../search/LiveSearchModal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const { toggleDrawer, getTotalItems: getCartCount } = useCartStore();
  const { getTotalItems: getWishlistCount } = useWishlistStore();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-cream-300 bg-[#FDFBF7]/95 backdrop-blur-md px-2 py-2 shadow-2xl safe-area-pb">
        <div className="grid grid-cols-5 items-center text-center">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive("/") ? "text-cinnamon font-bold" : "text-muted-foreground hover:text-charcoal"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 font-medium">Home</span>
          </Link>

          {/* 2. Instant Search */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-muted-foreground hover:text-charcoal transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 font-medium">Search</span>
          </button>

          {/* 3. Catalog / Categories */}
          <Link
            href="/products"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname.startsWith("/products") ? "text-cinnamon font-bold" : "text-muted-foreground hover:text-charcoal"
            }`}
          >
            <Grid className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 font-medium">Spices</span>
          </Link>

          {/* 4. Wishlist */}
          <Link
            href="/wishlist"
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              isActive("/wishlist") ? "text-cinnamon font-bold" : "text-muted-foreground hover:text-charcoal"
            }`}
          >
            <div className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-cinnamon text-[9px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
          </Link>

          {/* 5. Cart / Profile */}
          <button
            onClick={toggleDrawer}
            className="relative flex flex-col items-center justify-center py-1 text-cinnamon font-bold transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Basket</span>
          </button>
        </div>
      </nav>

      {/* Live Search Modal instance */}
      <LiveSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
