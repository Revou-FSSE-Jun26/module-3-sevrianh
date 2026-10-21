"use client";

/* ============================================================
   context/AuthContext.tsx — State autentikasi global
   Menyimpan sesi pengguna, memulihkannya dari localStorage saat
   aplikasi dimuat, dan menyediakan login/logout.
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
  login: (user: User) => void;
  logout: () => void;
}

// Context dibuat dengan nilai awal undefined; diisi oleh Provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
