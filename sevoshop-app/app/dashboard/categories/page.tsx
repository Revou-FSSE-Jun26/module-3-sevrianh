"use client";

/* ============================================================
   app/dashboard/categories/page.tsx — Manajemen kategori (admin)
   AdminRoute. Tabel kategori + create (modal) + edit (modal) +
   delete (konfirmasi inline). State lokal diperbarui immutable,
   mengikuti pola app/dashboard/page.tsx (manajemen produk).
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute";
import Modal from "@/components/Modal";
import CategoryFormFields from "@/components/CategoryFormFields";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryInput,
} from "@/lib/api";
import type { Category } from "@/lib/types";
import { notifySuccess, notifyError } from "@/lib/toast";

function CategoriesAdminContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Muat kategori saat mount.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  // CREATE: tambah ke state lokal (immutable) saat sukses.
  async function handleCreate(input: CategoryInput) {
    const created = await createCategory(input);
    setCategories((prev) => [created, ...prev]);
    setShowCreate(false);
    notifySuccess("Kategori dibuat.");
  }

  // UPDATE: perbarui item di state dengan .map().
  async function handleUpdate(input: CategoryInput) {
    if (!editing) return;
    const updated = await updateCategory(editing.id, input);
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditing(null);
    notifySuccess("Kategori diperbarui.");
  }

  // DELETE: hapus dari state dengan .filter().
  async function handleDelete(id: number) {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setConfirmId(null);
      notifySuccess("Kategori dihapus.");
    } catch (err) {
      // 400/409 bila kategori masih dipakai produk -> tampilkan pesan backend.
      notifyError(err instanceof Error ? err.message : "Gagal menghapus kategori.");
      setConfirmId(null);
    }
  }

  if (loading) return <p className="text-gray-500">Memuat kategori...</p>;

  return (
    <section className="flex flex-col gap-4">
      <Link href="/dashboard" className="self-start text-sm text-gengar-violet hover:underline">
        &larr; Kembali ke Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet"
        >
          + Kategori Baru
        </button>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-600">
            <th className="py-2">ID</th>
            <th className="py-2">Nama</th>
            <th className="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b border-gray-100">
              <td className="py-2">#{c.id}</td>
              <td className="py-2 capitalize">{c.name}</td>
              <td className="py-2">
                {confirmId === c.id ? (
                  <span className="flex items-center gap-2 text-sm">
                    Yakin?
                    <button onClick={() => handleDelete(c.id)} className="text-gengar-lightred hover:underline">Ya</button>
                    <button onClick={() => setConfirmId(null)} className="text-gray-500 hover:underline">Batal</button>
                  </span>
                ) : (
                  <span className="flex items-center gap-3 text-sm">
                    <button onClick={() => setEditing(c)} className="text-gengar-violet hover:underline">Edit</button>
                    <button onClick={() => setConfirmId(c.id)} className="text-gengar-lightred hover:underline">Hapus</button>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Create */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Kategori Baru">
        <CategoryFormFields submitLabel="Buat" onSubmit={handleCreate} />
      </Modal>

      {/* Modal Edit (pre-populated) */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Edit Kategori">
        {editing && (
          <CategoryFormFields
            submitLabel="Simpan"
            initial={{ category_name: editing.name }}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
    </section>
  );
}

export default function CategoriesAdminPage() {
  return (
    <AdminRoute>
      <CategoriesAdminContent />
    </AdminRoute>
  );
}
