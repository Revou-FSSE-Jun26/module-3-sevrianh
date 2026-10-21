/* ============================================================
   lib/api.ts — Helper pemanggilan API terpusat (SevoShop)
   Saat ini menyasar Fake Store API (sementara) dan MENGADAPTASI
   responsnya ke bentuk domain (Product/Category). Dengan begitu,
   komponen tetap memakai tipe domain dan tidak perlu diubah saat
   nanti berpindah kembali ke backend SevoShop (Render).
   ============================================================ */

import type {
  Product,
  Category,
  Order,
  FakeStoreProduct,
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
   ADAPTER: ubah FakeStoreProduct -> Product (bentuk domain).
   - title    -> name
   - category (string) -> Category objek (id di-hash dari nama)
   - stock    -> Fake Store tidak punya; kita derivasi dummy stabil
   ------------------------------------------------------------ */

// Buat id kategori yang stabil dari nama (hash sederhana).
function categoryIdFromName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 100000;
  }
  return hash;
}

function adaptProduct(raw: FakeStoreProduct): Product {
  return {
    id: raw.id,
    name: raw.title,
    price: raw.price,
    // Fake Store tidak punya stok; derivasi angka stabil dari id (0-19)
    // agar sebagian produk tampak "habis" untuk menguji conditional rendering.
    stock: raw.id % 20,
    category: { id: categoryIdFromName(raw.category), name: raw.category },
    image: raw.image,
  };
}

// Mengubah string query domain (mis. "?search=foo") -> perilaku Fake Store.
// Fake Store tidak punya pencarian server-side, jadi untuk sekarang kita
// ambil semua produk; penyaringan dilakukan di sisi klien pada tugas berikutnya.
export async function getProducts(_query = ""): Promise<Product[]> {
  const raw = await getJson<FakeStoreProduct[]>(`/products`);
  return raw.map(adaptProduct);
}

export async function getProduct(id: string): Promise<Product> {
  const raw = await getJson<FakeStoreProduct>(`/products/${id}`);
  return adaptProduct(raw);
}

// Fake Store: GET /products/categories -> string[]. Diadaptasi ke Category[].
export async function getCategories(): Promise<Category[]> {
  const names = await getJson<string[]>(`/products/categories`);
  return names.map((name) => ({ id: categoryIdFromName(name), name }));
}

// Fake Store tidak punya /orders. Dikembalikan array kosong sementara,
// agar halaman orders tetap bisa dibangun tanpa error.
export async function getOrders(): Promise<Order[]> {
  return [];
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

export const registerUser = (data: RegisterFormData) =>
  postJson<User>(`/users`, data);

export const loginUser = (credentials: { email: string; password: string }) =>
  postJson<User>(`/auth/login`, credentials);

export const createOrder = (items: { product_id: number; quantity: number }[]) =>
  postJson<Order>(`/orders`, { items });
