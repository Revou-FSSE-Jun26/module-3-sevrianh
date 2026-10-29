"use client";

/* ============================================================
   RegisterForm.tsx — Form registrasi (Checkpoint 3, Tugas 4)
   Controlled form + validasi 4 aturan. Pada 201 dari POST /users,
   simpan sesi ke AuthContext (localStorage) dan redirect ke /.
   ============================================================ */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RegisterFormData } from "@/lib/types";
import { registerUser, loginUser } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { notifySuccess, notifyError } from "@/lib/toast";

// Pesan error per field (opsional).
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Validasi 4 aturan (Req 1.3).
function validate(data: RegisterFormData): FormErrors {
  const errors: FormErrors = {};
  if (data.username.trim() === "") {
    errors.username = "Username wajib diisi.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (data.password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  }
  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Konfirmasi password tidak cocok.";
  }
  return errors;
}

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // POST /users; backend mengembalikan user baru TANPA token (Req 1.4).
      await registerUser(form);
      // Registrasi tidak mengembalikan JWT, jadi langsung login untuk
      // memperoleh token asli + profil lengkap, lalu simpan sesi (Req 2.7).
      const { user, token } = await loginUser({
        email: form.email,
        password: form.password,
      });
      login(user, token); // simpan sesi + token ke AuthContext + localStorage
      notifySuccess("Registrasi berhasil!");
      router.push("/");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  // Helper kecil untuk merender satu field.
  const field = (
    name: keyof RegisterFormData,
    label: string,
    type = "text"
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
      />
      {errors[name] && <p className="text-sm text-gengar-lightred">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-gengar-indigo">Daftar Akun</h1>
      {field("username", "Username")}
      {field("email", "Email", "email")}
      {field("password", "Password", "password")}
      {field("confirmPassword", "Konfirmasi Password", "password")}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet disabled:opacity-60"
      >
        {submitting ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}
