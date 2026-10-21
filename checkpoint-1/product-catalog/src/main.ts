import "./style.css";
import { products } from "./data";
import { renderProductList } from "./render";
import type { Product } from "./types";

/* ============================================================
   main.ts — Entry point katalog produk interaktif
   Tugas 10: live search (10.1) + toggle urutan harga (10.2)
   ============================================================ */

const app = document.querySelector<HTMLDivElement>("#app")!;

// Kerangka UI: input pencarian, tombol urutan, dan container daftar.
app.innerHTML = `
  <main class="mx-auto max-w-5xl p-6">
    <h1 class="mb-4 text-2xl font-bold text-gengar-indigo">SevoShop — Katalog Produk</h1>
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        id="search"
        type="search"
        placeholder="Cari produk..."
        class="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gengar-violet"
      />
      <button
        id="sort"
        type="button"
        class="rounded-md bg-gengar-indigo px-4 py-2 font-medium text-white hover:bg-gengar-violet"
      >
        Urutkan Harga: Terendah
      </button>
    </div>
    <div id="list"></div>
  </main>
`;

// Referensi elemen.
const searchInput = document.getElementById("search") as HTMLInputElement;
const sortBtn = document.getElementById("sort") as HTMLButtonElement;
const listEl = document.getElementById("list") as HTMLDivElement;

// STATE aplikasi.
let query = "";
let sortAsc = true; // true = harga terendah->tertinggi

// Terapkan filter + urutan ke data, lalu render.
function update(): void {
  // Live search: filter case-insensitive berdasarkan nama (Req 17.2).
  const q = query.trim().toLowerCase();
  let result: Product[] = q
    ? products.filter((p) => p.name.toLowerCase().includes(q))
    : [...products];

  // Urutkan berdasarkan harga sesuai arah (Req 17.3). Pakai salinan agar immutable.
  result = [...result].sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));

  listEl.innerHTML = renderProductList(result);
}

// Event: ketik pada input -> perbarui query -> re-render.
searchInput.addEventListener("input", (e) => {
  query = (e.target as HTMLInputElement).value;
  update();
});

// Event: klik tombol -> toggle arah urutan -> perbarui label -> re-render.
sortBtn.addEventListener("click", () => {
  sortAsc = !sortAsc;
  sortBtn.textContent = sortAsc ? "Urutkan Harga: Terendah" : "Urutkan Harga: Tertinggi";
  update();
});

// Render awal.
update();
