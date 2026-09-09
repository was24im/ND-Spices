"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  RotateCcw,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Customer Relationship Management (CRM)
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {customers.length} Registered Connoisseurs
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            View customer profiles, order frequencies, lifetime harvest values, and shipping locations.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Refresh Customers</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
        />
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading customer directory...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <Users className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No customers found</h3>
          <p className="text-xs text-muted-foreground">
            No registered users match your search parameters.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300 bg-white overflow-hidden shadow-spice-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Total Orders</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-cinnamon-100 text-cinnamon font-bold flex items-center justify-center text-xs">
                          {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal">{c.name || "Spice Customer"}</p>
                          {c.addresses?.[0] && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5 text-cinnamon" />
                              {c.addresses[0].city}, {c.addresses[0].state}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-charcoal font-medium">{c.email}</p>
                      <p className="text-[10px] text-muted-foreground">{c.phone || "No phone provided"}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          c.role === "ADMIN"
                            ? "bg-cinnamon-100 text-cinnamon-800 border border-cinnamon-200"
                            : "bg-cream-200 text-charcoal border border-cream-300"
                        }`}
                      >
                        {c.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-charcoal">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-0.5 text-xs">
                        <ShoppingBag className="h-3 w-3 text-cinnamon" />
                        {c.totalOrders}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-charcoal font-display">
                      {formatPrice(c.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
