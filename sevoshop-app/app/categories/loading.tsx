/* app/categories/loading.tsx — Skeleton saat memuat kategori (Req 12.3, 12.4) */
export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
        />
      ))}
    </div>
  );
}
