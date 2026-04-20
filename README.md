# CKG Robot

**CKG Robot** adalah Chrome Extension otomatisasi untuk membantu proses entri data di aplikasi **Sehat Indonesiaku (CKG)**.  
Ekstensi ini akan menjalankan otomatisasi pendaftaran, kehadiran, serta pemeriksaan hingga pengiriman rapor berdasarkan data yang sudah disiapkan.

---

## 🚀 Fitur Utama

- **Otomatisasi Pendaftaran & Kehadiran**  
  Menjalankan proses pendaftaran CKG dan menyatakan kehadiran secara otomatis.

- **Otomatisasi Pemeriksaan & Rapor**  
  Menginput data pemeriksaan dan mengirimkan rapor secara otomatis.

- **Download History & Logs**  
  Semua data yang sudah diproses bisa diunduh dalam format **Excel** untuk dokumentasi.

---

## 📦 Persiapan

1. Pastikan Anda sudah login dan berada di halaman utama aplikasi:  
   👉 [https://sehatindonesiaku.kemkes.go.id/](https://sehatindonesiaku.kemkes.go.id/)

2. Siapkan data dengan format sesuai template:  
   📂 `assets/Template Format.xlsx`

---

## 🔧 Instalasi (Developer Mode)

Karena ini adalah ekstensi khusus, instalasi dilakukan dalam **Developer Mode** di Chrome.

1. **Download / Clone** repository ini ke komputer Anda.
2. Buka **Google Chrome**.
3. Masuk ke menu:
   - Klik `⋮` (More) → `More Tools` → `Extensions`
   - Atau langsung buka: [chrome://extensions/](chrome://extensions/)
4. Aktifkan **Developer Mode** (toggle di kanan atas).
5. Klik tombol **Load unpacked**.
6. Pilih folder proyek ini (yang berisi file `manifest.json`).
7. Pastikan ekstensi **CKG Robot** sudah muncul di daftar ekstensi Chrome.

---

## ▶️ Menjalankan CKG Robot

1. Buka aplikasi **Sehat Indonesiaku** dan login.
2. Klik ikon **CKG Robot** di Chrome Extensions.
3. Load Data yang sudah disesuaikan dengan format template excel.
4. Pilih salah satu proses:
   - **Jalankan Pendaftaran dan Kehadiran** → Untuk otomatis mendaftar & menyatakan hadir.
   - **Jalankan Pemeriksaan** → Untuk otomatis input data pemeriksaan & kirim rapor.
5. Tunggu proses selesai. Status akan tampil di layar.
6. Download hasil **History & Logs** dalam format Excel jika diperlukan.

---

## ⚠️ Catatan

- Ekstensi hanya bekerja jika sudah login ke aplikasi **Sehat Indonesiaku**.
- Pastikan data yang digunakan sesuai dengan format di `Template Format.xlsx`.
- Gunakan **Chrome terbaru** agar semua API ekstensi dapat berjalan.

---

## Convert ps1 to exe

```powershell
Invoke-PS2EXE -InputFile ".\update.ps1" `
              -OutputFile ".\update.exe"
```

---

## 🛠 Troubleshooting

- Jika tombol tidak muncul → refresh halaman utama aplikasi.
- Jika data tidak terbaca → pastikan format Excel sesuai dengan template.
- Jika proses terhenti → periksa koneksi internet dan coba ulang.

---

## 📜 Lisensi

Ekstensi ini dibuat untuk tujuan internal/edukasi.
Tidak untuk diperjualbelikan.

```

```
