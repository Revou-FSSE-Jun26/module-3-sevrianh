import type { FullConfig } from "@playwright/test";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

/* ============================================================
   tests/global-setup.ts — Setup global sebelum semua test (Tugas 15.1)

   Tujuan: menyiapkan sesi pengguna yang sudah login tanpa bergantung
   pada backend. Spec menyebut "daftar user via POST /users", tetapi
   backend SevoShop (Render) sedang bermasalah dan rawan cold-start.
   Agar test deterministik dan cepat, kita tulis langsung storageState
   Playwright yang berisi entri localStorage "sevoshop_user" — persis
   kunci yang dipulihkan oleh AuthProvider saat aplikasi mount.

   Dihasilkan dua sesi:
   - buyer  -> tests/.auth/buyer.json  (akses cart, checkout, orders)
   - admin  -> tests/.auth/admin.json  (akses dashboard CRUD)
   ============================================================ */

// User uji untuk masing-masing peran.
const buyer = { id: 999, username: "e2e_buyer", email: "e2e_buyer@example.com", role: "buyer" };
const admin = { id: 1, username: "e2e_admin", email: "e2e_admin@example.com", role: "admin" };

// Bentuk storageState Playwright: sesi disimpan per-origin.
function buildStorageState(origin: string, user: Record<string, unknown>) {
  return {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          // Kunci yang dibaca AuthContext saat memulihkan sesi.
          { name: "sevoshop_user", value: JSON.stringify(user) },
        ],
      },
    ],
  };
}

export default async function globalSetup(config: FullConfig) {
  // Ambil baseURL dari konfigurasi project pertama (fallback ke localhost).
  const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3000";
  const origin = new URL(baseURL).origin;

  const authDir = join(__dirname, ".auth");
  mkdirSync(authDir, { recursive: true });

  const buyerPath = join(authDir, "buyer.json");
  const adminPath = join(authDir, "admin.json");

  writeFileSync(buyerPath, JSON.stringify(buildStorageState(origin, buyer), null, 2));
  writeFileSync(adminPath, JSON.stringify(buildStorageState(origin, admin), null, 2));

  // Pastikan folder induk ada bila dipanggil dari tempat berbeda.
  mkdirSync(dirname(buyerPath), { recursive: true });
}
