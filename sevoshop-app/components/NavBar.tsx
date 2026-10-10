"use client";

/* ============================================================
   NavBar.tsx — Navigasi dengan penanda route aktif
   Client Component karena memakai hook usePathname().
   ============================================================ */

import Link from "next/link";
import { usePathname } from "next/navigation";

// Daftar tautan navigasi internal.
const links = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/categories", label: "Kategori" },
  { href: "/orders", label: "Pesanan" },
];

export default function NavBar() {
  // usePathname() mengembalikan path URL saat ini, mis. "/products".
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama">
      <ul className="flex gap-6">
        {links.map((link) => {
          // Route aktif: path cocok persis, atau (untuk non-root) path diawali href.
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                // Styling berbeda untuk route aktif (penanda).
                className={
                  isActive
                    ? "font-semibold text-white underline underline-offset-4"
                    : "text-indigo-100 hover:text-white"
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
