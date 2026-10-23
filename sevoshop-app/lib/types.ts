/* ============================================================
   lib/types.ts — Tipe terpusat untuk aplikasi SevoShop
   Mengikuti bentuk data backend Flask SevoShop (Render).
   ============================================================ */

// Union type status stok (dipakai conditional styling di UI).
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

// Kategori (backend: /category/, field category_name).
export interface Category {
  id: number;
  name: string;        // dipetakan dari category_name
  description?: string;
}

// Produk (backend: /products/, field product_name, price string, category_id).
export interface Product {
  id: number;
  name: string;        // dipetakan dari product_name
  price: number;       // dikonversi dari string "125000.00"
  stock: number;
  categoryId: number;  // dipetakan dari category_id
  description?: string;
}

// Order (backend: /orders/).
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status?: string;
  ordered_at?: string;
}

// Item dalam order (dipakai detail order & pembuatan order).
export interface OrderItem {
  product_id: number;
  quantity: number;
}

/* ------------------------------------------------------------
   Tipe autentikasi & keranjang (Checkpoint 3).
   ------------------------------------------------------------ */

// Peran pengguna dari backend. Backend memakai "buyer"/"admin".
export type UserRole = "admin" | "buyer";

export interface User {
  id: number;
  username: string;
  email: string;
  role?: UserRole;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/* ------------------------------------------------------------
   Tipe MENTAH dari backend (dipakai adapter di lib/api.ts).
   ------------------------------------------------------------ */
export interface RawProduct {
  id: number;
  product_name: string;
  price: string;      // backend mengirim string, mis. "125000.00"
  stock: number;
  category_id: number;
  description?: string;
  created_at?: string;
}

export interface RawCategory {
  id: number;
  category_name: string;
  description?: string;
  created_at?: string;
}
