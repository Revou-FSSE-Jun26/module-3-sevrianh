import { test, expect } from "@playwright/test";

/* ============================================================
   tests/cart-journey.buyer.spec.ts — Alur belanja buyer (Tugas 15.2)

   Project "buyer" memakai storageState tests/.auth/buyer.json, jadi
   test berjalan sebagai user login.

   Catatan desain: halaman /products dan / mengambil data di SERVER
   (Server Component), sehingga page.route() (yang hanya mencegat
   request browser) tidak bisa mengontrolnya. Karena itu kita menyuntik
   keranjang langsung ke localStorage ("sevoshop_cart") lewat
   addInitScript — skrip ini berjalan SEBELUM skrip halaman pada setiap
   navigasi, jadi CartProvider langsung memulihkan keranjang saat mount
   tanpa perlu reload (lebih deterministik). Halaman /cart, /checkout,
   dan /orders semuanya Client Component, jadi fetch-nya aman di-mock.

   Alur: keranjang terisi -> /cart -> Checkout -> Confirm Order ->
   redirect /orders.
   ============================================================ */

// Item keranjang berbentuk domain (Product sudah teradaptasi).
const cartItem = {
  product: {
    id: 1,
    name: "Kaos Gengar",
    price: 150000,
    stock: 10,
    categoryId: 1,
    description: "Kaos ungu Gengar",
  },
  quantity: 1,
};

test.beforeEach(async ({ page }) => {
  // Tanam keranjang SEBELUM halaman memuat (berlaku untuk semua navigasi).
  await page.addInitScript((item) => {
    localStorage.setItem("sevoshop_cart", JSON.stringify([item]));
  }, cartItem);

  // Mock orders list + pembuatan order (halaman client-side).
  await page.route("**/orders/", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: 501, user_id: 999, total_amount: 150000, status: "pending" },
        ]),
      });
    } else {
      // POST /orders/ -> order baru (respons dibungkus { order }).
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          order: { id: 501, user_id: 999, total_amount: 150000, status: "pending" },
        }),
      });
    }
  });
});

test("buyer: keranjang -> checkout -> pesanan", async ({ page }) => {
  // 1. Buka keranjang; item yang ditanam tampil beserta total.
  await page.goto("/cart");
  await expect(page.getByRole("cell", { name: "Kaos Gengar" })).toBeVisible();
  await expect(page.getByText("Total: Rp 150.000")).toBeVisible();

  // 2. Lanjut ke checkout.
  await page.getByRole("link", { name: "Lanjut ke Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  // Ringkasan order menampilkan item.
  await expect(page.getByText("Kaos Gengar × 1")).toBeVisible();

  // 3. Confirm Order -> POST /orders/ (mock 201) -> redirect /orders.
  await page.getByRole("button", { name: "Confirm Order" }).click();
  await expect(page.getByText("Pesanan berhasil dibuat!")).toBeVisible();
  await expect(page).toHaveURL(/\/orders/);
  await expect(page.getByText("#501")).toBeVisible();
});
