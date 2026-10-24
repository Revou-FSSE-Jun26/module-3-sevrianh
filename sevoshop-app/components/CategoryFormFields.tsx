"use client";

/* ============================================================
   CategoryFormFields.tsx — Form field kategori (create & edit)
   Satu field name (controlled). Validasi name tidak kosong.
   ============================================================ */

import { useState } from "react";
import type { CategoryInput } from "@/lib/api";

interface CategoryFormFieldsProps {
  initial?: Partial<CategoryInput>;
  submitLabel: string;
  onSubmit: (input: CategoryInput) => Promise<void>;
}

export default function CategoryFormFields({
  initial,
  submitLabel,
  onSubmit,
}: CategoryFormFieldsProps) {
  const [name, setName] = useState(initial?.category_name ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim() === "") return setError("Nama kategori wajib diisi.");

    setSubmitting(true);
    try {
      await onSubmit({ category_name: name.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operasi gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-sm text-gengar-lightred">{error}</p>}
      <label className="flex flex-col gap-1 text-sm">
        Nama Kategori
        <input
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet disabled:opacity-60"
      >
        {submitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
