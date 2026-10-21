# Checkpoint 1 — RevoShop Frontend Foundations (Week 1–2)

Dokumentasi progres Checkpoint 1: fondasi **HTML/CSS/JavaScript** dan **TypeScript/Tailwind CSS**.
Ruang lingkup SENGAJA dibatasi pada Week 1–2. React/Next.js, integrasi API, autentikasi, testing,
dan deployment TIDAK termasuk di sini (itu Checkpoint 2 & 3).

## Overview

Checkpoint 1 terdiri dari dua latihan:

1. **Profile Page** (`profile-page/`) — halaman profil semantik dibangun murni dengan HTML5, CSS,
   dan JavaScript (tanpa framework/bundler).
2. **Product Catalog** (`product-catalog/`) — katalog produk interaktif yang fully typed, dibangun
   dengan **Vite + TypeScript + Tailwind CSS**.

Tema warna "Gengar" (ungu) dipakai konsisten di kedua latihan.

## Kriteria yang Dipenuhi

### HTML, CSS & JavaScript Fundamentals (Profile Page)
- [x] Struktur semantik (`header`, `main`, `section`, `footer`), bukan `div` generik.
- [x] Contact form dengan input types sesuai (`text`, `email`, `tel`, `textarea`) + label terkait.
- [x] CSS selector (element/class/id) + box model lengkap (margin, border, padding, content).
- [x] Layout dua dimensi dengan CSS Grid pada section keahlian.
- [x] Responsif dengan media query (verifikasi di lebar mobile).
- [x] Variabel bertipe, operator, dan fungsi di JavaScript.
- [x] Manipulasi DOM: seleksi, update konten, toggle class, buat/hapus elemen.
- [x] Event handler (`click`, `submit`) + `preventDefault`.
- [x] Array methods: `forEach`, `map`, `filter`, `reduce`.

### TypeScript & Tailwind CSS (Product Catalog)
- [x] Setup TypeScript dengan `tsconfig.json` (mode strict) + script `typecheck` (`tsc --noEmit`).
- [x] Interface/type alias untuk data produk (`Product`, `Category`).
- [x] Union type (`StockStatus`).
- [x] Tipe objek bersarang (`category`) dan array bertipe (`tags: string[]`, `Product[]`).
- [x] Instalasi & konfigurasi Tailwind CSS (plugin Vite).
- [x] Tipografi + layout mobile-first responsif (breakpoint `sm/md/lg`).
- [x] Memetakan data bertipe ke string class Tailwind (`statusBadgeClasses`).
- [x] Katalog interaktif: render dari data, live search, dan toggle urutan harga.

## Cara Menjalankan

### Profile Page (HTML/CSS/JS murni)
Buka file berikut langsung di browser (klik dua kali atau seret ke tab browser):

```
checkpoint-1/profile-page/index.html
```

Tidak perlu instalasi apa pun. Semua interaksi (toggle keahlian, submit form, ringkasan array)
berjalan via `script.js`.

### Product Catalog (Vite + TypeScript + Tailwind)
Butuh Node.js dan npm.

```bash
cd checkpoint-1/product-catalog
npm install        # pasang dependency
npm run dev        # jalankan dev server (http://localhost:5173)
npm run typecheck  # cek tipe tanpa output (tsc --noEmit)
npm run build      # build produksi
```

Di browser: ketik pada kolom pencarian untuk memfilter produk secara live, dan klik tombol
"Urutkan Harga" untuk membalik urutan harga.

## Batasan Ruang Lingkup

Checkpoint 1 hanya mencakup fondasi Week 1–2 (HTML/CSS/JS dan TypeScript/Tailwind). Fitur lanjutan
(komponen React, App Router, integrasi API, autentikasi, keranjang, dashboard, Playwright, dan
deployment) berada di Checkpoint 2 (`sevoshop-app/`) dan Checkpoint 3.
