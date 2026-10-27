import { test, expect } from "@playwright/test";

/* ============================================================
   tests/dashboard-crud.admin.spec.ts — Dashboard CRUD (Tugas 15.3)

   Project "admin" memakai storageState tests/.auth/admin.json, jadi
   test berjalan sebagai admin (AdminRoute meloloskan role "admin").

   Semua request produk di-mock. lib/api memakai bentuk MENTAH backend
   dan membungkus respons tulis dalam { product }.

   Alur: dashboard -> create (toast + baris baru) -> edit (harga baru)
   -> delete (baris hilang).
   ============================================================ */

// State awal tabel: satu produk mentah.
const initial = {
  id: 1,
  product_name: "Topi Gengar",
  price: "80000.00",
  stock: 5,
  category_id: 1,
  description: "Topi ungu",
};

test.beforeEach(async ({ page }) => {
  // Router tunggal untuk semua metode pada endpoint produk.
  await page.route("**/products/**", async (route) => {
    const req = route.request();
    const method = req.method();
    const url = req.url();

    if (method === "GET") {
      // Daftar awal.
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([initial]),
      });
      return;
    }

    if (method === "POST") {
      // Create -> produk baru dibungkus { product }.
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          product: {
            id: 2,
            product_name: "Sepatu Gengar",
            price: "250000.00",
            stock: 7,
            category_id: 1,
            description: "",
          },
        }),
      });
      return;
    }

    if (method === "PUT") {
      // Update -> kembalikan produk dengan harga baru.
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          product: {
            id: 1,
            product_name: "Topi Gengar",
            price: "95000.00",
            stock: 5,
            category_id: 1,
            description: "Topi ungu",
          },
        }),
      });
      return;
    }

    if (method === "DELETE") {
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
      return;
    }

    await route.fallback();
  });
});

test("admin: create -> edit -> delete produk di dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  // Pastikan dashboard (bukan redirect) dan produk awal tampil.
  await expect(page.getByRole("heading", { name: "Manajemen Produk" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Topi Gengar" })).toBeVisible();

  // --- CREATE ---
  await page.getByRole("button", { name: "+ Produk Baru" }).click();
  await page.getByLabel("Nama").fill("Sepatu Gengar");
  await page.getByLabel("Harga").fill("250000");
  await page.getByLabel("Stok").fill("7");
  await page.getByRole("button", { name: "Buat" }).click();

  await expect(page.getByText("Produk dibuat.")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Sepatu Gengar" })).toBeVisible();

  // --- EDIT (ubah harga Topi Gengar) ---
  // Baris Topi Gengar -> tombol Edit.
  const topiRow = page.getByRole("row", { name: /Topi Gengar/ });
  await topiRow.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Harga").fill("95000");
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page.getByText("Produk diperbarui.")).toBeVisible();
  // Harga baru tampil (format Rp id-ID: 95.000).
  await expect(page.getByRole("cell", { name: "Rp 95.000" })).toBeVisible();

  // --- DELETE (hapus Topi Gengar) ---
  const topiRowAfter = page.getByRole("row", { name: /Topi Gengar/ });
  await topiRowAfter.getByRole("button", { name: "Hapus" }).click();
  // Konfirmasi inline -> klik "Ya".
  await topiRowAfter.getByRole("button", { name: "Ya" }).click();

  await expect(page.getByText("Produk dihapus.")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Topi Gengar" })).toHaveCount(0);
});
