/* ============================================================
   app/products/page.tsx — Halaman daftar produk (Server Component)
   Fetch produk di server, lalu teruskan ke <ProductList /> (Client)
   yang menangani search & filter. Dibungkus <Suspense> (Next.js 16).
   ============================================================ */

import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import ProductList from "@/components/ProductList";

// Metadata halaman produk (Req 10.2).
export const metadata = {
  title: "SevoShop — Produk",
  description: "Jelajahi, cari, dan filter semua produk SevoShop.",
};

// Sub-komponen async yang melakukan fetch (dibungkus Suspense).
async function ProductListLoader() {
  const products = await getProducts(); // GET /products di server (Req 11.1)
  return <ProductList initialProducts={products} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Memuat daftar produk...</p>}>
      <ProductListLoader />
    </Suspense>
  );
}
