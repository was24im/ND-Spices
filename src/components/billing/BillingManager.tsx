"use client";

import React, { useState, useEffect } from "react";
import {
  Receipt,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileText,
  Trash2,
  Download,
  Building,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice } from "@/lib/utils";

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  billingAddress: string;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";
  dueDate?: string | null;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  createdBy?: { id: string; name: string; email: string } | null;
}

export default function BillingManager({
  userRole = "STAFF",
  portalTitle = "Commercial Invoicing & Billing Records",
}: {
  userRole?: "SUPER_ADMIN" | "STAFF" | "ADMIN";
  portalTitle?: string;
}) {
  const { addToast } = useToastStore();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // View / Print Invoice Modal
  const [activeInvoice, setActiveInvoice] = useState<InvoiceRecord | null>(null);

  // Create Invoice Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    billingAddress: "",
    taxPercent: 5.0,
    discountAmount: 0,
    status: "ISSUED" as any,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paymentMethod: "Bank Transfer (NEFT/RTGS)",
    notes: "Payment due within 30 days of invoice issue date.",
    items: [
      {
        description: "Alleppey Green Cardamom (8mm+ Jumbo Pods) - 5kg Bulk Pack",
        quantity: 1,
        unitPrice: 14000,
      },
    ] as InvoiceItemForm[],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/billing/invoices");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error("Error loading invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/billing/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create invoice");
      }

      addToast(`Invoice ${data.invoice.invoiceNumber} created successfully!`, "success");
      setIsCreateOpen(false);
      setCreateForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        billingAddress: "",
        taxPercent: 5.0,
        discountAmount: 0,
        status: "ISSUED",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        paymentMethod: "Bank Transfer (NEFT/RTGS)",
        notes: "Payment due within 30 days of invoice issue date.",
        items: [
          {
            description: "Alleppey Green Cardamom (8mm+ Jumbo Pods) - 5kg Bulk Pack",
            quantity: 1,
            unitPrice: 14000,
          },
        ],
      });
      fetchInvoices();
    } catch (err: any) {
      addToast(err.message || "Failed to create invoice", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (invoiceId: string, status: string) => {
    try {
      const res = await fetch("/api/billing/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast(`Invoice status updated to ${status}`, "success");
      fetchInvoices();
      if (activeInvoice && activeInvoice.id === invoiceId) {
        setActiveInvoice(data.invoice);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to update status", "error");
    }
  };

  const addItemRow = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "Kashmiri Mongra Saffron (Grade A1) - 50g Wholesale Pack",
          quantity: 1,
          unitPrice: 18000,
        },
      ],
    }));
  };

  const removeItemRow = (idx: number) => {
    if (createForm.items.length <= 1) {
      addToast("Invoice must contain at least 1 item", "warning");
      return;
    }
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx: number, field: keyof InvoiceItemForm, val: any) => {
    setCreateForm((prev) => {
      const updated = [...prev.items];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, items: updated };
    });
  };

  const subtotalCalc = createForm.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const taxCalc = (subtotalCalc * createForm.taxPercent) / 100;
  const grandTotalCalc = Math.max(0, subtotalCalc + taxCalc - createForm.discountAmount);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </span>
        );
      case "ISSUED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" />
            Issued / Pending
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-0.5 text-[10px] font-bold text-charcoal border border-cream-400">
            <FileText className="h-3 w-3 text-cinnamon" />
            Draft
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
        return <span className="text-xs text-muted-foreground">{status}</span>;
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return inv.status === statusFilter;
  });

  const totalBilledValue = invoices
    .filter((i) => i.status !== "CANCELLED")
    .reduce((sum, i) => sum + Number(i.finalAmount), 0);

  const totalPaidValue = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + Number(i.finalAmount), 0);

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              {portalTitle}
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Generate formal GST tax invoices for wholesale restaurants, spice boutiques, and B2B clients.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Generate New Invoice
        </button>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Billed</span>
            <Receipt className="h-4 w-4 text-charcoal" />
          </div>
          <p className="font-serif text-2xl font-extrabold text-charcoal font-display">
            {formatPrice(totalBilledValue)}
          </p>
          <span className="text-[11px] text-muted-foreground">All active commercial invoices</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Collected Revenue</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-extrabold text-emerald-700 font-display">
            {formatPrice(totalPaidValue)}
          </p>
          <span className="text-[11px] text-muted-foreground">Settled via NEFT / RTGS</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Due</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl font-extrabold text-amber-800 font-display">
            {formatPrice(totalBilledValue - totalPaidValue)}
          </p>
          <span className="text-[11px] text-muted-foreground">Pending customer settlements</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Invoice # (e.g. INV-2024-...), Client Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {["ALL", "ISSUED", "PAID", "DRAFT", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-charcoal text-white shadow-spice-sm"
                  : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon"
              }`}
            >
              {st === "ALL" ? "All Invoices" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2 print:hidden">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Fetching invoice records from Neon DB...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3 print:hidden">
          <Receipt className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No invoices found</h3>
          <p className="text-xs text-muted-foreground">
            No billing records match your search filter.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300 bg-white overflow-hidden shadow-spice-sm print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Invoice # &amp; Date</th>
                  <th className="py-3 px-4">Client / Hotel</th>
                  <th className="py-3 px-4">Amount (Incl. GST)</th>
                  <th className="py-3 px-4">Payment Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-charcoal block">
                        #{inv.invoiceNumber}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-charcoal font-serif">{inv.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{inv.customerEmail}</p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-charcoal font-display">
                      {formatPrice(Number(inv.finalAmount))}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString("en-IN")
                        : "Immediate"}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={inv.status}
                        onChange={(e) => handleUpdateStatus(inv.id, e.target.value)}
                        className="rounded-lg border border-cream-300 bg-white px-2 py-1 text-[11px] font-bold text-charcoal focus:outline-none"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="ISSUED">Issued / Due</option>
                        <option value="PAID">Paid</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveInvoice(inv)}
                        className="inline-flex items-center gap-1 rounded-lg bg-charcoal text-white px-3 py-1 text-xs font-bold hover:bg-charcoal/80 shadow-spice-sm"
                      >
                        <Printer className="h-3 w-3" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Print & Preview Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-cream-300 bg-white p-6 sm:p-10 shadow-spice-lg space-y-6 print:border-none print:shadow-none print:m-0 print:p-0">
            {/* Modal Controls (Hide in print) */}
            <div className="flex items-center justify-between border-b border-cream-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-charcoal">
                  Official GST Tax Invoice Preview
                </span>
                {getStatusBadge(activeInvoice.status)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cinnamon px-4 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="p-2 text-muted-foreground hover:text-charcoal rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Official Invoice Body */}
            <div className="space-y-6 text-xs text-charcoal">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-cream-300 pb-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-charcoal">
                    ND SPICES HERITAGE PVT. LTD.
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Single-Origin Spice Estates: Wayanad (Kerala) &amp; Pampore (Kashmir)
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    GSTIN: <strong>32AABCU9603R1ZM</strong> &bull; FSSAI Lic: <strong>11321004000182</strong>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Email: orders@ndspices.com &bull; Phone: +91 98450 12345
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded bg-charcoal text-white font-mono font-bold text-xs px-2.5 py-1">
                    TAX INVOICE
                  </span>
                  <p className="font-mono text-base font-extrabold mt-2 text-charcoal">
                    #{activeInvoice.invoiceNumber}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Date: {new Date(activeInvoice.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  {activeInvoice.dueDate && (
                    <p className="text-[11px] text-muted-foreground font-semibold">
                      Due Date: {new Date(activeInvoice.dueDate).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl bg-cream-100/50 p-4 border border-cream-200">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Billed To (Client / Consignee)
                  </h4>
                  <p className="font-bold text-charcoal text-sm">{activeInvoice.customerName}</p>
                  <p className="text-muted-foreground">{activeInvoice.customerEmail}</p>
                  <p className="text-muted-foreground">{activeInvoice.customerPhone}</p>
                  <p className="text-muted-foreground mt-1 whitespace-pre-line">
                    {activeInvoice.billingAddress}
                  </p>
                </div>

                <div className="rounded-2xl bg-cream-100/50 p-4 border border-cream-200 space-y-1">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Payment &amp; Banking Details
                  </h4>
                  <p><strong>Bank:</strong> HDFC Bank Ltd.</p>
                  <p><strong>Account Name:</strong> ND Spices Heritage Pvt Ltd</p>
                  <p><strong>Account No:</strong> 50200088991122</p>
                  <p><strong>IFSC Code:</strong> HDFC0001234 (Wayanad Branch)</p>
                  <p><strong>Payment Mode:</strong> {activeInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-cream-300 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/80 border-b border-cream-300 text-charcoal uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {activeInvoice.items?.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 text-muted-foreground">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-medium">{item.description}</td>
                        <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-display font-medium">
                          {formatPrice(Number(item.unitPrice))}
                        </td>
                        <td className="py-2.5 px-3 text-right font-display font-bold">
                          {formatPrice(Number(item.totalPrice))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Subtotal:</span>
                    <span className="font-bold font-display text-charcoal">
                      {formatPrice(Number(activeInvoice.subtotal))}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST ({activeInvoice.taxPercent}%):</span>
                    <span className="font-bold font-display text-charcoal">
                      {formatPrice(Number(activeInvoice.taxAmount))}
                    </span>
                  </div>
                  {Number(activeInvoice.discountAmount) > 0 && (
                    <div className="flex justify-between text-cardamom font-medium">
                      <span>Trade Discount:</span>
                      <span className="font-bold font-display">
                        -{formatPrice(Number(activeInvoice.discountAmount))}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-cream-400 pt-2 flex justify-between font-bold text-sm text-charcoal">
                    <span>Grand Total:</span>
                    <span className="font-serif text-base text-cinnamon font-display">
                      {formatPrice(Number(activeInvoice.finalAmount))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Declaration & Signature */}
              <div className="pt-6 border-t border-cream-300 flex justify-between items-end text-[11px] text-muted-foreground">
                <div>
                  <p className="font-bold text-charcoal">Terms &amp; Conditions:</p>
                  <p>1. Goods once sold are certified single-origin and farm sealed.</p>
                  <p>2. Subject to Wayanad, Kerala jurisdiction.</p>
                </div>

                <div className="text-center">
                  <div className="h-12 flex items-end justify-center font-serif italic text-cinnamon text-sm">
                    Mohammed Wasim
                  </div>
                  <div className="w-36 border-t border-cream-400 pt-1 font-bold text-[10px] text-charcoal uppercase">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-lg space-y-6">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-cinnamon-100 text-cinnamon text-[10px] font-bold px-3 py-1">
                B2B &amp; Wholesale
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-charcoal mt-2">
                Generate Commercial Invoice
              </h2>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Client / Establishment Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Imperial Bistro"
                    value={createForm.customerName}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Client Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="accounts@bistro.com"
                    value={createForm.customerEmail}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, customerEmail: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Phone / Contact
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98..."
                    value={createForm.customerPhone}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, customerPhone: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={createForm.dueDate}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, dueDate: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Billing &amp; Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street, Landmark, City, State, GSTIN if applicable..."
                  value={createForm.billingAddress}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, billingAddress: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              {/* Line Items */}
              <div className="border-t border-cream-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xs font-bold text-charcoal uppercase tracking-wider">
                    Invoice Items &amp; Quantity
                  </h4>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="inline-flex items-center gap-1 rounded-lg border border-cream-300 bg-cream-100 px-2.5 py-1 text-xs font-bold text-charcoal hover:bg-cream-200"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                {createForm.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-xl border border-cream-200 bg-cream-50 p-2 text-xs"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Product description"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="flex-1 rounded-lg border border-cream-300 p-1.5 text-xs font-medium"
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-16 rounded-lg border border-cream-300 p-1.5 text-xs text-center font-bold"
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Rate (₹)"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                      className="w-24 rounded-lg border border-cream-300 p-1.5 text-xs font-bold"
                    />
                    <span className="w-24 text-right font-display font-bold text-charcoal">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Summary */}
              <div className="grid grid-cols-2 gap-3 pt-2 bg-cream-100/60 p-3 rounded-2xl border border-cream-200 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={createForm.taxPercent}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        taxPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.discountAmount}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        discountAmount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-bold"
                  />
                </div>

                <div className="col-span-2 pt-2 border-t border-cream-300 flex justify-between font-bold text-sm text-charcoal">
                  <span>Grand Total (Payable):</span>
                  <span className="font-serif text-cinnamon font-display">
                    {formatPrice(grandTotalCalc)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-cream-300 px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-cinnamon px-6 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm"
                >
                  {submitting ? "Generating..." : "Issue Tax Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
