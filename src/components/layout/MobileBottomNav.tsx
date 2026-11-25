"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Grid, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslation } from "@/store/useLanguageStore";
import { LiveSearchModal } from "../search/LiveSearchModal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { isHindi, t } = useTranslation();

  const { toggleDrawer, getTotalItems: getCartCount } = useCartStore();
  const cartCount = getCartCount();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav
        aria-label="Mobile quick actions"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[#E8E1DD] bg-white/95 backdrop-blur-sm px-2 py-1.5"
      >
        <div className="grid grid-cols-4 items-center text-center">
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive("/") ? "text-[#2B140E] font-semibold" : "text-[#6E5A54]"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">{t("nav.home")}</span>
          </Link>

          <Link
            href="/products"
            aria-current={pathname.startsWith("/products") ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname.startsWith("/products") ? "text-[#2B140E] font-semibold" : "text-[#6E5A54]"
            }`}
          >
            <Grid className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">{isHindi ? "मसाले" : "Spices"}</span>
          </Link>

          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-[#6E5A54] hover:text-[#2B140E] transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">{t("nav.search")}</span>
          </button>

          <button
            type="button"
            onClick={toggleDrawer}
            className="relative flex flex-col items-center justify-center py-1 text-[#2B140E] font-medium transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#3D1E16] text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{t("nav.basket")}</span>
          </button>
        </div>
      </nav>

      <LiveSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
