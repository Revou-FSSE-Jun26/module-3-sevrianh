/* ============================================================
   app/page.tsx — Home page (Server Component)
   Mengambil produk via async/await di server, menampilkan 5
   produk pertama sebagai kartu read-only. Bagian yang fetch
   dibungkus <Suspense> agar sesuai Cache Components (Next.js 16).
   ============================================================ */

import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

// Metadata khusus halaman home (Req 10.2).
export const metadata = {
  title: "SevoShop — Beranda",
  description: "Produk unggulan dari SevoShop.",
};

/* Sub-komponen async yang melakukan fetch.
   Dipisah agar bisa dibungkus <Suspense> (streaming). */
async function FeaturedProducts() {
  // Fetch produk & kategori paralel di server (Req 11.1, 11.3).
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories().catch(() => []), // gagal kategori tidak membatalkan render
  ]);
  const featured = products.slice(0, 5); // 5 produk pertama

  // Peta id -> nama kategori, agar kartu menampilkan nama (bukan #id).
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]));

  // Kartu read-only: tanpa counter/tombol.
  return (
    <ProductGrid products={featured} showActions={false} categoryNames={categoryNames} />
  );
}

export default function HomePage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 data-testid="home-heading" className="text-2xl font-bold text-gray-800">
        Produk Unggulan
      </h1>
      {/* Streaming: tampilkan fallback selama produk di-fetch. */}
      <Suspense fallback={<p className="text-gray-500">Memuat produk...</p>}>
        <FeaturedProducts />
      </Suspense>
    </section>
  );
}
