import { test, expect } from "@playwright/test";

/* ============================================================
   tests/auth.spec.ts — Alur registrasi & login lengkap (Tugas 14.3)
   Memakai page.route() untuk mem-mock POST /users dan POST /auth/login
   agar test tidak bergantung backend dan deterministik.
   ============================================================ */

const fakeUser = { id: 99, username: "tester", email: "tester@example.com", role: "buyer" };

test("registrasi berhasil -> redirect ke home & username di header", async ({ page }) => {
  // Mock POST /users -> 201 user baru.
  await page.route("**/users/", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(fakeUser) });
    } else {
      await route.fallback();
    }
  });
  // Setelah registrasi, RegisterForm memanggil loginUser() yang melakukan
  // POST /auth/login (-> token) lalu GET /auth/me (-> profil). Mock keduanya.
  await page.route("**/auth/login", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "ok", token: "e2e.fake.token" }),
      });
    } else {
      await route.fallback();
    }
  });
  await page.route("**/auth/me", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeUser),
      });
    } else {
      await route.fallback();
    }
  });
  // Mock produk di home agar tidak bergantung backend.
  await page.route("**/products/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" })
  );

  await page.goto("/register");
  await page.getByLabel("Username").fill("tester");
  await page.getByLabel("Email").fill("tester@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("Konfirmasi Password").fill("password123");
  await page.getByRole("button", { name: "Daftar" }).click();

  // Setelah sukses: redirect ke home dan username tampil di header.
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Halo, tester")).toBeVisible();
});

test("login gagal -> pesan error form-level", async ({ page }) => {
  // Mock POST /auth/login -> 401.
  await page.route("**/auth/login", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "wrong", success: false }),
    })
  );

  await page.goto("/login");
  await page.getByLabel("Email").fill("salah@example.com");
  await page.getByLabel("Password").fill("salahpassword");
  await page.getByRole("button", { name: "Masuk" }).click();

  await expect(page.getByText("Invalid email or password")).toBeVisible();
});
