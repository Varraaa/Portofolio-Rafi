# Portofolio — M Rafi Hibatulloh (HTML + CSS + JS Native)

Versi ini **tanpa Laravel, tanpa Tailwind, tanpa Node/npm, tanpa build tool apapun**.
Murni HTML, CSS biasa, dan JavaScript vanilla. Tinggal dobel klik file HTML-nya
di komputer kamu, langsung terbuka di browser. Selesai.

## Struktur folder

```
portfolio-static/
├── index.html          ← halaman Home
├── about.html           ← halaman About
├── projects.html        ← halaman Projects
├── contact.html         ← halaman Contact
├── css/
│   └── style.css        ← semua styling ada di sini
├── js/
│   └── script.js        ← toggle menu mobile + efek ketik hero
└── assets/
    ├── image/            ← taruh foto profil kamu di sini
    └── project/          ← taruh screenshot project kamu di sini
```

## Cara menjalankan

**Cara paling gampang:** klik dua kali file `index.html`, otomatis kebuka di browser
(Chrome/Edge/Firefox). Nggak perlu `npm install`, nggak perlu server, nggak perlu
`php artisan serve`.

**Kalau mau lebih rapi (opsional):** kalau kamu pakai VS Code, install extension
**"Live Server"**, klik kanan `index.html` → **Open with Live Server**. Ini bikin
halaman auto-refresh tiap kali kamu save perubahan.

## Menambahkan foto & screenshot

1. Simpan foto profil kamu di `assets/image/`, lalu buka `about.html`, cari baris:
   ```html
   <img src="assets/image/jas.jpeg" alt="Foto M Rafi Hibatulloh">
   ```
   Ganti `jas.jpeg` sesuai nama file foto kamu.

2. Simpan screenshot tiap project di `assets/project/`, lalu di `index.html` dan
   `projects.html`, cari bagian `<img src="assets/project/...">` dan sesuaikan nama
   filenya. Kalau file belum ada / nama salah, otomatis muncul teks placeholder
   abu-abu yang kasih tau lokasi file yang harus diisi.

## Bagian yang perlu kamu sesuaikan

| Apa | Ada di file |
|---|---|
| Link live demo tiap project | `index.html`, `projects.html` (atribut `href` di tombol "Kunjungi Web") |
| Link GitHub / Instagram / WhatsApp | Semua file, bagian footer & (di `contact.html`) bagian Media Sosial |
| Foto profil | `about.html` |
| Screenshot project | `index.html`, `projects.html` |

## Kenapa nggak ada Tailwind lagi?

Semua utility class Tailwind (`bg-paper`, `text-ink`, `md:grid-cols-3`, dll) sudah
diterjemahkan jadi CSS biasa di `css/style.css` dengan nama class yang lebih
sederhana (`.card`, `.btn-primary`, `.section-heading`, dll), jadi nggak perlu
Tailwind, PostCSS, atau Vite lagi. Semua warna & font tetap sama seperti versi
sebelumnya (tema terminal/code editor: navy gelap + teal + amber, font Space
Grotesk + Inter + JetBrains Mono).

## Deploy ke internet (gratis)

Karena ini murni file statis, kamu bisa upload folder ini ke:
- **Netlify** (drag & drop foldernya di https://app.netlify.com/drop)
- **Vercel** (https://vercel.com — import folder atau GitHub repo)
- **GitHub Pages** (push ke repo GitHub, aktifkan Pages di Settings)

Nggak perlu setting server, database, atau apapun — tinggal upload, langsung online.

---

Selamat menikmati portofolio yang sudah ringan dan simpel ya, Rafi! 🚀
