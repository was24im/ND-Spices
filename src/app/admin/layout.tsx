"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Tag,
  Users,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Palette,
  Image as ImageIcon,
  Receipt,
  Star,
  Settings,
  History,
  Sparkles,
  FileEdit,
} from "lucide-react";

const NAV_GROUPS = [
  {
    group: "Core Dashboard",
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }],
  },
  {
    group: "Website Customization",
    items: [
      { href: "/admin/customization/content", label: "Homepage CMS Content", icon: FileEdit },
      { href: "/admin/customization/design", label: "Theme & Branding Design", icon: Palette },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    group: "Store Catalog & Stock",
    items: [
      { href: "/admin/products", label: "Products & Variants", icon: Package },
      { href: "/admin/inventory", label: "Live Stock Inventory", icon: Boxes },
    ],
  },
  {
    group: "Sales & Operations",
    items: [
      { href: "/admin/orders", label: "Orders Processing", icon: ShoppingBag },
      { href: "/admin/crm", label: "CRM & B2B Leads", icon: Users },
      { href: "/admin/billing", label: "Billing & Invoices", icon: Receipt },
      { href: "/admin/coupons", label: "Coupons & Promos", icon: Tag },
      { href: "/admin/reviews", label: "Review Moderation", icon: Star },
    ],
  },
  {
    group: "Administration & Audit",
    items: [
      { href: "/admin/customers", label: "Customer Accounts", icon: Users },
      { href: "/admin/settings", label: "Website Settings", icon: Settings },
      { href: "/admin/audit-logs", label: "Audit Log Trail", icon: History },
    ],
  },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
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
            <span className="rounded bg-cinnamon px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
              Super Admin
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

      {/* Super Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal text-cream-100 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="overflow-y-auto flex-1 scrollbar-none">
          {/* Brand Header */}
          <div className="p-5 border-b border-charcoal-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-white tracking-wide">
                  ND Spices
                </span>
                <span className="rounded bg-cinnamon px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Full Control Management Console
              </p>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 rounded-lg text-cream-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <div className="p-3 space-y-4">
            {NAV_GROUPS.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block">
                  {grp.group}
                </span>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-cinnamon text-white shadow-spice-sm"
                          : "text-cream-200/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-charcoal-800 space-y-2 bg-[#171717]">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="h-8 w-8 rounded-full bg-turmeric text-charcoal font-bold flex items-center justify-center text-xs">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {session?.user?.name || "Super Administrator"}
              </p>
              <p className="text-[10px] text-cream-300/60 truncate">
                {session?.user?.email || "admin@ndspices.com"}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-charcoal-800 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-cream-300 hover:text-white transition-colors"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Live Store</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}
