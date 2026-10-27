/* ============================================================
   app/categories/page.tsx — Halaman daftar kategori (Server Component)
   Fetch GET /categories di server, tampilkan sebagai daftar.
   Pola sama dengan /products: Suspense + loading + error.

   STRATEGI RENDERING (Req 14.1): CACHED + revalidasi berkala (mirip ISR).
   Kategori jarang berubah, jadi loader memakai direktif "use cache" dengan
   cacheLife('hours'). Hasilnya di-prerender ke static shell dan di-refresh
   tiap beberapa jam — cepat untuk pengguna, tetap cukup segar.
   ============================================================ */

import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { getCategories } from "@/lib/api";
import Card from "@/components/Card";

// Metadata halaman kategori (Req 10.2).
export const metadata = {
  title: "SevoShop — Kategori",
  description: "Daftar kategori produk di SevoShop.",
};

// Sub-komponen async yang melakukan fetch (dibungkus Suspense).
async function CategoryListLoader() {
  "use cache"; // hasil komponen ini boleh di-cache (Next.js 16 cacheComponents)
  cacheLife("hours"); // refresh berkala tiap beberapa jam

  const categories = await getCategories(); // GET /categories (Req 11.4)

  if (categories.length === 0) {
    return <p className="text-gray-500">Belum ada kategori.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <Card key={cat.id}>
          <h3 className="font-semibold text-gengar-violet capitalize">{cat.name}</h3>
        </Card>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Kategori</h1>
      <Suspense fallback={<p className="text-gray-500">Memuat kategori...</p>}>
        <CategoryListLoader />
      </Suspense>
    </section>
  );
}
