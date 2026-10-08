import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Konfigurasi Vite: mendaftarkan plugin resmi Tailwind CSS.
// Plugin ini yang memproses utility class Tailwind saat dev & build.
export default defineConfig({
  plugins: [tailwindcss()],
});
