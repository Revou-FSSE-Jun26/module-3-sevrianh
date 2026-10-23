"use client";

/* ============================================================
   app/cart/page.tsx — Halaman keranjang
   Client Component dibungkus ProtectedRoute (harus login).
   Menampilkan item, kuantitas, subtotal, total, hapus per baris,
   empty state, dan tombol checkout (disable saat kosong).
   ============================================================ */

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCart } from "@/hooks/useCart";
import { notifySuccess } from "@/lib/toast";

function CartContent() {
  const { items, removeFromCart, total } = useCart();

  // Empty state (Req 6.5).
  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Keranjang</h1>
        <p className="text-gray-500">Keranjang kamu masih kosong.</p>
        {/* Tombol checkout dinonaktifkan saat kosong. */}
        <button
          type="button"
          disabled
          className="w-fit cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-500"
        >
          Lanjut ke Checkout
        </button>
      </section>
    );
  }

  function handleRemove(productId: number, name: string) {
    removeFromCart(productId);
    notifySuccess(`${name} dihapus dari keranjang`);
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Keranjang</h1>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-600">
            <th className="py-2">Produk</th>
            <th className="py-2">Harga</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Subtotal</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.product.id} className="border-b border-gray-100">
              <td className="py-2">{it.product.name}</td>
              <td className="py-2">Rp {it.product.price.toLocaleString("id-ID")}</td>
              <td className="py-2">{it.quantity}</td>
              <td className="py-2">
                Rp {(it.product.price * it.quantity).toLocaleString("id-ID")}
              </td>
              <td className="py-2">
                <button
                  type="button"
                  onClick={() => handleRemove(it.product.id, it.product.name)}
                  className="text-gengar-lightred hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">
          Total: Rp {total.toLocaleString("id-ID")}
        </span>
        <Link
          href="/checkout"
          className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet"
        >
          Lanjut ke Checkout
        </Link>
      </div>
    </section>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
