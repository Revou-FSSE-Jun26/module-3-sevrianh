"use client";

/* ============================================================
   app/dashboard/page.tsx — Manajemen produk (admin, Tugas 10)
   AdminRoute. Tabel produk + create (modal) + edit (modal) +
   delete (konfirmasi inline). State lokal diperbarui immutable.
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute";
import Modal from "@/components/Modal";
import ProductFormFields from "@/components/ProductFormFields";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/lib/api";
import type { Product } from "@/lib/types";
import { notifySuccess, notifyError } from "@/lib/toast";

function DashboardContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Muat produk saat mount.
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // CREATE: tambah ke state lokal (immutable) saat sukses.
  async function handleCreate(input: ProductInput) {
    const created = await createProduct(input);
    setProducts((prev) => [created, ...prev]);
    setShowCreate(false);
    notifySuccess("Produk dibuat.");
  }

  // UPDATE: perbarui item di state dengan .map() (Req 9.3).
  async function handleUpdate(input: ProductInput) {
    if (!editing) return;
    const updated = await updateProduct(editing.id, input);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
    notifySuccess("Produk diperbarui.");
  }

  // DELETE: hapus dari state dengan .filter() (Req 9.4).
  async function handleDelete(id: number) {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
      notifySuccess("Produk dihapus.");
    } catch (err) {
      // 400 bila produk punya order aktif -> tampilkan pesan backend.
      notifyError(err instanceof Error ? err.message : "Gagal menghapus produk.");
      setConfirmId(null);
    }
  }

  if (loading) return <p className="text-gray-500">Memuat produk...</p>;

  return (
    <section className="flex flex-col gap-4">
      {/* Navigasi manajemen admin: tombol menuju route terpisah
          untuk kelola Kategori dan Pesanan. */}
      <nav aria-label="Navigasi manajemen admin" className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/categories"
          className="rounded-md border border-gengar-indigo px-4 py-2 font-medium text-gengar-indigo transition-colors hover:bg-gengar-indigo hover:text-white"
        >
          Kelola Kategori
        </Link>
        <Link
          href="/dashboard/orders"
          className="rounded-md border border-gengar-indigo px-4 py-2 font-medium text-gengar-indigo transition-colors hover:bg-gengar-indigo hover:text-white"
        >
          Kelola Pesanan
        </Link>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet"
        >
          + Produk Baru
        </button>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-600">
            <th className="py-2">Nama</th>
            <th className="py-2">Harga</th>
            <th className="py-2">Stok</th>
            <th className="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100">
              <td className="py-2">{p.name}</td>
              <td className="py-2">Rp {p.price.toLocaleString("id-ID")}</td>
              <td className="py-2">{p.stock}</td>
              <td className="py-2">
                {confirmId === p.id ? (
                  // Konfirmasi inline sebelum hapus (Req 9.4).
                  <span className="flex items-center gap-2 text-sm">
                    Yakin?
                    <button onClick={() => handleDelete(p.id)} className="text-gengar-lightred hover:underline">Ya</button>
                    <button onClick={() => setConfirmId(null)} className="text-gray-500 hover:underline">Batal</button>
                  </span>
                ) : (
                  <span className="flex items-center gap-3 text-sm">
                    <button onClick={() => setEditing(p)} className="text-gengar-violet hover:underline">Edit</button>
                    <button onClick={() => setConfirmId(p.id)} className="text-gengar-lightred hover:underline">Hapus</button>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Create */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Produk Baru">
        <ProductFormFields submitLabel="Buat" onSubmit={handleCreate} />
      </Modal>

      {/* Modal Edit (pre-populated) */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Edit Produk">
        {editing && (
          <ProductFormFields
            submitLabel="Simpan"
            initial={{
              product_name: editing.name,
              price: editing.price,
              stock: editing.stock,
              category_id: editing.categoryId,
            }}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <AdminRoute>
      <DashboardContent />
    </AdminRoute>
  );
}
