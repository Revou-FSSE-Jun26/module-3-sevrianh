# hooks/

Folder untuk custom React hooks (dipakai di Checkpoint 3).

Rencana isi:
- `useAuth.ts` — akses cepat ke `AuthContext` (mis. `const { currentUser } = useAuth()`).
- `useCart.ts` — akses cepat ke `CartContext`.
- `useLocalStorage.ts` — hook generik untuk sinkronisasi state dengan `localStorage`.

Custom hook memisahkan logika yang dapat dipakai ulang dari komponen UI.
