"use client";

/* ============================================================
   app/products/error.tsx — UI error untuk route /products
   Menangkap error yang dilempar saat fetch (lapisan error kedua,
   Req 12.2). WAJIB Client Component (butuh interaktivitas reset).
   ============================================================ */

interface ErrorProps {
  error: Error;          // error yang ditangkap
  reset: () => void;     // fungsi untuk mencoba render ulang
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-lg font-semibold text-red-700">
        Gagal memuat produk
      </h2>
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
