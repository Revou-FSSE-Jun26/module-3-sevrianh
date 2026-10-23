"use client";

/* ============================================================
   app/orders/[id]/page.tsx — Detail satu pesanan (Tugas 9, Req 8.2)
   Client Component dibungkus ProtectedRoute. Mengambil order via id.
   Catatan: backend GET /orders/[id] mengembalikan ringkasan order
   (tanpa daftar item terpisah), jadi detail menampilkan info order.
   ============================================================ */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getOrder } from "@/lib/api";
import type { Order } from "@/lib/types";

function OrderDetailContent() {
  const params = useParams();
  const id = String(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Memuat detail pesanan...</p>;
  if (error) return <p className="text-gengar-lightred">{error}</p>;
  if (!order) return <p className="text-gray-500">Pesanan tidak ditemukan.</p>;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-800">Pesanan #{order.id}</h1>
      <p className="text-sm text-gray-500">Status: {order.status ?? "-"}</p>
      {order.ordered_at && (
        <p className="text-sm text-gray-500">
          Tanggal: {new Date(order.ordered_at).toLocaleString("id-ID")}
        </p>
      )}
      <p className="text-xl font-bold text-gengar-violet">
        Total: Rp {order.total_amount.toLocaleString("id-ID")}
      </p>
      <Link href="/orders" className="text-gengar-violet hover:underline">
        &larr; Kembali ke daftar pesanan
      </Link>
    </article>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
