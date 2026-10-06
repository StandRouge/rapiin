# Rapiin: alat PDF di perangkatmu
React + Vite + Tailwind CSS v4 + lucide-react + pdf.js + pdf-lib. Semua proses di browser, tidak ada data dikirim.

    npm install
    npm run dev        # buka http://localhost:5173
    npm run build      # hasil statis di dist/ (bisa dibuka lewat server statis apa pun)

Struktur: src/components (UI), src/hooks (state konversi), src/lib (pdf.js, format, range).

## Deploy (Vercel / Netlify)
Pastikan `node_modules` dan `dist` TIDAK ikut di-commit (sudah ada di `.gitignore`).
Build command: `npm run build` · Output directory: `dist`
