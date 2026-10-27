"use client";

/* ============================================================
   AdminRoute.tsx — Membatasi halaman untuk admin saja
   - Belum login          -> /login
   - Login tapi non-admin  -> /
   (Req 4.2)

   Menunggu sesi selesai dipulihkan (isLoading) sebelum memutuskan
   redirect, agar admin yang me-refresh dashboard tidak keliru dilempar.
   ============================================================ */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading, currentUser } = useAuth();
  const router = useRouter();

  const isAdmin = isLoggedIn && currentUser?.role === "admin";

  // Putuskan redirect hanya setelah sesi selesai dipulihkan.
  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (currentUser?.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, currentUser, router]);

  // Tahan konten sampai sesi dipulihkan dan dipastikan admin.
  if (isLoading) {
    return <p className="text-gray-500">Memeriksa sesi...</p>;
  }
  if (!isAdmin) {
    return <p className="text-gray-500">Memeriksa akses admin...</p>;
  }

  return <>{children}</>;
}
