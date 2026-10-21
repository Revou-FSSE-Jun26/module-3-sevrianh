"use client";

/* ============================================================
   AdminRoute.tsx — Membatasi halaman untuk admin saja
   - Belum login        -> /login
   - Login tapi non-admin -> /
   (Req 4.2)
   ============================================================ */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, currentUser } = useAuth();
  const router = useRouter();

  const isAdmin = isLoggedIn && currentUser?.role === "admin";

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (currentUser?.role !== "admin") {
      router.replace("/");
    }
  }, [isLoggedIn, currentUser, router]);

  // Tahan konten sampai dipastikan admin.
  if (!isAdmin) {
    return <p className="text-gray-500">Memeriksa akses admin...</p>;
  }

  return <>{children}</>;
}
