"use client";

/* ============================================================
   app/orders/page.tsx — Pesanan milik customer (Tugas 9)
   Client Component (butuh currentUser.id) dibungkus ProtectedRoute.
   Menampilkan HANYA order milik user yang login (Req 8.1), dan
   tiap baris bisa diklik menuju detail /orders/[id] (Req 8.2).
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { getOrdersByUser } from "@/lib/api";
import type { Order } from "@/lib/types";

function OrdersContent() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    getOrdersByUser(currentUser.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) {
    return <p className="text-gray-500">Memuat pesanan...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-500">Kamu belum punya pesanan.</p>;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-gray-200 text-gray-600">
          <th className="py-2">ID Pesanan</th>
          <th className="py-2">Status</th>
          <th className="py-2">Total</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-gray-100">
            <td className="py-2">#{order.id}</td>
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

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Pesanan Saya</h1>
        <OrdersContent />
      </section>
    </ProtectedRoute>
  );
}
