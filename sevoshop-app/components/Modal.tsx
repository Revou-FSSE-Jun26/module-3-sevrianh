"use client";

/* ============================================================
   Modal.tsx — Dialog sederhana reusable
   Dipakai untuk form create/edit di dashboard.
   ============================================================ */

import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      {/* Hentikan propagasi agar klik di dalam kotak tidak menutup modal. */}
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gengar-indigo">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
