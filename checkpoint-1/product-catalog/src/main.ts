import "./style.css";

/* Uji sederhana bahwa Tailwind CSS bekerja.
   Semua tampilan diatur lewat utility class Tailwind (bukan CSS kustom).
   Katalog produk yang sesungguhnya dibangun pada Tugas 8-10. */
const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
      <h1 class="text-2xl font-bold text-indigo-700 mb-2">RevoShop Product Catalog</h1>
      <p class="text-slate-600">Tailwind CSS siap digunakan. Katalog akan dibangun di langkah berikutnya.</p>
    </div>
  </main>
`;
