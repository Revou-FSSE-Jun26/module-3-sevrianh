"use client";

/* ============================================================
   ProtectedRoute.tsx — Membatasi halaman untuk pengguna login
   Bila belum login, arahkan ke /login (Req 4.1).

   Menunggu sesi selesai dipulihkan (isLoading) sebelum memutuskan
   redirect, agar pengguna yang me-refresh tidak keliru dilempar
   ke /login saat sesi masih dalam proses dipulihkan.
   ============================================================ */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  // Redirect hanya SETELAH sesi selesai dipulihkan dan memang belum login.
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // Selama sesi masih dipulihkan atau belum login, jangan tampilkan konten.
  if (isLoading) {
    return <p className="text-gray-500">Memeriksa sesi...</p>;
  }
  if (!isLoggedIn) {
    return <p className="text-gray-500">Mengarahkan ke halaman login...</p>;
  }

  return <>{children}</>;
}
