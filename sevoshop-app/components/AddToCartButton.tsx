"use client";

/* ============================================================
   AddToCartButton.tsx — Tombol tambah ke keranjang
   - Login     : tombol "Tambah ke Keranjang" -> addToCart + toast
   - Belum login: tautan "Login to buy" (Req 5.4)
   ============================================================ */

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { notifySuccess } from "@/lib/toast";
import { getButtonClasses } from "@/lib/ui";

export default function AddToCartButton({ product }: { product: Product }) {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  // Belum login -> tautan ke /login.
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="inline-block rounded-md bg-gengar-magenta px-4 py-2 text-center font-medium text-white hover:bg-gengar-violet"
      >
        Login to buy
      </Link>
    );
  }

  const inStock = product.stock > 0;

  function handleAdd() {
    addToCart(product, 1);
    notifySuccess(`${product.name} ditambahkan ke keranjang`);
  }

  return (
    <button
      type="button"
      disabled={!inStock}
      onClick={handleAdd}
      className={getButtonClasses(inStock)}
    >
      {inStock ? "Tambah ke Keranjang" : "Stok habis"}
    </button>
  );
}
