import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Catatan: Google Fonts (next/font/google) dilepas agar aplikasi tidak
// bergantung pada koneksi ke fonts.gstatic.com saat dev/build. Kita pakai
// font sistem (sans-serif) via Tailwind.

// Metadata default untuk seluruh aplikasi (Req 10.1).
export const metadata: Metadata = {
  title: "SevoShop — Toko Online",
  description: "Frontend SevoShop: jelajahi produk, kategori, dan pesanan.",
};

// Root Layout membungkus SETIAP halaman dengan Header dan Footer (Req 6.2).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
