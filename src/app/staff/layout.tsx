"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Users,
  Receipt,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";

const STAFF_NAV_ITEMS = [
  { href: "/staff/crm", label: "CRM & Leads Pipeline", icon: Users },
  { href: "/staff/billing", label: "Billing & Invoices", icon: Receipt },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If on /staff/login, render without sidebar layout
  if (pathname === "/staff/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between bg-charcoal text-white px-4 py-3 border-b border-charcoal-700 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1 rounded-lg hover:bg-white/10"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg font-bold">ND Spices</span>
            <span className="rounded bg-cardamom px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
              Staff Portal
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-cream-200 hover:text-white flex items-center gap-1"
        >
          <Store className="h-4 w-4" />
          <span>Live Store</span>
        </Link>
      </header>

      {/* Staff Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E1E1E] text-cream-100 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-white">ND Spices</span>
                <span className="rounded bg-cardamom px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                  Staff
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                CRM &amp; Billing Terminal
              </p>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 rounded-lg text-cream-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {STAFF_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-cardamom text-white shadow-spice-sm"
                      : "text-cream-200/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Staff Profile */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-8 w-8 rounded-full bg-cardamom text-white font-bold flex items-center justify-center text-xs">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {session?.user?.name || "Staff Representative"}
              </p>
              <p className="text-[10px] text-cream-300/60 truncate">
                {session?.user?.email || "staff@ndspices.com"}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-cream-300 hover:text-white transition-colors"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Store</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/staff/login" })}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}
