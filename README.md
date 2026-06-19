# Portfolio & CMS Website - Nuralim

Platform Portfolio Profesional dan Sistem Manajemen Konten (CMS) terpadu untuk Nuralim. Dibangun dengan Next.js 15, dilengkapi fitur pembuatan dokumen otomatis (Quotation/Invoice PDF), manajemen proyek, dan pengiriman email langsung dari sistem.

## 🎯 Fitur Utama

- ✨ **Premium UI**: Desain modern dengan animasi halus menggunakan Framer Motion
- 🔒 **Secure CMS**: Dashboard admin terotentikasi berlapis JWT dan Rate Limiting
- 📄 **PDF Engine**: Fitur generate dokumen (Invoice/Quotation) on-the-fly via Puppeteer
- 📧 **Integrated Email**: Pengiriman dokumen dan penawaran langsung ke klien via Nodemailer & SMTP
- 💾 **Database-Driven**: Manajemen proyek, profil, dan data master via PostgreSQL & Prisma ORM
- 🛡️ **Enterprise Security**: Dilindungi CSP Headers, perlindungan file sensitif, DNS Prefetch Control, dan Anti-Timing Attacks
- 🚀 **Docker Ready**: Tersedia arsitektur containerized untuk *deployment* VPS yang mulus

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (via PgBouncer) + Prisma ORM
- **Authentication**: JWT Cookies
- **Document Engine**: Puppeteer
- **Mailing**: Nodemailer
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Deployment**: Docker & Docker Compose

## 🚀 Deployment (Docker VPS)

Aplikasi ini telah dirancang menggunakan **Next.js Standalone Mode** dengan Dockerfile berlapis-lapis (multi-stage) untuk menghasilkan ukuran *image* yang ringan dan efisien.

### 1. Persiapan Server
Pastikan VPS Anda (Ubuntu/Debian) sudah memiliki *network* `postgres-network` dan telah menginstal Docker.

### 2. Konfigurasi Environment
Siapkan file `.env` di VPS Anda. Pastikan untuk mengisi:
- `DATABASE_URL` (Wajib menggunakan `&pgbouncer=true` di ujung URL)
- `DIRECT_URL` (Port asli 5432 untuk kebutuhan migrasi)
- Kredensial CMS, SMTP, dan kunci rahasia lainnya.

### 3. Build & Run
Jalankan perintah ini di dalam *root directory* proyek di VPS:

```bash
# Menjalankan kontainer di background
docker compose up -d --build
```
Aplikasi akan secara otomatis terhubung ke *database* dan berjalan di port `3000`.

### 4. Database Migration
Untuk sinkronisasi skema *database* pertama kali di VPS, masuk ke dalam kontainer dan jalankan perintah migrasi Prisma:

```bash
docker compose exec web npx prisma migrate deploy
```

## 📝 Manajemen Konten (CMS)

Aplikasi ini sudah dinamis. Anda tidak perlu lagi mengedit *source code* secara manual untuk mengubah isi portofolio.
Akses CMS melalui browser:
**`http://domain-anda/cms/dashboard`**

Di Dashboard Anda bisa:
- Menambahkan, mengedit, dan menghapus proyek portofolio.
- Membuat form Quotation (Penawaran Harga) dan Invoice secara dinamis.
- Mengirim dokumen PDF langsung ke kotak masuk email klien.

## 🔧 Pengembangan Lokal (Development)

Jika Anda ingin mengembangkan aplikasi ini lebih lanjut di komputer lokal:

```bash
# 1. Install dependencies
npm install

# 2. Sinkronisasi skema database
npx prisma db push

# 3. Jalankan server development
npm run dev
```

## 🤝 Hubungi Kami

- **Email**: halo@nuralim.dev
- **Phone / WhatsApp**: +62 811 144 1696

---
© 2026 Nuralim. Built securely with Next.js, Prisma, & Docker.
