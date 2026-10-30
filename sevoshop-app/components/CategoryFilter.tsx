"use client";

/* ============================================================
   CategoryFilter.tsx — Dropdown filter kategori
   Client Component: fetch kategori saat mount, panggil callback
   onSelect saat kategori dipilih.
   ============================================================ */

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  // Dipanggil saat user memilih kategori (atau "semua" => null).
  onSelect: (categoryId: number | null) => void;
  // Daftar kategori opsional dari parent. Bila diberikan, komponen TIDAK
  // fetch sendiri (menghindari double fetch). Bila tidak, fetch saat mount.
  categories?: Category[];
}

export default function CategoryFilter({ onSelect, categories: categoriesProp }: CategoryFilterProps) {
  const [fetched, setFetched] = useState<Category[]>([]);

  // Fetch kategori sekali saat mount HANYA bila parent tidak menyediakannya (Req 13.4).
  useEffect(() => {
    if (categoriesProp) return;
    getCategories()
      .then(setFetched)
      .catch(() => setFetched([])); // bila gagal, biarkan kosong
  }, [categoriesProp]);

  // Sumber data: prop dari parent bila ada, selain itu hasil fetch sendiri.
  const categories = categoriesProp ?? fetched;

  return (
    <select
      aria-label="Filter kategori"
      onChange={(e) => {
        const value = e.target.value;
        onSelect(value === "" ? null : Number(value));
      }}
      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
    >
      <option value="">Semua kategori</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
