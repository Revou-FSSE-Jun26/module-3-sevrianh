/* ============================================================
   app/products/layout.tsx — Nested Layout untuk /products/*
   Membungkus /products dan /products/[id]. Layout ini TETAP
   MOUNTED saat navigasi antar sub-route (Req 6.4), sehingga
   bagian di sini tidak di-render ulang.
   ============================================================ */

import type { ReactNode } from "react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Judul section ini tetap tampil di /products maupun /products/[id]. */}
      <h1 className="text-2xl font-bold text-gray-800">Katalog Produk</h1>
      {children}
    </div>
  );
}
