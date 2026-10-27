"use client";

/* ============================================================
   context/CartContext.tsx — State keranjang global
   Menyimpan item keranjang, mem-persist ke localStorage, dan
   menyediakan addToCart/removeFromCart/clearCart/total.
   Sepenuhnya di sisi klien (tidak butuh backend).

   PENTING: pemulihan awal dari localStorage terjadi di useEffect.
   Effect persist melewati eksekusi PERTAMA (mount), karena saat itu
   `items` masih nilai awal [] dan akan menimpa data tersimpan dengan
   array kosong (keranjang jadi hilang saat refresh).
   ============================================================ */

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Product, CartItem } from "@/lib/types";

const STORAGE_KEY = "sevoshop_cart";

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Lewati eksekusi pertama effect persist (lihat catatan di atas).
  const skipFirstPersist = useRef(true);

  // Pulihkan keranjang dari localStorage saat mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Persist keranjang ke localStorage setiap kali 'items' berubah (Req 5.2),
  // tetapi lewati eksekusi pertama agar tidak menimpa data pulihan.
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Tambah produk: jika sudah ada, naikkan kuantitas (update immutable).
  function addToCart(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  // Hapus satu produk dari keranjang (filter immutable).
  function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }

  // Kosongkan keranjang.
  function clearCart() {
    setItems([]);
  }

  // Total harga = jumlah (harga * kuantitas) seluruh item.
  const total = items.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (ctx === undefined) {
    throw new Error("useCart harus dipakai di dalam <CartProvider>");
  }
  return ctx;
}
