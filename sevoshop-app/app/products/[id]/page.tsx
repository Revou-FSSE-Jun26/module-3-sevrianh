/* ============================================================
   app/products/[id]/page.tsx — Halaman detail satu produk
   Server Component yang fetch produk via params.id, dan
   menghasilkan judul halaman dinamis via generateMetadata.

   Detail menampilkan: nama, NAMA kategori (bukan id), harga,
   status stok, dan DESKRIPSI produk dari backend.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import { getProduct, getCategory } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

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

// Ambil nama kategori dari id. Gagal fetch tidak membuat halaman error:
// tampilkan fallback "#<id>" agar detail produk tetap tampil.
async function getCategoryName(categoryId: number): Promise<string> {
  try {
    const category = await getCategory(categoryId);
    return category.name;
  } catch {
    return `#${categoryId}`;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params; // ambil id dari URL (Req 11.2)
  const product = await getProduct(id); // fetch satu produk (termasuk description)
  const categoryName = await getCategoryName(product.categoryId); // id -> nama kategori

  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      {/* Tautan kembali ke daftar produk. */}
      <Link
        href="/products"
        className="self-start text-sm text-gengar-violet hover:underline"
      >
        &larr; Kembali ke daftar produk
      </Link>

      <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>

      {/* Nama kategori (bukan id). */}
      <p className="text-sm text-gray-500">
        Kategori:{" "}
        <span className="font-medium text-gray-700">{categoryName}</span>
      </p>

      <p className="text-xl font-bold text-gengar-violet">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      {inStock ? (
        <p className="text-green-600">Stok tersedia: {product.stock}</p>
      ) : (
        <p className="text-red-600">Stok habis</p>
      )}

      {/* Deskripsi produk dari backend. Tampilkan placeholder bila kosong. */}
      <section className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Deskripsi
        </h3>
        {product.description ? (
          <p className="whitespace-pre-line leading-relaxed text-gray-700">
            {product.description}
          </p>
        ) : (
          <p className="italic text-gray-400">
            Belum ada deskripsi untuk produk ini.
          </p>
        )}
      </section>

      {/* Aksi tambah ke keranjang (atau "Login to buy" bila belum login). */}
      <div className="mt-2 self-start">
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
