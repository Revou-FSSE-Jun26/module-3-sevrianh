import { defineConfig, devices } from "@playwright/test";
import { join } from "path";

/* ============================================================
   playwright.config.ts — Konfigurasi Playwright E2E
   - testDir   : folder berisi test
   - baseURL   : alamat app saat test (dari env atau default lokal)
   - globalSetup: menyiapkan storageState sesi login sebelum test
   - projects  : "chromium" (publik), "buyer" & "admin" (login)
   - webServer : otomatis menjalankan `npm run dev` sebelum test
   ============================================================ */

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  // Jalankan sekali sebelum semua test: tulis storageState buyer & admin.
  globalSetup: "./tests/global-setup.ts",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    // Project publik (tanpa sesi login): home, register, validasi, login gagal.
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /.*\.(buyer|admin)\.spec\.ts/,
    },
    // Project buyer: memakai sesi buyer; untuk alur cart/checkout.
    {
      name: "buyer",
      use: {
        ...devices["Desktop Chrome"],
        storageState: join(__dirname, "tests/.auth/buyer.json"),
      },
      testMatch: /.*\.buyer\.spec\.ts/,
    },
    // Project admin: memakai sesi admin; untuk dashboard CRUD.
    {
      name: "admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: join(__dirname, "tests/.auth/admin.json"),
      },
      testMatch: /.*\.admin\.spec\.ts/,
    },
  ],
  // Jalankan dev server lokal otomatis (dilewati bila menguji URL produksi).
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
