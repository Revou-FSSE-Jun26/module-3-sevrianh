"use client";

/* ============================================================
   SearchBar.tsx — Input pencarian produk
   Client Component: onChange + navigasi via router.push saat Enter.
   ============================================================ */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string; // nilai awal (mis. dibaca dari URL)
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  // Saat form disubmit (Enter), navigasi ke /products?search=...
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // cegah reload default form
    const trimmed = query.trim();
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={query}
        // onChange handler (Req 4.4): perbarui state tiap ketikan.
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk..."
        aria-label="Cari produk"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
      />
    </form>
  );
}
