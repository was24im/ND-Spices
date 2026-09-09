import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = (session.user as any)?.role;
  if (role !== "ADMIN") {
    redirect("/account?error=unauthorized");
  }

  // Load real metrics from Neon PostgreSQL
  let productsCount = 0;
  let categoriesCount = 0;
  let usersCount = 0;
  let variants: any[] = [];

  try {
    const [pCount, cCount, uCount, vars] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.productVariant.findMany({
        take: 6,
        include: { product: true },
        orderBy: { stockQuantity: "asc" },
      }),
    ]);
    productsCount = pCount;
    categoriesCount = cCount;
    usersCount = uCount;
    variants = vars;
  } catch (error) {
    console.error("Admin metrics load error:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-spice-dark text-white p-6 sm:p-8 shadow-spice-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-spice-charcoal">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-turmeric-300/20 text-turmeric-300 border border-turmeric-400/30 px-3 py-0.5 text-xs font-bold">
            <Sparkles className="h-3 w-3" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold">
            ND Spices Admin Portal
          </h1>
          <p className="text-xs text-cream-400">
            Monitoring inventory, harvests, customer orders, and Neon PostgreSQL database metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>View Public Store</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-spice-sm">
          <div className="flex items-center justify-between text-spice-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Revenue</span>
            <div className="h-9 w-9 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display text-2xl font-black text-spice-dark">₹48,920</p>
          <span className="text-[11px] text-secondary-600 font-semibold">+18% from last month</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-spice-sm">
          <div className="flex items-center justify-between text-spice-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Spices</span>
            <div className="h-9 w-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display text-2xl font-black text-spice-dark">{productsCount} Products</p>
          <span className="text-[11px] text-spice-muted">{categoriesCount} Categories in Neon DB</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-spice-sm">
          <div className="flex items-center justify-between text-spice-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <div className="h-9 w-9 rounded-xl bg-cinnamon-100 text-cinnamon-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display text-2xl font-black text-spice-dark">{usersCount} Members</p>
          <span className="text-[11px] text-secondary-600 font-semibold">Active Spice Guild</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-spice-sm">
          <div className="flex items-center justify-between text-spice-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fulfillment Status</span>
            <div className="h-9 w-9 rounded-xl bg-turmeric-100 text-turmeric-700 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display text-2xl font-black text-spice-dark">99.4%</p>
          <span className="text-[11px] text-secondary-600 font-semibold">24h Express Dispatch</span>
        </div>
      </div>

      {/* Inventory & Stock Table */}
      <div className="rounded-3xl border border-cream-300 bg-white p-6 shadow-spice-sm space-y-4">
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-spice-dark">
              Warehouse Inventory & SKU Stock
            </h2>
            <p className="text-xs text-spice-muted">
              Live stock levels of single-origin spice package weights.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cream-200 text-spice-muted uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Package Weight</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Stock Units</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-spice-dark font-serif">
                    {v.product?.name || "Spice Product"}
                  </td>
                  <td className="py-3 px-3 text-spice-muted font-mono">{v.sku}</td>
                  <td className="py-3 px-3 text-spice-dark font-medium">{v.weight}</td>
                  <td className="py-3 px-3 font-bold text-spice-dark font-display">
                    {formatPrice(v.price)}
                  </td>
                  <td className="py-3 px-3 font-bold text-spice-dark">{v.stockQuantity} units</td>
                  <td className="py-3 px-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      v.stockQuantity > 20
                        ? "bg-secondary-100 text-secondary-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {v.stockQuantity > 20 ? "In Stock" : "Low Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
