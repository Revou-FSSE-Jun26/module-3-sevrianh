/* ============================================================
   app/categories/page.tsx — Halaman daftar kategori (Server Component)
   Fetch GET /categories di server, tampilkan sebagai daftar.
   Pola sama dengan /products: Suspense + loading + error.
   ============================================================ */

import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import Card from "@/components/Card";

// Metadata halaman kategori (Req 10.2).
export const metadata = {
  title: "SevoShop — Kategori",
  description: "Daftar kategori produk di SevoShop.",
};

// Sub-komponen async yang melakukan fetch (dibungkus Suspense).
async function CategoryListLoader() {
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
