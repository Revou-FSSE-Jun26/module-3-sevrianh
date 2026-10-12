/* ============================================================
   lib/types.ts — Tipe terpusat untuk aplikasi SevoShop
   Tipe domain (Product, Category, Order) MENGIKUTI bentuk
   backend SevoShop, agar komponen tidak perlu diubah saat
   nanti berpindah dari Fake Store API kembali ke Render.
   ============================================================ */

// Union type untuk status stok (dipakai conditional styling).
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

// Kategori produk (bentuk domain SevoShop: objek dengan id & name).
export interface Category {
  id: number;
  name: string;
}

// Produk (bentuk domain SevoShop).
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category; // objek bersarang
  image?: string;     // opsional: URL gambar (tersedia dari Fake Store)
}

// Item di dalam sebuah order.
export interface OrderItem {
  product_id: number;
  quantity: number;
}

// Order (bentuk domain SevoShop).
export interface Order {
  id: number;
  user_id: number;
  order_items: OrderItem[];
  total_price: number;
}

/* ------------------------------------------------------------
   Tipe MENTAH dari Fake Store API (sementara). Dipakai hanya
   oleh adapter di lib/api.ts untuk diubah ke bentuk domain.
   ------------------------------------------------------------ */
export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string; // Fake Store: kategori berupa string
  image: string;
  rating: { rate: number; count: number };
}
