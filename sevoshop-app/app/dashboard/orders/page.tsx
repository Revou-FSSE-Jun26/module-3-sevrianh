"use client";

/* ============================================================
   app/dashboard/orders/page.tsx — Daftar semua pesanan (admin)
   AdminRoute. Berbeda dari /orders (yang hanya menampilkan pesanan
   milik user login), halaman ini menampilkan SELURUH order dari
   backend (GET /orders/) untuk keperluan admin.
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute";
import { getOrders } from "@/lib/api";
// (Link sudah diimpor di atas; dipakai untuk tombol kembali & detail.)
import type { Order } from "@/lib/types";

function OrdersAdminContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Muat semua order saat mount.
  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Memuat pesanan...</p>;

  if (orders.length === 0) {
    return <p className="text-gray-500">Belum ada pesanan.</p>;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-gray-200 text-gray-600">
          <th className="py-2">ID Pesanan</th>
          <th className="py-2">User</th>
          <th className="py-2">Status</th>
          <th className="py-2">Total</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-gray-100">
            <td className="py-2">#{order.id}</td>
            <td className="py-2">#{order.user_id}</td>
            <td className="py-2">{order.status ?? "-"}</td>
            <td className="py-2">Rp {order.total_amount.toLocaleString("id-ID")}</td>
            <td className="py-2">
              <Link href={`/orders/${order.id}`} className="text-gengar-violet hover:underline">
                Lihat detail
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function OrdersAdminPage() {
  return (
    <AdminRoute>
      <section className="flex flex-col gap-4">
        <Link href="/dashboard" className="self-start text-sm text-gengar-violet hover:underline">
          &larr; Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pesanan</h1>
        <OrdersAdminContent />
      </section>
    </AdminRoute>
  );
}
