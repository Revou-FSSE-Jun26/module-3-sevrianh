"use client";

/* ============================================================
   ProtectedRoute.tsx — Membatasi halaman untuk pengguna login
   Bila belum login, arahkan ke /login (Req 4.1).
   ============================================================ */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect dilakukan sebagai efek samping, bukan saat render.
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // Selama belum login (menunggu redirect), jangan tampilkan konten.
  if (!isLoggedIn) {
    return <p className="text-gray-500">Mengarahkan ke halaman login...</p>;
  }

  return <>{children}</>;
}
