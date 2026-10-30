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

/* --- Auth helper ---
   lib/api.ts adalah modul biasa (bukan komponen React), jadi tidak bisa
   memakai hook useAuth. Token dibaca langsung dari localStorage dengan
   kunci yang sama seperti AuthContext (TOKEN_KEY = "sevoshop_token").
   Guard `typeof window` agar aman saat dieksekusi di server (SSR). */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sevoshop_token");
}

// Bentuk header Authorization bila token tersedia; kosong bila tidak.
function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// --- GET generic dengan pemeriksaan res.ok (lapisan error 1) ---
// `auth=true` melampirkan Authorization header untuk GET terproteksi.
async function getJson<T>(path: string, auth = false): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`, auth ? { headers: authHeaders() } : undefined);
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

// Ambil satu kategori berdasarkan id (GET /category/<id>).
export async function getCategory(id: number | string): Promise<Category> {
  const raw = await getJson<RawCategory>(`/category/${id}`);
  return adaptCategory(raw);
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
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<T>;
}

export async function putJson<T>(path: string, data: unknown): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<T>;
}

export async function del(path: string): Promise<void> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(await extractError(res));
}

// --- Fungsi auth/users/orders spesifik ---
export const registerUser = (data: RegisterFormData) =>
  postJson<User>(`/users/`, data);

/* --- Login ---
   Backend /auth/login hanya mengembalikan { success, message, token }.
   Jadi: 1) kirim kredensial -> dapat JWT, 2) GET /auth/me (Bearer token)
   untuk profil lengkap (termasuk role). Endpoint GET /users/<id> kini
   admin-only, sehingga pengambilan profil lewat /auth/me lebih tepat dan
   berlaku untuk semua peran (buyer maupun admin). */

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");

  // 1) Login -> token
  const res = await postJson<LoginResponse>(`/auth/login`, credentials);
  if (!res.token) throw new Error(res.message || "Login gagal");

  // 2) Ambil profil dari /auth/me dengan token sebagai Bearer header.
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${res.token}` },
  });
  if (!meRes.ok) {
    throw new Error(`Gagal mengambil profil pengguna (${meRes.status})`);
  }
  const user = (await meRes.json()) as User;

  return { user, token: res.token };
}

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

/* --- CRUD Produk (dashboard admin) ---
   Payload backend: product_name, price, stock, category_id, description.
   Respons dibungkus { product }. */
export interface ProductInput {
  product_name: string;
  price: number;
  stock: number;
  category_id: number;
  description?: string;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const result = await postJson<{ product: RawProduct }>(`/products/`, input);
  return adaptProduct(result.product);
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const result = await putJson<{ product: RawProduct }>(`/products/${id}`, input);
  return adaptProduct(result.product);
}

export function deleteProduct(id: number): Promise<void> {
  return del(`/products/${id}`);
}

/* --- CRUD Kategori (dashboard admin) ---
   Endpoint: /category/ (singular). Payload: category_name, description.
   Respons dibungkus { category }. */
export interface CategoryInput {
  category_name: string;
  description?: string;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const result = await postJson<{ category: RawCategory }>(`/category/`, input);
  return adaptCategory(result.category);
}

export async function updateCategory(id: number, input: CategoryInput): Promise<Category> {
  const result = await putJson<{ category: RawCategory }>(`/category/${id}`, input);
  return adaptCategory(result.category);
}

export function deleteCategory(id: number): Promise<void> {
  return del(`/category/${id}`);
}
