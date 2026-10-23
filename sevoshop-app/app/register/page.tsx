"use client";

/* app/register/page.tsx — Halaman registrasi (Req 1.1)
   Dibungkus PublicOnlyRoute: pengguna yang sudah login diarahkan ke / */

import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <PublicOnlyRoute>
      <RegisterForm />
    </PublicOnlyRoute>
  );
}
