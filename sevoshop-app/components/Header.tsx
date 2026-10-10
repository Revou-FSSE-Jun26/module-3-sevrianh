/* ============================================================
   Header.tsx — Kepala halaman: brand + NavBar
   Server Component (tidak butuh interaktivitas sendiri).
   ============================================================ */

import Link from "next/link";
import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="bg-indigo-700 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          SevoShop
        </Link>
        <NavBar />
      </div>
    </header>
  );
}
