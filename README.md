# TPA AL IMAN - Sistem Pendaftaran Santri Baru Digital

Aplikasi web modern untuk manajemen pendaftaran santri baru di TPA AL IMAN. Dibangun dengan fokus pada kemudahan pengguna, keamanan data, dan integrasi pembayaran digital.

## 📝 Deskripsi Aplikasi
TPA AL IMAN Digital adalah platform pendaftaran santri baru yang dirancang untuk mendigitalkan proses administrasi sekolah Al-Qur'an. Aplikasi ini memungkinkan calon wali santri untuk melakukan pendaftaran secara mandiri, mengunggah dokumen persyaratan, dan melakukan pembayaran biaya pendaftaran secara instan. Data yang masuk akan dikelola secara otomatis melalui integrasi cloud untuk memastikan efisiensi dan transparansi.

## 🚀 Fitur Utama

- **Landing Page Interaktif:** Tampilan responsif dengan desain bernuansa Islami yang modern.
- **Gallery Kegiatan:** Menampilkan dokumentasi kegiatan TPA menggunakan modal gambar yang elegan.
- **Formulir Pendaftaran Digital:** Pengisian data santri lengkap termasuk fitur unggah berkas (Foto, Ijazah, KK).
- **Integrasi Pembayaran (Midtrans):** Pembayaran biaya pendaftaran otomatis menggunakan Midtrans Snap API.
- **Penyimpanan Cloud (Google Sheets & Drive):** Data pendaftaran disimpan langsung ke Google Sheets dan berkas diunggah ke Google Drive melalui integrasi Google Apps Script.
- **Validasi Real-time:** Pengecekan data ganda (NISN, NIK, Email, No. Telp) untuk mencegah pendaftaran duplikat.
- **Notifikasi Terintegrasi:** Menggunakan SweetAlert2 untuk umpan balik pengguna yang profesional dan tidak menghalangi alur kerja.
- **Bukti PDF:** Fitur unduh bukti pendaftaran otomatis dalam format PDF setelah pembayaran berhasil.

## 📥 Cara Instalasi (Clone dari GitHub)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

1. **Clone Repositori:**
   Buka terminal atau command prompt, lalu jalankan perintah berikut:
   ```bash
   git clone https://github.com/mienarshihmsh-ux/tpqaliman.git
   ```

2. **Masuk ke Direktori Proyek:**
   ```bash
   cd tpqaliman
   ```

3. **Instal Dependensi:**
   Pastikan Anda sudah menginstal Node.js, lalu jalankan:
   ```bash
   npm install
   ```

4. **Konfigurasi Environment Variables:**
   Buat file bernama `.env` di folder root dan isi dengan kunci API Anda (lihat bagian Konfigurasi di bawah).

5. **Jalankan Server Pengembangan:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:9002` (atau port yang tertera di terminal).

## 📁 Struktur Proyek (Garis Besar)

Berikut adalah struktur folder utama dalam proyek ini:

- `src/app`: Logika utama aplikasi (Next.js App Router) dan Server Actions.
- `src/components`: Komponen UI reusable seperti Navbar, Hero, dan Modal Pendaftaran.
- `src/lib`: Utilitas, konfigurasi internal, dan tipe data TypeScript.
- `src/ai`: Integrasi kecerdasan buatan menggunakan Genkit.
- `public`: Aset statis seperti ikon dan manifest.

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS, Lucide Icons, Font Awesome.
- **UI Components:** Shadcn UI, Radix UI.
- **AI Integration:** Genkit.
- **Payment Gateway:** Midtrans Snap SDK.
- **Backend Bridge:** Google Apps Script.
- **Utility:** jsPDF (Generasi PDF), SweetAlert2 (Notifikasi).

## ⚙️ Konfigurasi Environment Variables

Pastikan Anda memiliki file `.env` dengan isi sebagai berikut:

```env
# Midtrans Keys
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxx

# Apps Script URL
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/xxxx/exec
```

---
© 2025 TPA AL IMAN - Dikembangkan dengan ❤️ untuk pendidikan Al-Qur'an yang lebih modern.