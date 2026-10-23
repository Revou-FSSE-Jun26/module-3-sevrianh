/* ============================================================
   hooks/useCart.ts — Akses cepat ke CartContext
   Pemakaian: const { items, addToCart, total } = useCart();
   ============================================================ */

import { useCartContext } from "@/context/CartContext";

export function useCart() {
  return useCartContext();
}
