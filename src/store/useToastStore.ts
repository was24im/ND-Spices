import { create } from "zustand";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (
    titleOrToast: string | Omit<ToastItem, "id">,
    type?: "success" | "error" | "info" | "warning",
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (titleOrToast, type = "info", duration = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    let newToast: ToastItem;

    if (typeof titleOrToast === "string") {
      newToast = { id, title: titleOrToast, type, duration };
    } else {
      newToast = { ...titleOrToast, id, duration: titleOrToast.duration || 3500 };
    }

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, newToast.duration);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
