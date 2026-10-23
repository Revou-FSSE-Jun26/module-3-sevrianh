"use client";

/* ============================================================
   app/checkout/page.tsx — Halaman checkout (Tugas 8)
   Client Component dibungkus ProtectedRoute. Menampilkan ringkasan
   order; "Confirm Order" -> POST /orders; sukses -> kosongkan cart
   + redirect /orders.
   ============================================================ */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/lib/api";
import { notifySuccess, notifyError } from "@/lib/toast";

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Keranjang kosong: tidak ada yang bisa di-checkout.
  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <p className="text-gray-500">Keranjang kosong, tidak ada yang bisa dipesan.</p>
      </section>
    );
  }

  async function handleConfirm() {
    if (!currentUser) return;
    setSubmitting(true);
    try {
      // Susun payload items dari keranjang, lalu POST /orders (Req 7.3).
      const payload = items.map((it) => ({
        product_id: it.product.id,
        quantity: it.quantity,
      }));
      await createOrder(currentUser.id, payload);

      notifySuccess("Pesanan berhasil dibuat!");
      clearCart();            // kosongkan keranjang (Req 7.4)
      router.push("/orders"); // redirect ke daftar pesanan
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Gagal membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

      {/* Ringkasan order (Req 7.2) */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 font-semibold text-gengar-indigo">Ringkasan Pesanan</h2>
        <ul className="flex flex-col gap-1">
          {items.map((it) => (
            <li key={it.product.id} className="flex justify-between text-sm">
              <span>{it.product.name} × {it.quantity}</span>
              <span>Rp {(it.product.price * it.quantity).toLocaleString("id-ID")}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 font-bold">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={submitting}
        className="w-fit rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet disabled:opacity-60"
      >
        {submitting ? "Memproses..." : "Confirm Order"}
      </button>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
