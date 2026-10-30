"use client";

/* ============================================================
   CartNav.tsx — Ikon keranjang di header dengan badge jumlah item
   Client Component karena membaca state keranjang (useCart).

   Jumlah item dipulihkan dari localStorage di dalam useEffect
   CartProvider, sehingga badge baru dirender setelah komponen
   ter-mount (mounted) untuk menghindari hydration mismatch.
   ============================================================ */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function CartNav() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Total kuantitas seluruh item (bukan sekadar jumlah baris produk).
  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  const showBadge = mounted && count > 0;

  return (
    <Link
      href="/cart"
      data-testid="nav-cart"
      aria-label={`Keranjang${showBadge ? `, ${count} item` : ""}`}
      className="relative inline-flex items-center rounded-md p-2 text-white transition-colors hover:bg-white/20"
    >
      {/* Ikon keranjang — SVG inline (tanpa dependency tambahan). */}
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* Badge jumlah item — hanya tampil bila keranjang berisi. */}
      {showBadge && (
        <span
          data-testid="cart-count"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gengar-lightred px-1 text-xs font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
