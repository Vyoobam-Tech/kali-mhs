import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/types/product';

export interface CartItem {
    id: string; // Product ID or temp ID
    product?: Product;
    productName: string;
    category: string;
    quantity: number;
    unit: string;
    notes?: string;
}

interface RFQStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateItem: (itemId: string, updates: Partial<CartItem>) => void;
    clearCart: () => void;
}

export const useRFQStore = create<RFQStore>()(
    persist(
        (set) => ({
            items: [],

            addItem: (newItem) =>
                set((state) => {
                    // Check if item already exists
                    const existing = state.items.find(i => i.id === newItem.id);
                    if (existing) {
                        return {
                            items: state.items.map(i =>
                                i.id === newItem.id
                                    ? { ...i, quantity: i.quantity + newItem.quantity }
                                    : i
                            )
                        };
                    }
                    return { items: [...state.items, newItem] };
                }),

            removeItem: (itemId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId)
                })),

            updateItem: (itemId, updates) =>
                set((state) => ({
                    items: state.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
                })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'rfq-cart-storage',
        }
    )
);
