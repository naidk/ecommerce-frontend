import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../../types';
import api from '../../lib/axios';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (product: Product) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => void; // Local clear, backend handles clear on order
    total: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            fetchCart: async () => {
                const customerId = localStorage.getItem('customerId');
                if (!customerId) return;

                set({ isLoading: true });
                try {
                    const { data: cartData } = await api.get(`/shopping-cart/${customerId}`);

                    // Hydrate products
                    // We need full product details for the UI (image, etc.)
                    // The cart endpoint only gives name, price, qty.
                    const enrichedItems: CartItem[] = await Promise.all(
                        cartData.items.map(async (item: { productId: string; productName: string; quantity: number; priceAtAddedTime: number }) => {
                            try {
                                const { data: product } = await api.get<Product>(`/product/${item.productId}`);
                                return {
                                    ...product,
                                    quantity: item.quantity
                                };
                            } catch (err) {
                                // Fallback if product fetch fails
                                return {
                                    id: item.productId,
                                    name: item.productName,
                                    price: item.priceAtAddedTime,
                                    quantity: item.quantity,
                                    description: '', // Fallback
                                    categoryId: '',  // Fallback
                                    inventory: 0,    // Fallback
                                    active: true
                                } as CartItem;
                            }
                        })
                    );

                    set({ items: enrichedItems });
                } catch (error) {
                    console.error('Failed to fetch cart', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addItem: async (product) => {
                const customerId = localStorage.getItem('customerId');
                if (!customerId) {
                    // Fallback for non-logged in (or could redirect)
                    // For now, we update local state but warn
                    console.warn("User not logged in, cart will not save");
                    const items = get().items;
                    const existingItem = items.find((item) => item.id === product.id);
                    if (existingItem) {
                        set({
                            items: items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        });
                    } else {
                        set({ items: [...items, { ...product, quantity: 1 }] });
                    }
                    return;
                }

                try {
                    // Backend adds to existing quantity
                    await api.post(`/shopping-cart/${customerId}`, {
                        productId: product.id,
                        quantity: 1 // Adding 1 at a time
                    });
                    await get().fetchCart();
                } catch (error) {
                    console.error('Failed to add item to cart', error);
                }
            },

            removeItem: async (productId) => {
                const customerId = localStorage.getItem('customerId');
                if (!customerId) {
                    set({ items: get().items.filter((item) => item.id !== productId) });
                    return;
                }

                try {
                    // Safe bet: find current quantity and remove all of it.
                    const currentItem = get().items.find(i => i.id === productId);
                    if (!currentItem) return;

                    await api.delete(`/shopping-cart/${customerId}`, {
                        data: {
                            productId: productId,
                            quantity: currentItem.quantity // Remove all
                        }
                    });
                    await get().fetchCart();
                } catch (error) {
                    console.error('Failed to remove item', error);
                }
            },

            updateQuantity: async (productId, quantity) => {
                const customerId = localStorage.getItem('customerId');
                if (!customerId) {
                    if (quantity <= 0) {
                        set({ items: get().items.filter((item) => item.id !== productId) });
                    } else {
                        set({
                            items: get().items.map((item) =>
                                item.id === productId ? { ...item, quantity } : item
                            ),
                        });
                    }
                    return;
                }

                const currentItem = get().items.find(i => i.id === productId);
                if (!currentItem) return;

                const oldQty = currentItem.quantity;
                const diff = quantity - oldQty;

                try {
                    if (diff > 0) {
                        await api.post(`/shopping-cart/${customerId}`, {
                            productId: productId,
                            quantity: diff
                        });
                    } else if (diff < 0) {
                        await api.delete(`/shopping-cart/${customerId}`, {
                            data: {
                                productId: productId,
                                quantity: Math.abs(diff)
                            }
                        });
                    }
                    await get().fetchCart();
                } catch (error) {
                    console.error('Failed to update quantity', error);
                }
            },

            clearCart: () => set({ items: [] }), // UI clear

            total: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
            itemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'shopping-cart',
        }
    )
);
