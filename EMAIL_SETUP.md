# Email Setup Guide

## Option 1: Web3Forms (Recommended - Free & Easy)

Web3Forms adalah layanan gratis untuk mengirim email dari form contact.

### Setup Steps:

1. **Daftar di Web3Forms**
   - Buka https://web3forms.com
   - Klik "Get Started" atau "Create Access Key"
   - Masukkan email Anda (nuralim.mail@gmail.com)
   - Verifikasi email Anda

2. **Dapatkan Access Key**
   - Setelah verifikasi, Anda akan mendapat Access Key
   - Copy Access Key tersebut

3. **Konfigurasi di Project**
   - Copy file `.env.example` menjadi `.env.local`
   ```bash
   copy .env.example .env.local
   ```
   - Buka `.env.local` dan isi dengan Access Key Anda:
   ```
   WEB3FORMS_ACCESS_KEY=your_actual_access_key_here
   ```

4. **Deploy ke Vercel**
   - Buka Vercel Dashboard: https://vercel.com/dashboard
   - Pilih project "portofolio-website"
   - Masuk ke Settings → Environment Variables
   - Tambahkan variable baru:
     - Name: `WEB3FORMS_ACCESS_KEY`
     - Value: (paste access key Anda)
     - Environment: Production, Preview, Development
   - Klik "Save"
   - Redeploy project Anda

### Features:
- ✅ Gratis untuk 250 submissions/bulan
- ✅ No server configuration needed
- ✅ Email notifications langsung ke inbox Anda
- ✅ Anti-spam protection
- ✅ File attachment support (optional)

---

## Option 2: Resend (Professional)

Untuk production-grade email dengan branding lebih baik.

### Setup Steps:

1. **Install Resend**
   ```bash
   npm install resend
   ```

2. **Daftar di Resend**
   - Buka https://resend.com
   - Sign up dengan GitHub atau email
   - Verifikasi domain Anda (optional, untuk custom sender)

3. **Dapatkan API Key**
   - Dashboard → API Keys → Create API Key
   - Copy API key

4. **Update API Route**
   - Edit file `src/app/api/send-email/route.ts`
   - Uncomment kode Resend, comment kode Web3Forms

5. **Environment Variables**
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```

---

## Testing Locally

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka http://localhost:3000/#contact

3. Isi form dan klik "Kirim Pesan"

4. Check email Anda (nuralim.mail@gmail.com)

---

## Troubleshooting

### Email tidak terkirim?
1. Check console browser untuk error messages
2. Pastikan `.env.local` sudah benar
3. Restart development server setelah menambah env variables
4. Check email spam/junk folder

### Fallback Mode
Jika API gagal, sistem akan otomatis membuka mailto link sebagai fallback.

---

## Production Deployment

Setelah setup environment variables di Vercel, push perubahan ke GitHub:

```bash
git add .
git commit -m "Add email functionality"
git push
```

Vercel akan otomatis redeploy dengan konfigurasi email yang baru.

---

## Security Notes

- ✅ Honeypot field untuk mencegah spam bots
- ✅ Email validation
- ✅ Rate limiting (built-in di Web3Forms)
- ✅ Environment variables tidak ter-commit ke GitHub
- ✅ Fallback ke mailto jika API gagal
