/* ============================================================
   render.ts — Render kartu produk dengan Tailwind
   Tugas 9: mapping data bertipe -> string class Tailwind
   ============================================================ */

import type { Product, StockStatus } from "./types";

/* statusBadgeClasses (Req 16.1): memetakan union StockStatus ke
   string class Tailwind yang berbeda. Conditional styling berbasis
   field bertipe. Setiap status memetakan ke tepat satu kombinasi warna. */
export function statusBadgeClasses(status: StockStatus): string {
  const base = "inline-block rounded-full px-2 py-0.5 text-xs font-medium";
  switch (status) {
    case "in-stock":
      return `${base} bg-green-100 text-green-700`;
    case "low-stock":
      return `${base} bg-yellow-100 text-yellow-700`;
    case "out-of-stock":
      return `${base} bg-red-100 text-red-700`;
  }
}

// Label stok yang ramah dibaca untuk tiap status.
function statusLabel(status: StockStatus): string {
  switch (status) {
    case "in-stock":
      return "Tersedia";
    case "low-stock":
      return "Stok menipis";
    case "out-of-stock":
      return "Stok habis";
  }
}

/* renderProductCard (Req 15): satu kartu produk.
   Memakai utility tipografi Tailwind (text-*, font-*). */
export function renderProductCard(p: Product): string {
  return `
    <article class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-lg font-semibold text-gray-800">${p.name}</h3>
        <span class="${statusBadgeClasses(p.status)}">${statusLabel(p.status)}</span>
      </div>
      <p class="text-sm text-gray-500">${p.category.name}</p>
      <p class="text-base font-bold text-gengar-violet">Rp ${p.price.toLocaleString("id-ID")}</p>
      <div class="flex flex-wrap gap-1">
        ${p.tags.map((t) => `<span class="rounded bg-gengar-bg px-2 py-0.5 text-xs text-gengar-indigo">#${t}</span>`).join("")}
      </div>
    </article>
  `;
}

/* renderProductList (Req 16.1, 17.1): map Product[] -> kartu.
   Layout grid mobile-first responsif (sm/md/lg).
   Idempoten: input sama menghasilkan output sama (Property 6). */
export function renderProductList(products: Product[]): string {
  if (products.length === 0) {
    return `<p class="text-gray-500">Tidak ada produk.</p>`;
  }
  return `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${products.map(renderProductCard).join("")}
    </div>
  `;
}
