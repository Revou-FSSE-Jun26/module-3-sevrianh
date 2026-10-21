/* ============================================================
   hooks/useAuth.ts — Akses cepat ke AuthContext
   Pemakaian: const { currentUser, isLoggedIn, login, logout } = useAuth();
   ============================================================ */

import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  return useAuthContext();
}
