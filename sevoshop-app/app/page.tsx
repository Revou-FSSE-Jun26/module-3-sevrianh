/* ============================================================
   app/page.tsx — Home page (Server Component)
   Mengambil produk via async/await di server, menampilkan 5
   produk pertama sebagai kartu read-only. Bagian yang fetch
   dibungkus <Suspense> agar sesuai Cache Components (Next.js 16).
   ============================================================ */

import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

// Metadata khusus halaman home (Req 10.2).
export const metadata = {
  title: "SevoShop — Beranda",
  description: "Produk unggulan dari SevoShop.",
};

/* Sub-komponen async yang melakukan fetch.
   Dipisah agar bisa dibungkus <Suspense> (streaming). */
async function FeaturedProducts() {
  // Fetch GET /products di server (Req 11.1, 11.3).
  const products = await getProducts();
  const featured = products.slice(0, 5); // 5 produk pertama

  // Kartu read-only: tanpa counter/tombol.
  return <ProductGrid products={featured} showActions={false} />;
}

export default function HomePage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Produk Unggulan</h1>
      {/* Streaming: tampilkan fallback selama produk di-fetch. */}
      <Suspense fallback={<p className="text-gray-500">Memuat produk...</p>}>
        <FeaturedProducts />
      </Suspense>
    </section>
  );
}
