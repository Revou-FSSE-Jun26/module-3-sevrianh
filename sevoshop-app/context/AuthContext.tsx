"use client";

/* ============================================================
   context/AuthContext.tsx — State autentikasi global
   Menyimpan sesi pengguna, memulihkannya dari localStorage saat
   aplikasi dimuat, dan menyediakan login/logout.

   PENTING: pemulihan sesi dari localStorage terjadi di useEffect
   (setelah mount). Selama proses itu belum selesai, kita BELUM tahu
   apakah pengguna login. Flag `isLoading` menandai masa "belum tahu"
   agar guard (ProtectedRoute/AdminRoute/PublicOnlyRoute) tidak salah
   me-redirect sebelum sesi sempat dipulihkan.

   Selain user, context juga menyimpan JWT token dari backend. Token
   dipersist terpisah di localStorage agar bertahan setelah refresh dan
   bisa dilampirkan sebagai `Authorization: Bearer <token>` pada request
   terproteksi (dipakai oleh lib/api.ts). Sumber kebenaran otorisasi
   tetap di backend.
   ============================================================ */

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@/lib/types";

// Kunci penyimpanan di localStorage.
const STORAGE_KEY = "sevoshop_user";
// Kunci terpisah untuk JWT token.
const TOKEN_KEY = "sevoshop_token";

// Bentuk nilai yang disediakan context.
interface AuthContextValue {
  currentUser: User | null;
  token: string | null; // JWT token dari backend (untuk Authorization header)
  isLoggedIn: boolean;
  isLoading: boolean; // true sampai sesi selesai dipulihkan dari localStorage
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Context dibuat dengan nilai awal undefined; diisi oleh Provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Mulai dalam keadaan "memuat" sampai useEffect pemulihan selesai.
  const [isLoading, setIsLoading] = useState(true);

  // Pulihkan sesi (user + token) dari localStorage saat komponen pertama mount (Req 2.3).
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored) as User);
        // Pulihkan token hanya bila user berhasil dipulihkan.
        if (storedToken) {
          setToken(storedToken);
        }
      } catch {
        // data rusak -> bersihkan keduanya (user & token)
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    // Pemulihan selesai: guard sekarang boleh mengambil keputusan.
    setIsLoading(false);
  }, []);

  // Simpan user DAN token ke state DAN localStorage agar bertahan setelah refresh.
  function login(user: User, token: string) {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Hapus sesi: bersihkan user & token dari state dan localStorage.
  function logout() {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  const value: AuthContextValue = {
    currentUser,
    token,
    isLoggedIn: currentUser !== null,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* Hook internal untuk membaca context dengan guard.
   Diekspos juga lewat hooks/useAuth.ts untuk kemudahan impor. */
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return ctx;
}
