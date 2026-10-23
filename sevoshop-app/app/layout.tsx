import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

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
        {/* AuthProvider menyediakan sesi ke seluruh aplikasi (Req 2.4). */}
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
              {children}
            </main>
            <Footer />
            {/* Toaster: tempat notifikasi react-hot-toast muncul (Req 12.1). */}
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
