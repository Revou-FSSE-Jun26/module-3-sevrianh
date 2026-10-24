import { defineConfig, devices } from "@playwright/test";

/* ============================================================
   playwright.config.ts — Konfigurasi Playwright E2E
   - testDir: folder berisi test
   - baseURL: alamat app saat test (dibaca dari env atau default lokal)
   - webServer: otomatis menjalankan `npm run dev` sebelum test
   ============================================================ */

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
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
