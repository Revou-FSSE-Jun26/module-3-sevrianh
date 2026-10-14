"use client";

/* ============================================================
   ProductCard.tsx — Kartu satu produk
   Client Component karena memakai state (quantity counter).
   ============================================================ */

import { useState } from "react";
import type { Product } from "@/lib/types";
import { getButtonClasses } from "@/lib/ui";
import Card from "./Card";

/* ProductCardProps (Req 2.2): mengetik props komponen.
   - product : data produk yang ditampilkan (wajib)
   - showActions : prop OPSIONAL untuk menampilkan tombol/counter (Req 2.3) */
export interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

// Destructuring defaults (Req 2.3): showActions default-nya true.
export default function ProductCard({ product, showActions = true }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  // Turunkan ketersediaan stok dari data bertipe.
  const inStock = product.stock > 0;

  return (
    <Card className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category.name}</p>
      <p className="text-gengar-violet font-bold">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      {/* Conditional rendering (Req 4.1): label stok berdasarkan field bertipe. */}
      {inStock ? (
        <p className="text-sm text-green-600">Stok: {product.stock}</p>
      ) : (
        <p className="text-sm text-red-600">Stok habis</p>
      )}

      {/* showActions mengatur apakah counter & tombol tampil. */}
      {showActions && (
        <div className="mt-2 flex flex-col gap-2">
          {/* Quantity counter (Req 4.3): pembaruan state. */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-8 w-8 rounded border border-gray-300"
              aria-label="Kurangi jumlah"
            >
              -
            </button>
            <span className="min-w-6 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="h-8 w-8 rounded border border-gray-300"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>

          {/* getButtonClasses (Req 4.2): class berbeda untuk tersedia vs habis. */}
          <button type="button" disabled={!inStock} className={getButtonClasses(inStock)}>
            {inStock ? "Tambah ke Keranjang" : "Tidak Tersedia"}
          </button>
        </div>
      )}
    </Card>
  );
}
