/* ============================================================
   Header.tsx — Kepala halaman: brand + NavBar
   Server Component (tidak butuh interaktivitas sendiri).
   ============================================================ */

import Link from "next/link";
import { Suspense } from "react";
import NavBar from "./NavBar";
import AuthNav from "./AuthNav";

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
        {/* AuthNav bergantung status login (username vs Register). */}
        <AuthNav />
      </div>
    </header>
  );
}
