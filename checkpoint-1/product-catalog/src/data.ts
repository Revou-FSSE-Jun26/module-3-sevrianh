/* ============================================================
   data.ts — Data produk bertipe untuk Product Catalog
   Tugas 8.2: array of typed objects (Product[])
   ============================================================ */

import type { Product } from "./types";

/* ARRAY BERTIPE (Req 13): 'products' adalah Product[].
   Karena bertipe, TypeScript memastikan setiap objek punya SEMUA
   properti Product dengan tipe yang benar, dan 'status' hanya boleh
   salah satu nilai StockStatus. */
export const products: Product[] = [
  {
    id: 1,
    name: "Keyboard Mekanik",
    price: 450000,
    stock: 12,
    status: "in-stock",
    category: { id: 1, name: "Aksesoris" },
    tags: ["gaming", "rgb"],
  },
  {
    id: 2,
    name: "Mouse Wireless",
    price: 180000,
    stock: 3,
    status: "low-stock",
    category: { id: 1, name: "Aksesoris" },
    tags: ["ergonomis"],
  },
  {
    id: 3,
    name: "Monitor 24 inch",
    price: 1500000,
    stock: 0,
    status: "out-of-stock",
    category: { id: 2, name: "Display" },
    tags: ["ips", "75hz"],
  },
  {
    id: 4,
    name: "Headset Gaming",
    price: 320000,
    stock: 8,
    status: "in-stock",
    category: { id: 3, name: "Audio" },
    tags: ["surround", "mic"],
  },
  {
    id: 5,
    name: "Webcam HD",
    price: 275000,
    stock: 2,
    status: "low-stock",
    category: { id: 4, name: "Kamera" },
    tags: ["1080p"],
  },
  {
    id: 6,
    name: "SSD 1TB",
    price: 950000,
    stock: 15,
    status: "in-stock",
    category: { id: 5, name: "Storage" },
    tags: ["nvme", "cepat"],
  },
];
