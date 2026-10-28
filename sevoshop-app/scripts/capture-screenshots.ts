import { test } from "@playwright/test";
import { join } from "path";

/* ============================================================
   scripts/capture-screenshots.ts
   ------------------------------------------------------------
   Skrip BANTU untuk menangkap screenshot seluruh halaman utama
   (README Req 15.3). Bukan test asersi — hanya membuka halaman,
   menunggu konten, lalu menyimpan PNG ke docs/screenshots/.

   Ditaruh di luar folder `tests/` agar TIDAK ikut berjalan saat
   `npm run test:e2e`. Skrip ini mandiri: menyuntik sesi admin
   sendiri lewat addInitScript (key localStorage "sevoshop_user"),
   jadi /dashboard langsung terbuka tanpa bergantung storageState.

   Cara menjalankan (lihat instruksi di chat):
     npx playwright test scripts/capture-screenshots.ts --project=chromium
   Set PLAYWRIGHT_BASE_URL untuk menembak URL produksi.
   ============================================================ */

const OUT = join(__dirname, "..", "docs", "screenshots");

// Sesi admin yang dipulihkan AuthProvider saat mount.
const adminUser = {
  id: 1,
  username: "e2e_admin",
  email: "e2e_admin@example.com",
  role: "admin",
};

// Helper: buka path, tunggu konten client settle, simpan PNG full page.
async function shot(page: import("@playwright/test").Page, path: string, file: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, file), fullPage: true });
}

// --- Halaman dengan sesi admin (header "Halo, ...", akses /dashboard) ---
test("capture: home, products, detail, categories, dashboard", async ({ page }) => {
  await page.addInitScript((user) => {
    localStorage.setItem("sevoshop_user", JSON.stringify(user));
  }, adminUser);

  await shot(page, "/", "home.png");
  await shot(page, "/products", "products.png");
  await shot(page, "/products/1", "product-detail.png");
  await shot(page, "/categories", "categories.png");
  await shot(page, "/dashboard", "dashboard.png");
});

// --- Register & Login butuh kondisi BELUM login ---
// PublicOnlyRoute me-redirect user yang sudah login ke "/", jadi untuk
// dua halaman ini kita pastikan sesi kosong lebih dulu.
test("capture: register & login (tanpa sesi)", async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.removeItem("sevoshop_user"); } catch {}
  });
  await shot(page, "/register", "register.png");
  await shot(page, "/login", "login.png");
});
