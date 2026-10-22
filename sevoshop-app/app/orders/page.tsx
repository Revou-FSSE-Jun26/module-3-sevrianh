/* ============================================================
   app/orders/page.tsx — Halaman daftar pesanan (Server Component)
   Fetch GET /orders/ di server, tampilkan dalam tabel read-only.
   Data mengikuti bentuk backend SevoShop (Order.to_dict()).
   ============================================================ */

import { Suspense } from "react";
import { getOrders } from "@/lib/api";

// Metadata halaman pesanan (Req 10.2).
export const metadata = {
  title: "SevoShop — Pesanan",
  description: "Daftar pesanan di SevoShop.",
};

async function OrderListLoader() {
  const orders = await getOrders(); // GET /orders (Req 11.4)

  if (orders.length === 0) {
    return <p className="text-gray-500">Belum ada pesanan.</p>;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-gray-200 text-gray-600">
          <th className="py-2">ID Pesanan</th>
          <th className="py-2">ID Pengguna</th>
          <th className="py-2">Jumlah Item</th>
          <th className="py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-gray-100">
            <td className="py-2">{order.id}</td>
            <td className="py-2">{order.user_id}</td>
            <td className="py-2">{order.items?.length ?? 0}</td>
            <td className="py-2">Rp {order.total_amount.toLocaleString("id-ID")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function OrdersPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Pesanan</h1>
      <Suspense fallback={<p className="text-gray-500">Memuat pesanan...</p>}>
        <OrderListLoader />
      </Suspense>
    </section>
  );
}
