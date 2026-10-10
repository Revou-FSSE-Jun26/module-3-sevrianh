/* ============================================================
   lib/ui.ts — Helper styling (SevoShop)
   Memetakan kondisi/data ke string class Tailwind.
   ============================================================ */

/* Mengembalikan string class Tailwind berbeda berdasarkan ketersediaan stok.
   - tersedia: tombol aktif (indigo, bisa diklik)
   - tidak tersedia: tombol nonaktif (abu-abu, kursor terlarang) */
export function getButtonClasses(inStock: boolean): string {
  const base = "px-4 py-2 rounded-md font-medium transition-colors";
  return inStock
    ? `${base} bg-indigo-600 text-white hover:bg-indigo-700`
    : `${base} bg-gray-300 text-gray-500 cursor-not-allowed`;
}
