"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, ToastItem } from "@/store/useToastStore";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-cardamom flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-cinnamon flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-turmeric-700 flex-shrink-0" />,
    info: <Info className="h-5 w-5 text-primary flex-shrink-0" />,
  };

  const borders = {
    success: "border-cardamom-200 bg-white",
    error: "border-cinnamon-200 bg-white",
    warning: "border-turmeric-200 bg-white",
    info: "border-cream-300 bg-white",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-spice-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal">{toast.title}</h4>
        {toast.message && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-muted-foreground hover:text-charcoal hover:bg-cream-100 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
