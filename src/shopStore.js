import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { lineKey } from "@/lib/shop";

// Carrito + favoritos + estado de UI de la tienda.
// items y favoritos se guardan en localStorage; lo demás es efímero.
export const useShop = create(
  persist(
    (set) => ({
      items: [],
      favoritos: [],
      cartOpen: false,
      producto: null,
      filtro: "todos",

      addItem: (product, { color, talla, cantidad = 1 }) =>
        set((s) => {
          const key = lineKey(product.id, color, talla);
          const existe = s.items.find((it) => it.key === key);
          const items = existe
            ? s.items.map((it) =>
                it.key === key ? { ...it, cantidad: it.cantidad + cantidad } : it,
              )
            : [
                ...s.items,
                {
                  key,
                  id: product.id,
                  nombre: product.nombre,
                  referencia: product.referencia,
                  precio: product.precio ?? 0,
                  foto: product.fotos?.[0],
                  color,
                  talla,
                  cantidad,
                },
              ];
          return { items, cartOpen: true };
        }),
      setCantidad: (key, cantidad) =>
        set((s) => ({
          items:
            cantidad <= 0
              ? s.items.filter((it) => it.key !== key)
              : s.items.map((it) => (it.key === key ? { ...it, cantidad } : it)),
        })),
      removeItem: (key) =>
        set((s) => ({ items: s.items.filter((it) => it.key !== key) })),
      clearCart: () => set({ items: [] }),

      toggleFavorito: (id) =>
        set((s) => ({
          favoritos: s.favoritos.includes(id)
            ? s.favoritos.filter((f) => f !== id)
            : [...s.favoritos, id],
        })),

      setCartOpen: (cartOpen) => set({ cartOpen }),
      openProducto: (producto) => set({ producto }),
      closeProducto: () => set({ producto: null }),
      setFiltro: (filtro) => set({ filtro }),
    }),
    {
      name: "marsupial-shop",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, favoritos: s.favoritos }),
    },
  ),
);

export const selectCount = (s) => s.items.reduce((n, it) => n + it.cantidad, 0);
export const selectSubtotal = (s) =>
  s.items.reduce((n, it) => n + it.precio * it.cantidad, 0);
