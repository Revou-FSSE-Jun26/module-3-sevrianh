/* ============================================================
   lib/types.ts — Tipe terpusat untuk aplikasi SevoShop
   Dipakai lintas halaman (Server & Client Component) dan
   akan berlanjut dipakai di Checkpoint 3 (cart, dashboard).
   ============================================================ */

// Union type untuk status stok (dipakai conditional styling).
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

// Kategori produk dari API.
export interface Category {
  id: number;
  name: string;
}

// Produk dari API. Bentuk disesuaikan dengan respons backend RevoShop.
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category; // objek bersarang
}

// Item di dalam sebuah order.
export interface OrderItem {
  product_id: number;
  quantity: number;
}

// Order dari API (dipakai halaman orders).
export interface Order {
  id: number;
  user_id: number;
  order_items: OrderItem[]; // array bertipe
  total_price: number;
}
