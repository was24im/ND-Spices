"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface AuditLog {
  id: string;
  userId: string | null;
  userName: string;
  action: string;
  module: string;
  details: string | null;
  previousValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const modules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean)));

  const filteredLogs = logs.filter((log) => {
    const matchesQuery =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule = selectedModule === "ALL" || log.module === selectedModule;

    return matchesQuery && matchesModule;
  });

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getModuleBadgeColor = (module: string) => {
    switch (module.toUpperCase()) {
      case "CMS":
      case "HOMEPAGE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "THEME":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "CRM":
      case "LEADS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "BILLING":
      case "INVOICES":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "PRODUCTS":
      case "INVENTORY":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "SETTINGS":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "REVIEWS":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "MEDIA":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-cream-200 text-charcoal border-cream-300";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cream-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cinnamon text-sm font-semibold mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Compliance & Security</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal flex items-center gap-2">
            <History className="h-7 w-7 text-cinnamon" />
            Admin Action Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Immutable tracking of Super Admin mutations, price updates, CMS modifications, CRM changes, and invoices.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cream-100 text-charcoal border border-cream-300 rounded-lg text-sm font-semibold hover:bg-cream-200 transition-colors shadow-sm self-start md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by admin name, action, target item, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinnamon/20 focus:border-cinnamon"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinnamon/20 text-charcoal font-medium"
          >
            <option value="ALL">All Modules ({logs.length})</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-cinnamon" />
            <p className="font-medium text-sm">Loading security audit trail from Neon PostgreSQL...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <History className="h-12 w-12 text-cream-400 mx-auto mb-3" />
            <p className="font-semibold text-charcoal">No audit logs found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Admin operations (price changes, CMS updates, invoices, leads) will be recorded automatically here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-cream-100/70 border-b border-cream-200 text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Admin User</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-4">Action & Details</th>
                  <th className="py-3.5 px-4">Diff Snapshot</th>
                  <th className="py-3.5 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-medium text-charcoal">
                        <Clock className="h-3.5 w-3.5 text-cinnamon" />
                        <span>{formatDateTime(log.createdAt)}</span>
                      </div>
                      {log.ipAddress && (
                        <span className="text-[10px] text-muted-foreground/70 font-mono block mt-0.5">
                          IP: {log.ipAddress}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-bold">
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-charcoal">{log.userName}</p>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {log.userId ? log.userId.slice(0, 8) + "..." : "System"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${getModuleBadgeColor(
                          log.module
                        )}`}
                      >
                        {log.module}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-charcoal text-xs">{log.action}</p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{log.details}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono">
                      {log.previousValue || log.newValue ? (
                        <div className="flex items-center gap-1.5 text-[11px] max-w-xs truncate">
                          {log.previousValue && (
                            <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                              {log.previousValue}
                            </span>
                          )}
                          {log.previousValue && log.newValue && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                          )}
                          {log.newValue && (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                              {log.newValue}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 text-[11px] italic">No diff data</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal rounded border border-cream-300 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-cream-300 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cinnamon" />
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  Audit Record Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-muted-foreground hover:text-charcoal text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-cream-50 p-4 rounded-xl border border-cream-200">
              <div>
                <span className="text-muted-foreground font-medium block">Timestamp</span>
                <span className="font-bold text-charcoal">{formatDateTime(selectedLog.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Admin User</span>
                <span className="font-bold text-charcoal">{selectedLog.userName}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Module</span>
                <span className="font-bold text-cinnamon">{selectedLog.module}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Action</span>
                <span className="font-bold text-charcoal">{selectedLog.action}</span>
              </div>
              {selectedLog.details && (
                <div className="col-span-2 pt-2 border-t border-cream-200">
                  <span className="text-muted-foreground font-medium block">Details</span>
                  <p className="font-medium text-charcoal mt-0.5">{selectedLog.details}</p>
                </div>
              )}
            </div>

            {/* Previous vs New Value Inspection */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                State Mutation Diffs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-red-700 block">Previous State</span>
                  <pre className="text-xs font-mono text-charcoal bg-white p-2.5 rounded-lg border border-red-100 overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {selectedLog.previousValue || "(None / Initial)"}
                  </pre>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700 block">New State</span>
                  <pre className="text-xs font-mono text-charcoal bg-white p-2.5 rounded-lg border border-emerald-100 overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {selectedLog.newValue || "(None / Deleted)"}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-cream-200">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-charcoal text-white rounded-lg text-xs font-bold hover:bg-charcoal-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
