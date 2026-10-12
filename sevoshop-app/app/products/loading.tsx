/* ============================================================
   app/products/loading.tsx — Skeleton UI saat halaman memuat
   Next.js menampilkan ini otomatis selama Server Component
   masih memuat (Req 12.3).
   ============================================================ */

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Enam kartu placeholder berdenyut (animate-pulse). */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
        />
      ))}
    </div>
  );
}
