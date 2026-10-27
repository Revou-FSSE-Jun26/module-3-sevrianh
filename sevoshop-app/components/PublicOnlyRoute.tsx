"use client";

/* ============================================================
   PublicOnlyRoute.tsx — Halaman untuk pengguna BELUM login
   Bila sudah login, arahkan ke / (Req 4.4). Dipakai untuk
   /login dan /register agar pengguna yang sudah masuk tidak
   membukanya lagi.

   Menunggu sesi selesai dipulihkan (isLoading) sebelum memutuskan
   redirect, agar form tidak berkedip lalu salah redirect.
   ============================================================ */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, router]);

  // Selama sesi masih dipulihkan, jangan tampilkan apa-apa dulu.
  if (isLoading) {
    return <p className="text-gray-500">Memeriksa sesi...</p>;
  }
  // Bila sudah login (menunggu redirect), jangan tampilkan form publik.
  if (isLoggedIn) {
    return <p className="text-gray-500">Mengarahkan...</p>;
  }

  return <>{children}</>;
}
