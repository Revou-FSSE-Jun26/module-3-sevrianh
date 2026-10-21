"use client";

/* ============================================================
   PublicOnlyRoute.tsx — Halaman untuk pengguna BELUM login
   Bila sudah login, arahkan ke / (Req 4.4). Dipakai untuk
   /login dan /register agar pengguna yang sudah masuk tidak
   membukanya lagi.
   ============================================================ */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  // Bila sudah login (menunggu redirect), jangan tampilkan form publik.
  if (isLoggedIn) {
    return <p className="text-gray-500">Mengarahkan...</p>;
  }

  return <>{children}</>;
}
