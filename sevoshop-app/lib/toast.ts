/* ============================================================
   lib/toast.ts — Helper notifikasi (react-hot-toast)
   Dipakai di handler POST/PUT/DELETE dan operasi cart untuk
   memberi umpan balik sukses/gagal yang konsisten.
   ============================================================ */

import toast from "react-hot-toast";

// Notifikasi sukses (operasi 2xx).
export function notifySuccess(message: string): void {
  toast.success(message);
}

// Notifikasi gagal (operasi 4xx/5xx atau error lain).
export function notifyError(message: string): void {
  toast.error(message);
}
