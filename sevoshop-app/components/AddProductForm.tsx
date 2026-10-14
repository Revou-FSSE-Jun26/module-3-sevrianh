"use client";

/* ============================================================
   AddProductForm.tsx — Form tambah produk (controlled form)
   Client Component: input terikat state, validasi via validate(),
   dan penambahan produk memakai pola spread immutable.
   ============================================================ */

import { useState } from "react";
import type { Product } from "@/lib/types";

/* Bentuk data form (semua string karena berasal dari <input>). */
interface FormState {
  name: string;
  price: string;
  stock: string;
}

/* Bentuk pesan error: tiap field boleh punya pesan (opsional). */
interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
}

/* Fungsi validate (Req 5.2): memeriksa data form, mengembalikan
   objek berisi pesan error untuk field yang tidak valid. */
function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};

  if (data.name.trim() === "") {
    errors.name = "Nama produk wajib diisi.";
  }

  const priceNum = Number(data.price);
  if (data.price.trim() === "" || Number.isNaN(priceNum) || priceNum <= 0) {
    errors.price = "Harga harus berupa angka lebih dari 0.";
  }

  const stockNum = Number(data.stock);
  if (data.stock.trim() === "" || Number.isNaN(stockNum) || stockNum < 0) {
    errors.stock = "Stok harus berupa angka 0 atau lebih.";
  }

  return errors;
}


interface AddProductFormProps {
  // Dipanggil saat produk valid ditambahkan (induk mengelola daftar).
  onAdd: (product: Product) => void;
}

export default function AddProductForm({ onAdd }: AddProductFormProps) {
  // State untuk nilai form (controlled inputs) dan error.
  const [form, setForm] = useState<FormState>({ name: "", price: "", stock: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  // Handler generic untuk tiap input: perbarui field sesuai 'name'.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); // update immutable
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validasi dulu.
    const found = validate(form);
    setErrors(found);

    // Jika ada error, hentikan.
    if (Object.keys(found).length > 0) return;

    // Buat produk baru dari data form.
    const newProduct: Product = {
      id: Date.now(), // id sementara (unik berdasarkan waktu)
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: { id: 0, name: "Tanpa kategori" },
    };

    // Serahkan ke induk (induk yang menambah ke daftar secara immutable).
    onAdd(newProduct);

    // Reset form.
    setForm({ name: "", price: "", stock: "" });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold text-gengar-indigo">Tambah Produk</h3>

      {/* Field: Nama */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">Nama</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
        />
        {errors.name && <p className="text-sm text-gengar-lightred">{errors.name}</p>}
      </div>

      {/* Field: Harga */}
      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-medium">Harga</label>
        <input
          id="price"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
        />
        {errors.price && <p className="text-sm text-gengar-lightred">{errors.price}</p>}
      </div>

      {/* Field: Stok */}
      <div className="flex flex-col gap-1">
        <label htmlFor="stock" className="text-sm font-medium">Stok</label>
        <input
          id="stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
        />
        {errors.stock && <p className="text-sm text-gengar-lightred">{errors.stock}</p>}
      </div>

      <button type="submit" className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet">
        Tambah
      </button>
    </form>
  );
}
