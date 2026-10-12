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
}

export default function CategoryFilter({ onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch kategori sekali saat komponen mount (Req 13.4).
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([])); // bila gagal, biarkan kosong
  }, []);

  return (
    <select
      aria-label="Filter kategori"
      onChange={(e) => {
        const value = e.target.value;
        onSelect(value === "" ? null : Number(value));
      }}
      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
