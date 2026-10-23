"use client";

/* ============================================================
   LoginForm.tsx — Form login (Checkpoint 3, Tugas 5)
   Controlled form -> POST /auth/login. Pada sukses, simpan sesi
   dan redirect per role (admin -> /dashboard, selain itu -> /).
   Pada gagal, tampilkan error form-level.
   ============================================================ */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { notifySuccess, notifyError } from "@/lib/toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      // POST /auth/login (Req 3.2). Backend mengembalikan data user.
      const result = await loginUser({ email, password });

      // Tangani kemungkinan respons dibungkus { user } atau user langsung.
      const user = ((result as unknown as { user?: User }).user ?? result) as User;

      login(user); // simpan sesi (Req 3.3)
      notifySuccess("Login berhasil!");

      // Redirect per role.
      router.push(user.role === "admin" ? "/dashboard" : "/");
    } catch {
      // Error form-level (Req 3.4).
      setFormError("Invalid email or password");
      notifyError("Login gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-gengar-indigo">Masuk</h1>

      {/* Error form-level */}
      {formError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-gengar-lightred">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet disabled:opacity-60"
      >
        {submitting ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
