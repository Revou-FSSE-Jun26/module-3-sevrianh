"use client";

/* ============================================================
   app/dashboard/orders/page.tsx — Manajemen order (admin, Tugas 12)
   AdminRoute. Tabel read-only semua order dari semua pengguna:
   order ID, user ID, status, dan total (Req 11.2).
   ============================================================ */

import { useEffect, useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import { getOrders } from "@/lib/api";
import type { Order } from "@/lib/types";

function DashboardOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Muat semua order saat mount (Req 11.2).
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
          <th className="py-2">ID Pengguna</th>
          <th className="py-2">Status</th>
          <th className="py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-gray-100">
            <td className="py-2">#{order.id}</td>
            <td className="py-2">{order.user_id}</td>
            <td className="py-2">{order.status ?? "-"}</td>
            <td className="py-2">Rp {order.total_amount.toLocaleString("id-ID")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DashboardOrdersPage() {
  return (
    <AdminRoute>
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Semua Pesanan</h1>
        <DashboardOrdersContent />
      </section>
    </AdminRoute>
  );
}
