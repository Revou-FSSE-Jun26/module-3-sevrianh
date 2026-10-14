"use client";

/* ============================================================
   ProductList.tsx — Daftar produk interaktif (Client Component)
   Menerima produk awal dari Server Component, lalu:
   - membaca ?search= dari URL (useSearchParams)
   - refetch produk saat query pencarian berubah (useEffect)
   - menyediakan CategoryFilter yang memfilter per kategori
   ============================================================ */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";
import AddProductForm from "./AddProductForm";

interface ProductListProps {
  initialProducts: Product[]; // produk awal dari Server Component (Req 13.1)
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Baca query pencarian dari URL (Req 8.2, 13.3).
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  // Refetch produk setiap kali query pencarian berubah (Req 13.3).
  useEffect(() => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    getProducts(query)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [search]);

  // Tambah produk baru ke daftar secara IMMUTABLE (Req 5.4): buat
  // array baru dengan spread, taruh produk baru di depan.
  function handleAdd(newProduct: Product) {
    setProducts((prev) => [newProduct, ...prev]);
  }

  // Filter berdasarkan kategori di sisi klien (Fake Store tidak punya
  // filter kategori server-side; saat kembali ke SevoShop bisa via API).
  const visibleProducts =
    categoryId === null
      ? products
      : products.filter((p) => p.category.id === categoryId);

  // Filter berdasarkan teks pencarian di sisi klien juga (pelengkap).
  const filtered = search
    ? visibleProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : visibleProducts;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar initialQuery={search} />
        </div>
        <CategoryFilter onSelect={setCategoryId} />
      </div>

      <AddProductForm onAdd={handleAdd} />

      {search && (
        <p className="text-sm text-gray-500">
          Menampilkan hasil untuk: <span className="font-medium">{search}</span>
        </p>
      )}

      <ProductGrid products={filtered} />
    </div>
  );
}
