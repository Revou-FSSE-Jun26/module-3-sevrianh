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
   ============================================================ */

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@/lib/types";

// Kunci penyimpanan di localStorage.
const STORAGE_KEY = "sevoshop_user";

// Bentuk nilai yang disediakan context.
interface AuthContextValue {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean; // true sampai sesi selesai dipulihkan dari localStorage
  login: (user: User) => void;
  logout: () => void;
}

// Context dibuat dengan nilai awal undefined; diisi oleh Provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Mulai dalam keadaan "memuat" sampai useEffect pemulihan selesai.
  const [isLoading, setIsLoading] = useState(true);

  // Pulihkan sesi dari localStorage saat komponen pertama mount (Req 2.3).
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem(STORAGE_KEY); // data rusak -> bersihkan
      }
    }
    // Pemulihan selesai: guard sekarang boleh mengambil keputusan.
    setIsLoading(false);
  }, []);

  // Simpan user ke state DAN localStorage agar bertahan setelah refresh.
  function login(user: User) {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  // Hapus sesi.
  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value: AuthContextValue = {
    currentUser,
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
