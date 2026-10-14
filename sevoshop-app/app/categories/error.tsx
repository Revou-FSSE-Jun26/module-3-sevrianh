"use client";

/* app/categories/error.tsx — UI error untuk route /categories (Req 12.2, 12.4) */

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-lg font-semibold text-red-700">Gagal memuat kategori</h2>
      <p className="mt-1 text-sm text-red-600">
        {error.message || "Terjadi kesalahan saat mengambil data."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
      >
        Coba Lagi
      </button>
    </div>
  );
}
