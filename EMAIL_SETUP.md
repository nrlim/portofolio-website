# Email Setup Guide (Resend)

Project ini menggunakan **Resend** untuk mengirim email dari form kontak secara profesional.

### Setup Steps:

1. **Daftar di Resend**
   - Buka https://resend.com
   - Sign up dengan GitHub atau email
   - Verifikasi domain Anda (optional, untuk custom sender)

2. **Dapatkan API Key**
   - Dashboard → API Keys → Create API Key
   - Copy API key

3. **Konfigurasi di Project**
   - Buka file `.env` di root directory
   - Tambahkan API Key Anda:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

4. **Deploy ke Vercel**
   - Buka Vercel Dashboard: https://vercel.com/dashboard
   - Pilih project "portofolio-website"
   - Masuk ke Settings → Environment Variables
   - Tambahkan variable baru:
     - Name: `RESEND_API_KEY`
     - Value: (paste API key Anda)
     - Environment: Production, Preview, Development
   - Klik "Save"
   - Redeploy project Anda (atau push perubahan ke GitHub)

---

## Testing Locally

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka http://localhost:3000/#contact

3. Isi form dan klik "Kirim Pesan"

4. Check dashboard Resend atau email tujuan (`nuralim.mail@gmail.com`) untuk melihat pesan yang terkirim.

---

## Troubleshooting

### Email tidak terkirim?
1. Check console terminal/server untuk error messages
2. Pastikan `RESEND_API_KEY` sudah benar di file `.env`
3. Restart development server setelah menambah env variables
4. Check email spam/junk folder
5. Jika menggunakan domain `onboarding@resend.dev`, pastikan Anda mengirim ke email yang terdaftar di akun Resend Anda.

### Fallback Mode
Jika API gagal (misal API key salah atau limit habis), sistem akan otomatis mencoba membuka `mailto` link sebagai fallback agar user tetap bisa mengirim pesan secara manual.

---

## Security Notes

- ✅ **Honeypot field**: Mencegah spam bots mengisi form.
- ✅ **Rate Limiting**: Membatasi jumlah pengiriman pesan dari IP yang sama.
- ✅ **Email Validation**: Memastikan format email benar dan bukan temporary email.
- ✅ **Spam Detection**: Deteksi konten spam berbasis keyword.
- ✅ **Environment Variables**: API Key disimpan aman di server-side, tidak pernah terekspos ke browser.
- ✅ **Fallback Mechanism**: Tetap bisa menerima pesan via mailto jika layanan API down.
