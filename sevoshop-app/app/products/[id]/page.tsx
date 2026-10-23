/* ============================================================
   app/products/[id]/page.tsx — Halaman detail satu produk
   Server Component yang fetch produk via params.id, dan
   menghasilkan judul halaman dinamis via generateMetadata.
   ============================================================ */

import type { Metadata } from "next";
import { getProduct } from "@/lib/api";

// Tipe props halaman dinamis: params berisi id dari URL.
// Di Next.js terbaru, params berupa Promise yang perlu di-await.
interface PageProps {
  params: Promise<{ id: string }>;
}

/* generateMetadata (Req 10.3, 10.4): menghasilkan <title> dinamis.
   Fetch produk lalu pakai nama produk nyata sebagai judul tab. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.name} — SevoShop`,
      description: `Detail produk ${product.name}.`,
    };
  } catch {
    // Fallback bila produk gagal diambil.
    return { title: "Produk — SevoShop" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params; // ambil id dari URL (Req 11.2)
  const product = await getProduct(id); // fetch satu produk

  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
      <p className="text-sm text-gray-500">Kategori #{product.categoryId}</p>
      <p className="text-xl font-bold text-gengar-violet">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      {inStock ? (
        <p className="text-green-600">Stok tersedia: {product.stock}</p>
      ) : (
        <p className="text-red-600">Stok habis</p>
      )}
    </article>
  );
}
