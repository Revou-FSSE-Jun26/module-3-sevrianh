import type { FullConfig } from "@playwright/test";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

/* ============================================================
   tests/global-setup.ts — Setup global sebelum semua test (Tugas 15.1)

   Tujuan: menyiapkan sesi pengguna yang sudah login tanpa bergantung
   pada backend. Spec menyebut "daftar user via POST /users", tetapi
   backend SevoShop (Render) sedang bermasalah dan rawan cold-start.
   Agar test deterministik dan cepat, kita tulis langsung storageState
   Playwright yang berisi entri localStorage "sevoshop_user" DAN
   "sevoshop_token" — persis dua kunci yang dipulihkan oleh AuthProvider
   saat aplikasi mount. Token (JWT palsu namun well-formed) membuat
   komponen yang membaca token (lib/api.ts untuk CRUD dashboard) berperilaku
   seperti sesi login yang membawa Bearer token.

   Dihasilkan dua sesi:
   - buyer  -> tests/.auth/buyer.json  (akses cart, checkout, orders)
   - admin  -> tests/.auth/admin.json  (akses dashboard CRUD)
   ============================================================ */

// JWT palsu namun well-formed dipakai untuk kedua sesi. Request ke backend
// di-mock oleh page.route() pada masing-masing spec, jadi token tidak perlu
// valid secara kriptografis — hanya perlu ada agar lib/api.ts melampirkannya.
const fakeToken = "e2e.fake.token";

// User uji untuk masing-masing peran.
const buyer = { id: 999, username: "e2e_buyer", email: "e2e_buyer@example.com", role: "buyer" };
const admin = { id: 1, username: "e2e_admin", email: "e2e_admin@example.com", role: "admin" };

// Bentuk storageState Playwright: sesi disimpan per-origin.
function buildStorageState(origin: string, user: Record<string, unknown>, token: string) {
  return {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          // Kunci yang dibaca AuthContext saat memulihkan sesi.
          { name: "sevoshop_user", value: JSON.stringify(user) },
          // Token yang dipulihkan AuthContext & dibaca lib/api.ts (Authorization: Bearer).
          { name: "sevoshop_token", value: token },
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

  writeFileSync(buyerPath, JSON.stringify(buildStorageState(origin, buyer, fakeToken), null, 2));
  writeFileSync(adminPath, JSON.stringify(buildStorageState(origin, admin, fakeToken), null, 2));

  // Pastikan folder induk ada bila dipanggil dari tempat berbeda.
  mkdirSync(dirname(buyerPath), { recursive: true });
}
