"use client";

/* app/login/page.tsx — Halaman login (Req 3.1)
   Dibungkus PublicOnlyRoute: pengguna yang sudah login diarahkan ke / */

import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginForm />
    </PublicOnlyRoute>
  );
}
