/* ============================================================
   Header.tsx — Kepala halaman: brand + NavBar
   Server Component (tidak butuh interaktivitas sendiri).
   ============================================================ */

import Link from "next/link";
import { Suspense } from "react";
import NavBar from "./NavBar";
import AuthNav from "./AuthNav";
import CartNav from "./CartNav";

export default function Header() {
  return (
    <header className="bg-gengar-indigo text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          SevoShop
        </Link>
        {/* NavBar memakai usePathname() (data URL runtime), jadi dibungkus
            <Suspense> agar halaman tetap bisa diprerender (Next.js 16). */}
        <Suspense fallback={<div className="h-6" />}>
          <NavBar />
        </Suspense>
        {/* Ikon keranjang + badge jumlah item (link ke /cart). */}
        <div className="flex items-center gap-2">
          <CartNav />
          {/* AuthNav bergantung status login (username vs Register). */}
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
