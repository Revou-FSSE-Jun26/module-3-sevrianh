"use client";

/* ============================================================
   ProductFormFields.tsx — Form field produk (create & edit)
   Controlled inputs untuk nama, harga, stok, category_id.
   Memanggil onSubmit dengan ProductInput saat valid.
   ============================================================ */

import { useState } from "react";
import type { ProductInput } from "@/lib/api";
import { notifyError } from "@/lib/toast";

interface ProductFormFieldsProps {
  initial?: Partial<ProductInput>;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<void>;
}

export default function ProductFormFields({
  initial,
  submitLabel,
  onSubmit,
}: ProductFormFieldsProps) {
  const [name, setName] = useState(initial?.product_name ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? ""));
  const [categoryId, setCategoryId] = useState(String(initial?.category_id ?? "1"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validasi ringkas.
    if (name.trim() === "") return setError("Nama produk wajib diisi.");
    if (Number(price) <= 0) return setError("Harga harus lebih dari 0.");
    if (Number(stock) < 0) return setError("Stok tidak boleh negatif.");

    setSubmitting(true);
    try {
      await onSubmit({
        product_name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId),
      });
    } catch (err) {
      // Error form-level dari backend (mis. 400 { error }) + toast (Req 12.3).
      const msg = err instanceof Error ? err.message : "Operasi gagal.";
      setError(msg);
      notifyError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-sm text-gengar-lightred">{error}</p>}
      <label className="flex flex-col gap-1 text-sm">
        Nama
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Harga
        <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Stok
        <input className={inputClass} value={stock} onChange={(e) => setStock(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category ID
        <input className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
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
