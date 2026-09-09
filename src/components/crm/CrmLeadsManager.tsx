"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Building,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  X,
  UserCheck,
  TrendingUp,
  Tag,
  Trash2,
  DollarSign,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice } from "@/lib/utils";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL_SENT" | "CONVERTED" | "LOST";
  spiceInterest?: string | null;
  estimatedValue?: number | null;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string; email: string } | null;
  notes: {
    id: string;
    note: string;
    createdAt: string;
    author: { id: string; name: string; role: string };
  }[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLUMNS = [
  { key: "NEW", label: "New Inquiries", color: "border-blue-500 bg-blue-50/40 text-blue-800" },
  { key: "CONTACTED", label: "Contacted / Follow-up", color: "border-amber-500 bg-amber-50/40 text-amber-800" },
  { key: "QUALIFIED", label: "Qualified B2B", color: "border-purple-500 bg-purple-50/40 text-purple-800" },
  { key: "PROPOSAL_SENT", label: "Proposal / Samples Sent", color: "border-indigo-500 bg-indigo-50/40 text-indigo-800" },
  { key: "CONVERTED", label: "Won & Converted", color: "border-emerald-500 bg-emerald-50/40 text-emerald-800" },
  { key: "LOST", label: "Closed / Lost", color: "border-zinc-400 bg-zinc-50/40 text-zinc-700" },
];

export default function CrmLeadsManager({
  userRole = "STAFF",
  portalTitle = "CRM Leads Pipeline",
}: {
  userRole?: "SUPER_ADMIN" | "STAFF" | "ADMIN";
  portalTitle?: string;
}) {
  const { addToast } = useToastStore();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // Lead Detail / Notes Modal
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Create Lead Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website Inquiry",
    status: "NEW" as any,
    spiceInterest: "Bulk Single-Origin Spices",
    estimatedValue: 25000,
    assignedToId: "",
    initialNote: "",
  });
  const [submittingLead, setSubmittingLead] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/crm/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setStaffMembers(data.staffMembers || []);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);

    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create lead");
      }

      addToast(`Lead for "${createForm.name}" created successfully!`, "success");
      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "Website Inquiry",
        status: "NEW",
        spiceInterest: "Bulk Single-Origin Spices",
        estimatedValue: 25000,
        assignedToId: "",
        initialNote: "",
      });
      fetchLeads();
    } catch (err: any) {
      addToast(err.message || "Failed to create lead", "error");
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast(`Lead status updated to ${newStatus}`, "success");
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      addToast(err.message || "Failed to update lead", "error");
    }
  };

  const handleAssignStaff = async (leadId: string, assignedToId: string) => {
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, assignedToId: assignedToId || null }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Staff assigned successfully.", "success");
      fetchLeads();
    } catch (err: any) {
      addToast(err.message || "Failed to assign staff", "error");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    setSavingNote(true);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          note: newNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Follow-up note logged.", "success");
      setNewNote("");
      setSelectedLead(data.lead);
      fetchLeads();
    } catch (err: any) {
      addToast(err.message || "Failed to add note", "error");
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Permanently delete lead "${name}"?`)) return;

    try {
      const res = await fetch(`/api/crm/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast(`Lead "${name}" deleted.`, "info");
        setSelectedLead(null);
        fetchLeads();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to delete lead", "error");
    }
  };

  // Metrics
  const totalPipelineValue = leads.reduce(
    (sum, l) => sum + (Number(l.estimatedValue) || 0),
    0
  );
  const convertedCount = leads.filter((l) => l.status === "CONVERTED").length;
  const isSuperAdminUser = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.spiceInterest && l.spiceInterest.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeFilter === "ALL") return true;
    return l.status === activeFilter;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              {portalTitle}
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {leads.length} Leads
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage spice wholesale inquiries, culinary chef relations, and follow-up notes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Lead
        </button>
      </div>

      {/* KPI Pipeline Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pipeline Value</span>
            <TrendingUp className="h-4 w-4 text-cardamom" />
          </div>
          <p className="font-serif text-2xl font-extrabold text-charcoal font-display">
            {formatPrice(totalPipelineValue)}
          </p>
          <span className="text-[11px] text-muted-foreground">Across all deal stages</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Deals</span>
            <Users className="h-4 w-4 text-turmeric-700" />
          </div>
          <p className="font-serif text-2xl font-extrabold text-charcoal font-display">
            {leads.filter((l) => l.status !== "LOST" && l.status !== "CONVERTED").length} In Progress
          </p>
          <span className="text-[11px] text-muted-foreground">Active culinary conversations</span>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Converted Wins</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-extrabold text-emerald-700 font-display">
            {convertedCount} Accounts
          </p>
          <span className="text-[11px] text-muted-foreground">Successfully closed</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name, email, restaurant/company, or spice interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === "ALL"
                ? "bg-charcoal text-white shadow-spice-sm"
                : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon"
            }`}
          >
            All Leads
          </button>
          {STATUS_COLUMNS.map((col) => (
            <button
              key={col.key}
              onClick={() => setActiveFilter(col.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === col.key
                  ? "bg-charcoal text-white shadow-spice-sm"
                  : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon"
              }`}
            >
              {col.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading CRM pipeline...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <Users className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No leads found</h3>
          <p className="text-xs text-muted-foreground">
            No inquiries match your filter or search query.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300 bg-white overflow-hidden shadow-spice-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Lead Contact &amp; Company</th>
                  <th className="py-3 px-4">Spice Interest</th>
                  <th className="py-3 px-4">Est. Value</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Assigned Representative</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal font-serif">{lead.name}</span>
                          {lead.company && (
                            <span className="rounded bg-cream-200 text-charcoal px-2 py-0.5 text-[10px] font-semibold">
                              {lead.company}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {lead.email} {lead.phone && `• ${lead.phone}`}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {lead.spiceInterest || "General Inquiry"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-charcoal font-display">
                      {lead.estimatedValue ? formatPrice(Number(lead.estimatedValue)) : "—"}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className="rounded-lg border border-cream-300 bg-white px-2.5 py-1 text-xs font-bold text-charcoal focus:outline-none"
                      >
                        {STATUS_COLUMNS.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      {isSuperAdminUser ? (
                        <select
                          value={lead.assignedToId || ""}
                          onChange={(e) => handleAssignStaff(lead.id, e.target.value)}
                          className="rounded-lg border border-cream-300 bg-white px-2.5 py-1 text-[11px] text-charcoal focus:outline-none"
                        >
                          <option value="">Unassigned</option>
                          {staffMembers.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name} ({staff.role})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs font-medium text-charcoal">
                          {lead.assignedTo?.name || "Unassigned"}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="inline-flex items-center gap-1 rounded-lg bg-charcoal text-white px-2.5 py-1 text-xs font-bold hover:bg-charcoal/80 shadow-spice-sm"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>Notes ({lead.notes?.length || 0})</span>
                        </button>
                        {isSuperAdminUser && (
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Notes / Follow-up Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-lg space-y-6 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-cream-200 text-charcoal text-[10px] font-bold px-3 py-1">
                Lead Activity &amp; Notes
              </span>
              <h3 className="font-serif text-xl font-extrabold text-charcoal mt-2">
                {selectedLead.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedLead.company && `${selectedLead.company} • `}
                {selectedLead.email} • {selectedLead.phone || "No phone"}
              </p>
            </div>

            {/* Note Logging Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <label className="block text-xs font-bold text-charcoal">
                Log Follow-up / Client Update
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Sent sample 100g Saffron batch; scheduled call for Friday..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={savingNote}
                  className="rounded-xl bg-cinnamon text-white px-4 py-2.5 text-xs font-bold hover:bg-cinnamon-600 disabled:opacity-50"
                >
                  {savingNote ? "Saving..." : "Add Note"}
                </button>
              </div>
            </form>

            {/* Notes Timeline */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 divide-y divide-cream-100">
              <h4 className="font-serif text-xs font-bold text-charcoal uppercase tracking-wider">
                Follow-up History
              </h4>
              {selectedLead.notes?.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No notes logged yet for this lead.
                </p>
              ) : (
                selectedLead.notes.map((note) => (
                  <div key={note.id} className="pt-2 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                      <span className="font-bold text-charcoal">{note.author?.name}</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-charcoal bg-cream-100/60 p-2.5 rounded-xl border border-cream-200">
                      {note.note}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-lg space-y-6">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-cinnamon-100 text-cinnamon text-[10px] font-bold px-3 py-1">
                New Sales Opportunity
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-charcoal mt-2">
                Register Lead
              </h2>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Chef / Buyer Name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@restaurant.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98..."
                    value={createForm.phone}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Company / Hotel / Bistro
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ITC Grand, Chai Point"
                    value={createForm.company}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Spice Interest / Product Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kashmiri Saffron 1kg, 8mm Green Cardamom Bulk"
                  value={createForm.spiceInterest}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, spiceInterest: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Estimated Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.estimatedValue}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        estimatedValue: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Lead Source
                  </label>
                  <select
                    value={createForm.source}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, source: e.target.value }))}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  >
                    <option value="Website Inquiry">Website Inquiry</option>
                    <option value="WhatsApp Direct">WhatsApp Direct</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Chef Referral">Chef Referral</option>
                    <option value="Exhibition / Expo">Exhibition / Expo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Initial Call Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Initial requirements or sample request notes..."
                  value={createForm.initialNote}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, initialNote: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-cream-300 px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="rounded-xl bg-cinnamon px-6 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm"
                >
                  {submittingLead ? "Creating..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
