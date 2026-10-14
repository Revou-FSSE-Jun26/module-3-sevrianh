/* app/orders/loading.tsx — Skeleton saat memuat pesanan (Req 12.3, 12.4) */
export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded border border-gray-200 bg-gray-100"
        />
      ))}
    </div>
  );
}
