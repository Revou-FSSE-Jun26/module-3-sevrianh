/* ============================================================
   Footer.tsx — Kaki halaman
   Server Component sederhana.
   ============================================================ */

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm sm:flex-row">
        <span>&copy; 2026 SevoShop — RevoShop Frontend (Checkpoint 2).</span>
        <a
          href="https://github.com/Revou-FSSE-Jun26/module-3-sevrianh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-gengar-indigo transition-colors hover:text-gengar-violet"
          aria-label="Lihat repository di GitHub (membuka tab baru)"
        >
          {/* Logo GitHub — ikon SVG inline (tanpa dependency tambahan). */}
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.28 5.7.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5Z"
            />
          </svg>
          GitHub
        </a>
      </div>
    </footer>
  );
}
