"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Edit,
  X,
  Package,
  RotateCcw,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice } from "@/lib/utils";

type StatusFilter = "ALL" | "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export default function AdminOrdersPage() {
  const { addToast } = useToastStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("PROCESSING");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("BlueDart Express");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(`ND-BLD${order.orderNumber.replace(/[^0-9]/g, "")}`);
    setCourierName("BlueDart Express");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          orderStatus: newStatus,
          trackingNumber,
          courierName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      addToast(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`, "success");
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      addToast(err.message || "Failed to update order status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Farm Packaged
          </span>
        );
      case "PLACED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-0.5 text-[10px] font-bold text-charcoal border border-cream-400">
            <Package className="h-3 w-3 text-cinnamon" />
            New Order
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return <span className="text-[10px] text-muted-foreground">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return order.orderStatus === statusFilter;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Orders Fulfillment &amp; Processing
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {orders.length} Total Orders
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track customer harvests, assign courier manifests, and update fulfillment stages.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(["ALL", "PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as StatusFilter[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === filter
                  ? "bg-charcoal text-white shadow-spice-sm"
                  : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon hover:text-cinnamon"
              }`}
            >
              {filter === "ALL" ? "All Orders" : filter.charAt(0) + filter.slice(1).toLowerCase()}
              {filter === "ALL" && ` (${orders.length})`}
            </button>
          )
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by Order # (e.g. ND-2024-...), Customer Name, or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Fetching customer order database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <ShoppingBag className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No matching orders</h3>
          <p className="text-xs text-muted-foreground">
            No customer spice orders match the selected search query or status filter.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300 bg-white overflow-hidden shadow-spice-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Harvest Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-center">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredOrders.map((order) => {
                  const itemsCount = order.orderItems?.reduce(
                    (sum: number, i: any) => sum + i.quantity,
                    0
                  );

                  return (
                    <tr key={order.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          target="_blank"
                          className="hover:text-cinnamon transition-colors"
                        >
                          #{order.orderNumber}
                        </Link>
                        <span className="block text-[10px] text-muted-foreground font-sans font-normal">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-charcoal">
                          {order.user?.name || "Direct Guest Customer"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{order.user?.email}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-charcoal font-medium">
                          {order.orderItems?.[0]?.productVariant?.product?.name || "Spice Items"}
                          {order.orderItems?.length > 1 && (
                            <span className="text-muted-foreground text-[10px]">
                              {" "}
                              +{order.orderItems.length - 1} more
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {itemsCount} units total
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-charcoal font-display">
                        {formatPrice(Number(order.finalAmount))}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold text-charcoal block">
                          {order.paymentMethod === "RAZORPAY" ? "Online (Razorpay)" : "Cash on Delivery"}
                        </span>
                        <span
                          className={`text-[9px] font-bold ${
                            order.paymentStatus === "COMPLETED"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(order.orderStatus)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/orders/${order.orderNumber}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-cream-300 text-muted-foreground hover:text-charcoal hover:bg-cream-100"
                            title="View customer invoice & live tracker"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="inline-flex items-center gap-1 rounded-lg bg-charcoal text-white px-2.5 py-1 text-xs font-bold hover:bg-charcoal/80 shadow-spice-sm"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Update</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-lg space-y-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-cream-200 text-charcoal text-[10px] font-bold px-3 py-1">
                Fulfillment Stage
              </span>
              <h3 className="font-serif text-xl font-extrabold text-charcoal mt-2">
                Update Order #{selectedOrder.orderNumber}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Customer: <strong>{selectedOrder.user?.name || selectedOrder.user?.email}</strong>
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Select Order Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-bold"
                >
                  <option value="PLACED">Placed (Harvest Queued)</option>
                  <option value="PROCESSING">Processing (Farm Packaged &amp; Sealed)</option>
                  <option value="SHIPPED">Shipped (Dispatched to Courier)</option>
                  <option value="DELIVERED">Delivered (Completed)</option>
                  <option value="CANCELLED">Cancelled &amp; Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. BlueDart Express, Delhivery, Speed Post"
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Tracking / AWB Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="ND-BLD123456"
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-cream-300 px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-cinnamon px-6 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm"
                >
                  {updating ? "Updating..." : "Save Status & Notify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
