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
    return (
      <div className="flex items-center gap-3 text-sm">
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
