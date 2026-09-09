import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItemType } from "@/types";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/utils";

interface CartState {
  items: CartItemType[];
  isDrawerOpen: boolean;
  couponCode: string | null;
  discountAmount: number;

  // Actions
  addItem: (item: Omit<CartItemType, "id" | "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getTotalItems: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
  getProgressToFreeShipping: () => { current: number; threshold: number; remaining: number; percentage: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      couponCode: null,
      discountAmount: 0,

      addItem: (itemData, quantity = 1) => {
        const id = `${itemData.productId}-${itemData.variantId}`;
        const existingIndex = get().items.findIndex((i) => i.id === id);

        if (existingIndex > -1) {
          const updatedItems = [...get().items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          const newItem: CartItemType = {
            ...itemData,
            id,
            quantity,
          };
          set({ items: [...get().items, newItem], isDrawerOpen: true });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const updatedItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountAmount: 0 });
      },

      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      toggleDrawer: () => {
        set({ isDrawerOpen: !get().isDrawerOpen });
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, discountAmount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, discountAmount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return STANDARD_SHIPPING_FEE;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingFee();
        const discount = get().discountAmount;
        return Math.max(0, subtotal + shipping - discount);
      },

      getProgressToFreeShipping: () => {
        const current = get().getSubtotal();
        const threshold = FREE_SHIPPING_THRESHOLD;
        const remaining = Math.max(0, threshold - current);
        const percentage = Math.min(100, Math.round((current / threshold) * 100));
        return { current, threshold, remaining, percentage };
      },
    }),
    {
      name: "nd-spices-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode, discountAmount: state.discountAmount }),
    }
  )
);
