import { test, expect } from "@playwright/test";

/* ============================================================
   tests/register.spec.ts — Validasi form registrasi (Tugas 14.3)
   Menguji bahwa aturan validasi menampilkan pesan error yang tepat.
   ============================================================ */

test.describe("Validasi RegisterForm", () => {
  test("menampilkan error saat field kosong / tidak valid", async ({ page }) => {
    await page.goto("/register");

    // Submit form kosong -> harus muncul error username & email.
    await page.getByRole("button", { name: "Daftar" }).click();
    await expect(page.getByText("Username wajib diisi.")).toBeVisible();
    await expect(page.getByText("Format email tidak valid.")).toBeVisible();
  });

  test("menampilkan error saat password terlalu pendek & tidak cocok", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("Username").fill("tester");
    await page.getByLabel("Email").fill("tester@example.com");
    await page.getByLabel("Password", { exact: true }).fill("123"); // < 8 karakter
    await page.getByLabel("Konfirmasi Password").fill("456");       // tidak cocok

    await page.getByRole("button", { name: "Daftar" }).click();

    await expect(page.getByText("Password minimal 8 karakter.")).toBeVisible();
    await expect(page.getByText("Konfirmasi password tidak cocok.")).toBeVisible();
  });
});
