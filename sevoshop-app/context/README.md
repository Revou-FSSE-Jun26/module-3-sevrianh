# context/

Folder untuk React Context Provider (dipakai di Checkpoint 3).

Rencana isi:
- `AuthContext.tsx` — menyimpan `currentUser`, `isLoggedIn`, `login()`, `logout()`;
  memulihkan sesi dari `localStorage` saat mount.
- `CartContext.tsx` — menyimpan item keranjang, persist ke `localStorage`,
  menyediakan `addToCart`, `removeFromCart`, `clearCart`.

Keduanya akan dibungkus di `app/layout.tsx` (`<AuthProvider>`, `<CartProvider>`).
Tipe `User`, `CartItem`, dll. akan ditambahkan ke `lib/types.ts` agar terpusat.
