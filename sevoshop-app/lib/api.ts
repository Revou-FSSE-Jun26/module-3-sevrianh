/* ============================================================
   lib/api.ts — Helper pemanggilan API terpusat (SevoShop)
   Menyasar backend Flask SevoShop (Render). Mengadaptasi bentuk
   mentah backend (product_name, price string, category_name, dsb.)
   ke bentuk domain (Product/Category) yang dipakai komponen.
   Catatan: endpoint backend butuh trailing slash.
   ============================================================ */

import type {
  Product,
  Category,
  Order,
  RawProduct,
  RawCategory,
  User,
  RegisterFormData,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- GET generic dengan pemeriksaan res.ok (lapisan error 1) ---
async function getJson<T>(path: string): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Permintaan gagal (${res.status}) untuk ${path}`);
  return res.json() as Promise<T>;
}

// --- Adapter: bentuk mentah backend -> bentuk domain ---
function adaptProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.product_name,
    price: Number(raw.price), // "125000.00" -> 125000
    stock: raw.stock,
    categoryId: raw.category_id,
    description: raw.description,
  };
}

function adaptCategory(raw: RawCategory): Category {
  return {
    id: raw.id,
    name: raw.category_name,
    description: raw.description,
  };
}

// --- GET resources (endpoint pakai trailing slash) ---
export async function getProducts(_query = ""): Promise<Product[]> {
  const raw = await getJson<RawProduct[]>(`/products/`);
  return raw.map(adaptProduct);
}

export async function getProduct(id: string): Promise<Product> {
  const raw = await getJson<RawProduct>(`/products/${id}`);
  return adaptProduct(raw);
}

export async function getCategories(): Promise<Category[]> {
  const raw = await getJson<RawCategory[]>(`/category/`);
  return raw.map(adaptCategory);
}

export async function getOrders(): Promise<Order[]> {
  return getJson<Order[]>(`/orders/`);
}

// Ambil order milik user tertentu (difilter di klien karena backend
// /orders/ mengembalikan semua order).
export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const all = await getOrders();
  return all.filter((o) => o.user_id === userId);
}

// Ambil satu order (ringkasan) berdasarkan id.
export async function getOrder(id: string): Promise<Order> {
  return getJson<Order>(`/orders/${id}`);
}

/* ============================================================
   Operasi TULIS (POST/PUT/DELETE) + parsing error Flask.
   ============================================================ */

async function extractError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body && typeof body.error === "string") return body.error;
    if (body && typeof body.message === "string") return body.message;
  } catch {
    /* body bukan JSON */
  }
  return `Permintaan gagal (${res.status})`;
}

export async function postJson<T>(path: string, data: unknown): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<T>;
}

export async function putJson<T>(path: string, data: unknown): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<T>;
}

export async function del(path: string): Promise<void> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await extractError(res));
}

// --- Fungsi auth/users/orders spesifik ---
export const registerUser = (data: RegisterFormData) =>
  postJson<User>(`/users/`, data);

export const loginUser = (credentials: { email: string; password: string }) =>
  postJson<User>(`/auth/login`, credentials);

// Backend butuh user_id + items. Respons dibungkus { order }.
export async function createOrder(
  userId: number,
  items: { product_id: number; quantity: number }[]
): Promise<Order> {
  const result = await postJson<{ order: Order }>(`/orders/`, {
    user_id: userId,
    items,
  });
  return result.order;
}
