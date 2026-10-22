/* ============================================================
   lib/types.ts — Tipe terpusat untuk aplikasi SevoShop
   Tipe domain (Product, Category, Order) MENGIKUTI bentuk
   backend SevoShop (Flask API di Render).
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
}

// Item di dalam sebuah order (bentuk backend: order_items[].to_dict()).
export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price_at_purchase?: number;
  subtotal?: number;
}

// Order (bentuk backend SevoShop: Order.to_dict()).
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  ordered_at?: string;
  is_deleted?: boolean;
  items?: OrderItem[]; // hadir saat include_items=True
}

/* ------------------------------------------------------------
   Tipe untuk Checkpoint 3: autentikasi & keranjang.
   ------------------------------------------------------------ */

// Peran pengguna (union type) menentukan hak akses.
export type UserRole = "admin" | "customer";

// Pengguna yang login (disimpan di AuthContext & localStorage).
export interface User {
  id: number;
  username: string;
  email: string;
  role?: UserRole; // opsional; backend menentukan saat login
}

// Data form registrasi (semua string karena berasal dari <input>).
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Satu item di dalam keranjang: produk + kuantitas.
export interface CartItem {
  product: Product;
  quantity: number;
}

/* ------------------------------------------------------------
   Tipe MENTAH dari backend SevoShop (Flask). Dipakai oleh
   adapter di lib/api.ts untuk diubah ke bentuk domain.
   ------------------------------------------------------------ */

// Bentuk Category.to_dict() dari backend.
export interface BackendCategory {
  id: number;
  category_name: string;
  description?: string | null;
  created_at?: string | null;
}

// Bentuk Product.to_dict() dari backend.
export interface BackendProduct {
  id: number;
  category_id: number;
  product_name: string;
  description?: string | null;
  price: number | string; // Numeric bisa terserialisasi sebagai string
  stock: number;
  created_at?: string | null;
}
