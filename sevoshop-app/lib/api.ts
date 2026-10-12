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
