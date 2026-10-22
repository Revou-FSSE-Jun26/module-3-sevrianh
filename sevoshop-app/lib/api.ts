/* ============================================================
   lib/api.ts — Helper pemanggilan API terpusat (SevoShop)
   Menyasar backend SevoShop (Flask API di Render) dan
   MENGADAPTASI respons mentah (BackendProduct/BackendCategory)
   ke bentuk domain (Product/Category) yang dipakai komponen.
   ============================================================ */

import type {
  Product,
  Category,
  Order,
  BackendProduct,
  BackendCategory,
  User,
  RegisterFormData,
} from "./types";

// Baca URL dasar API dari environment (bukan hardcode).
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper generic untuk GET + parse JSON, dengan pemeriksaan res.ok (lapisan error 1).
async function getJson<T>(path: string): Promise<T> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  }

  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Permintaan gagal (${res.status}) untuk ${path}`);
  }

  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------
   ADAPTER: ubah bentuk mentah backend -> bentuk domain.
   - product_name   -> name
   - price (Numeric/string) -> number
   - category_id    -> objek Category { id, name } (name dilengkapi
     dari daftar kategori, atau fallback "Kategori <id>")
   ------------------------------------------------------------ */

function adaptCategory(raw: BackendCategory): Category {
  return { id: raw.id, name: raw.category_name };
}

function adaptProduct(raw: BackendProduct, categoryName?: string): Product {
  return {
    id: raw.id,
    name: raw.product_name,
    price: Number(raw.price),
    stock: raw.stock,
    category: {
      id: raw.category_id,
      name: categoryName ?? `Kategori ${raw.category_id}`,
    },
  };
}

// GET /category/ -> BackendCategory[] (collection: pakai trailing slash).
export async function getCategories(): Promise<Category[]> {
  const rows = await getJson<BackendCategory[]>(`/category/`);
  return rows.map(adaptCategory);
}

// Peta id kategori -> nama, untuk melengkapi category.name pada produk
// (endpoint produk hanya mengembalikan category_id).
async function categoryNameMap(): Promise<Map<number, string>> {
  try {
    const rows = await getJson<BackendCategory[]>(`/category/`);
    return new Map(rows.map((r) => [r.id, r.category_name]));
  } catch {
    // Jika kategori gagal diambil, produk tetap tampil dengan nama fallback.
    return new Map();
  }
}

// GET /products/ -> BackendProduct[] (collection: pakai trailing slash).
export async function getProducts(_query = ""): Promise<Product[]> {
  const [raw, names] = await Promise.all([
    getJson<BackendProduct[]>(`/products/`),
    categoryNameMap(),
  ]);
  return raw.map((p) => adaptProduct(p, names.get(p.category_id)));
}

// GET /products/<id> -> BackendProduct (item endpoint: TANPA trailing slash).
export async function getProduct(id: string): Promise<Product> {
  const raw = await getJson<BackendProduct>(`/products/${id}`);
  const names = await categoryNameMap();
  return adaptProduct(raw, names.get(raw.category_id));
}

// GET /orders/ -> Order[] (collection: pakai trailing slash).
export async function getOrders(): Promise<Order[]> {
  return getJson<Order[]>(`/orders/`);
}


/* ============================================================
   Checkpoint 3: helper operasi TULIS (POST/PUT/DELETE)
   Memeriksa res.ok; pada gagal, mem-parse body { error } Flask
   dan melempar Error dengan pesan tersebut (untuk form/toast).
   ============================================================ */

// Ambil pesan error dari body respons (Flask mengembalikan { error }).
async function extractError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body && typeof body.error === "string") return body.error;
  } catch {
    // body bukan JSON atau kosong — abaikan.
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

/* ------------------------------------------------------------
   Fungsi API spesifik Checkpoint 3 (dipakai form & dashboard).
   Catatan: ini menyasar endpoint backend SevoShop; berfungsi
   penuh saat backend nyata tersedia (atau di-mock saat testing).
   ------------------------------------------------------------ */

// Collection endpoint pakai trailing slash (/users/, /orders/).
// Login adalah action path tanpa slash (/auth/login).
export const registerUser = (data: RegisterFormData) =>
  postJson<User>(`/users/`, data);

export const loginUser = (credentials: { email: string; password: string }) =>
  postJson<User>(`/auth/login`, credentials);

export const createOrder = (items: { product_id: number; quantity: number }[]) =>
  postJson<Order>(`/orders/`, { items });
