/* ============================================================
   types.ts — Model data type-safe untuk Product Catalog
   Tugas 8.1: interface, union type, objek & array bersarang
   ============================================================ */

/* UNION TYPE (Req 12):
   StockStatus hanya boleh bernilai salah satu dari tiga string ini.
   TypeScript akan menolak nilai lain, misalnya "ready" atau "kosong". */
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

/* INTERFACE (Req 11): memodelkan sebuah kategori produk. */
export interface Category {
  id: number;
  name: string;
}

/* INTERFACE (Req 11 & 13): memodelkan sebuah produk.
   - status  : UNION TYPE (StockStatus)
   - category: OBJEK BERSARANG (bertipe Category)
   - tags    : ARRAY BERTIPE (array of string) */
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: StockStatus;
  category: Category;
  tags: string[];
}
