"use client";

/* ============================================================
   AuthNav.tsx — Bagian header yang bergantung status login
   Menampilkan username + Logout bila login (Req 2.5), atau
   tautan Register/Login bila belum.
   ============================================================ */

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AuthNav() {
  const { currentUser, isLoggedIn, logout } = useAuth();

  if (isLoggedIn && currentUser) {
    // Tautan Dashboard hanya untuk admin (Req 2.10, 2.11). Pengguna non-admin
    // dan yang belum login tidak melihatnya. Sumber kebenaran tetap backend:
    // bila klien dirusak, endpoint terproteksi tetap menolak 401/403.
    const isAdmin = currentUser.role === "admin";

    return (
      <div className="flex items-center gap-3 text-sm">
        {isAdmin && (
          <Link href="/dashboard" className="hover:text-gengar-palered">
            Dashboard
          </Link>
        )}
        <span className="font-medium">Halo, {currentUser.username}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded bg-white/20 px-3 py-1 hover:bg-white/30"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link href="/login" className="hover:text-gengar-palered">Login</Link>
      <Link
        href="/register"
        className="rounded bg-white/20 px-3 py-1 hover:bg-white/30"
      >
        Register
      </Link>
    </div>
  );
}
