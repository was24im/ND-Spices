"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, ToastItem } from "@/store/useToastStore";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-[#3D1E16] flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 text-[#3D1E16] flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-4 w-4 text-[#3D1E16] flex-shrink-0 mt-0.5" />,
    info: <Info className="h-4 w-4 text-[#3D1E16] flex-shrink-0 mt-0.5" />,
  };

  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#E8E1DD] bg-white p-3.5 shadow-spice-md">
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-[#2B140E]">{toast.title}</h4>
        {toast.message && <p className="text-xs text-[#6E5A54] mt-0.5 leading-snug">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded text-[#6E5A54] hover:text-[#2B140E]"
        aria-label="Close notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
