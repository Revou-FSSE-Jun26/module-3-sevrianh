import { test, expect } from "@playwright/test";

/* ============================================================
   tests/home.spec.ts — Test navigasi pertama (Tugas 14.2)
   Menavigasi ke home, assert heading terlihat, klik Products,
   assert URL berubah ke /products. Memakai getByTestId (Req 14.2).

   Memakai page.route() untuk mem-mock API produk agar test tidak
   bergantung pada backend (yang bisa lambat/cold start). Ini juga
   membuat test deterministik.
   ============================================================ */

test.beforeEach(async ({ page }) => {
  // Mock semua request ke endpoint produk backend -> kembalikan data palsu.
  await page.route("**/products/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          product_name: "Produk Uji",
          price: "10000.00",
          stock: 5,
          category_id: 1,
          description: "uji",
        },
      ]),
    });
  });
});

test("home menampilkan heading dan navigasi ke /products", async ({ page }) => {
  await page.goto("/");

  // Assert heading home terlihat (Req 14.1) — pakai testId (Req 14.2).
  await expect(page.getByTestId("home-heading")).toBeVisible();

  // Klik tautan Produk di navbar.
  await page.getByTestId("nav-products").click();

  // Assert URL berubah ke /products (Req 14.1).
  await expect(page).toHaveURL(/\/products/);
});
