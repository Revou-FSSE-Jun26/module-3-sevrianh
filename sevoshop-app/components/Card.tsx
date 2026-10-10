/* ============================================================
   Card.tsx — Komponen pembungkus (wrapper) yang reusable
   Menerima children dan membungkusnya dengan gaya kartu konsisten.
   ============================================================ */

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;        // isi kartu (apa pun yang ditaruh di dalamnya)
  className?: string;         // kelas tambahan opsional
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
