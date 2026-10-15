# SevoShop — Frontend (Next.js)

Frontend toko online SevoShop, dibangun dengan **Next.js (App Router)**, **TypeScript**,
dan **Tailwind CSS**. Dikembangkan sebagai Checkpoint 2 (fondasi React/Next.js) dan dirancang
untuk berlanjut ke Checkpoint 3 (autentikasi, keranjang, dashboard, testing, deployment).

## Fitur (Checkpoint 2)

- Home menampilkan produk unggulan (Server Component).
- Halaman produk dengan pencarian live dan filter kategori.
- Halaman detail produk dengan judul halaman dinamis (`generateMetadata`).
- Halaman kategori dan pesanan (Server Components).
- Navigasi dengan penanda route aktif (`usePathname`).
- Form tambah produk (controlled form + validasi).
- Error handling tiga lapis (`res.ok`, `error.tsx`, `loading.tsx`) di setiap route data.

## Teknologi

Next.js (App Router), React, TypeScript, Tailwind CSS, `next/navigation`,
`NEXT_PUBLIC_API_BASE_URL` untuk konfigurasi API berbasis environment.

## Struktur Proyek

```
sevoshop-app/
├── app/                  # Route App Router (page/layout/loading/error)
│   ├── layout.tsx        # Root layout: Header + Footer + metadata
│   ├── page.tsx          # Home (Server Component)
│   ├── products/         # List, detail [id], loading, error, nested layout
│   ├── categories/       # List kategori + loading + error
│   └── orders/           # List pesanan + loading + error
├── components/           # Komponen UI (Header, Footer, NavBar, Card, ProductCard, ...)
├── lib/                  # Utilitas terpusat
│   ├── types.ts          # Tipe domain (Product, Category, Order)
│   ├── api.ts            # Helper fetch (res.ok, baca NEXT_PUBLIC_API_BASE_URL)
│   └── ui.ts             # Helper styling (getButtonClasses)
├── context/              # (Checkpoint 3) AuthContext, CartContext
├── hooks/                # (Checkpoint 3) useAuth, useCart, useLocalStorage
├── .env.local            # NEXT_PUBLIC_API_BASE_URL (tidak di-commit)
└── .env.example          # Template environment
```

## Konfigurasi Environment

Salin `.env.example` ke `.env.local`, lalu set URL API:

```
NEXT_PUBLIC_API_BASE_URL=https://sevoshop.onrender.com
```

Catatan: ini URL **Flask API** (Render), bukan URL database Supabase.
Selama backend diperbaiki, pengembangan sementara memakai Fake Store API
(`https://fakestoreapi.com`) dengan adapter di `lib/api.ts`.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

Perintah lain:

```bash
npm run build      # build produksi (tsc + next build)
npx tsc --noEmit   # cek tipe tanpa output
```

## Keberlanjutan ke Checkpoint 3

Struktur `app/`, `components/`, `lib/` sudah terpisah rapi. Folder `context/` dan `hooks/`
disiapkan untuk auth dan cart. Tipe domain terpusat di `lib/types.ts` dan utilitas API di
`lib/api.ts` dapat dipakai ulang tanpa pembongkaran.
