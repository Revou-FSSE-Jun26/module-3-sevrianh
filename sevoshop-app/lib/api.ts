/* ============================================================
   lib/api.ts — Helper pemanggilan API terpusat (SevoShop)
   Semua fetch ke backend lewat sini agar konsisten dan mudah dirawat.
   ============================================================ */

import type { Product, Category, Order } from "./types";

// Baca URL dasar API dari environment (bukan hardcode).
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* Helper generic untuk GET + parse JSON.
   <T> adalah tipe data yang diharapkan dari respons.
   Lapisan error pertama: pemeriksaan res.ok -> melempar Error bertipe. */
async function getJson<T>(path: string): Promise<T> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi.");
  }

  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    // Dilempar agar ditangkap oleh error.tsx (lapisan kedua).
    throw new Error(`Permintaan gagal (${res.status}) untuk ${path}`);
  }

  return res.json() as Promise<T>;
}

// Fungsi-fungsi API spesifik yang dipakai halaman.
export function getProducts(query = ""): Promise<Product[]> {
  return getJson<Product[]>(`/products${query}`);
}

export function getProduct(id: string): Promise<Product> {
  return getJson<Product>(`/products/${id}`);
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>(`/categories`);
}

export function getOrders(): Promise<Order[]> {
  return getJson<Order[]>(`/orders`);
}
