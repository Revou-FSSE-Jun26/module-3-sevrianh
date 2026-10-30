/* ============================================================
   ProductGrid.tsx — Menampilkan daftar produk dalam grid
   Me-map Product[] menjadi ProductCard (Req 3.2), bukan hardcode.
   ============================================================ */

import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  showActions?: boolean; // diteruskan ke tiap ProductCard
  // Peta id kategori -> nama kategori. Bila tersedia, tiap kartu
  // menampilkan nama kategori, bukan "#id".
  categoryNames?: Map<number, string>;
}

export default function ProductGrid({ products, showActions = true, categoryNames }: ProductGridProps) {
  // State kosong: tampilkan pesan bila tidak ada produk.
  if (products.length === 0) {
    return <p className="text-gray-500">Tidak ada produk untuk ditampilkan.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showActions={showActions}
          categoryName={categoryNames?.get(product.categoryId)}
        />
      ))}
    </div>
  );
}
