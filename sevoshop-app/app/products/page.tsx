/* ============================================================
   app/products/page.tsx — Halaman daftar produk (Server Component)
   Fetch produk di server, lalu teruskan ke <ProductList /> (Client)
   yang menangani search & filter. Dibungkus <Suspense> (Next.js 16).

   STRATEGI RENDERING (Req 14.1): CACHED + revalidasi pendek.
   Daftar produk berubah lebih sering daripada kategori (harga/stok),
   tetapi tidak perlu real-time untuk render awal. Loader memakai
   "use cache" dengan cacheLife('minutes'). ProductList (Client) tetap
   me-refetch di browser untuk search/filter sehingga data interaktif
   selalu terkini.
   ============================================================ */

import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { getProducts } from "@/lib/api";
import ProductList from "@/components/ProductList";

// Metadata halaman produk (Req 10.2).
export const metadata = {
  title: "SevoShop — Produk",
  description: "Jelajahi, cari, dan filter semua produk SevoShop.",
};

// Sub-komponen async yang melakukan fetch (dibungkus Suspense).
async function ProductListLoader() {
  "use cache"; // render awal daftar produk boleh di-cache
  cacheLife("minutes"); // refresh tiap beberapa menit

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
