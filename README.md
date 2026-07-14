# CKG Robot

**CKG Robot** adalah Chrome Extension otomatisasi untuk membantu proses entri data di aplikasi **Sehat Indonesiaku (CKG)**.  
Ekstensi ini dirancang untuk memangkas birokrasi digital dan mempercepat proses pendaftaran, kehadiran, hingga pengisian data pemeriksaan secara otomatis.

---

## ☕ Dukung Pengembang

Aplikasi ini **100% Gratis** untuk digunakan oleh rekan-rekan nakes di seluruh Indonesia. Jika Anda merasa ekstensi ini membantu meringankan beban kerja Anda dan ingin memberikan apresiasi atau sekadar membelikan kopi untuk mendukung pengembangan lebih lanjut, Anda bisa berdonasi melalui:

👉 **[Trakteer.id/alf-anas](https://trakteer.id/alf-anas)**

---

## 🚀 Fitur Utama

- **Otomatisasi Pendaftaran & Kehadiran**  
  Menjalankan proses pendaftaran CKG dan mencatat kehadiran peserta secara otomatis.
- **Fleksibilitas Load Excel (Custom Mapping)**  
  Tidak lagi terpaku pada satu template kaku! Anda bisa memasukkan file Excel dengan format apa saja. Sistem menyediakan fitur pemetaan kolom (mapping) sehingga Anda dapat mencocokkan kolom Excel Anda dengan input yang dibutuhkan aplikasi.
- **Smart Date Parser**  
  Mendukung berbagai macam format penulisan tanggal di Excel (seperti `dd/mm/yyyy`, `yyyy-mm-dd`, dll.) tanpa perlu repot mengubah format sel secara manual.
- **Autofill Data Default & Pemeriksaan Mandiri**  
  Jika ada data penting yang kosong di Excel, robot akan otomatis mengisinya dengan data default agar proses entri tidak terhenti. Fitur ini juga sudah mencakup otomatisasi data untuk pemeriksaan mandiri.
- **Case-Sensitive Location Matcher**  
  Otomatisasi pengisian data wilayah (Provinsi, Kabupaten/Kota, Kecamatan, hingga Kelurahan/Desa) yang memastikan teks besar/kecilnya (case) sesuai persis dengan opsi yang tersedia di dropdown input CKG untuk menghindari error.
- **Download History & Logs**  
  Semua data yang berhasil maupun gagal diproses bisa diunduh kembali dalam format **Excel** sebagai bukti dokumentasi kerja Anda.

🚧 **Status Pengembangan:**  
_Fitur untuk otomatisasi skrining pelayanan oleh Tenaga Kesehatan (Nakes) saat ini masih dalam tahap pengembangan._

---

## 📝 Catatan Penting: Refleksi & Politik Birokrasi

> **💡 Mengapa Ekstensi Ini Harus Ada?**
>
> Cek Kesehatan Gratis (CKG) merupakan program dari presiden terpilih. Namun, dalam eksekusinya, program-program seperti ini sering kali justru membebani para Tenaga Kesehatan (Nakes) dengan gunungan administrasi digital. Nakes dituntut menghabiskan waktu berjam-jam di depan layar hanya untuk menginput angka-angka demi menyenangkan atasan dan memenuhi target laporan, alih-alih fokus pada esensi utama profesi mereka: **merawat dan melayani pasien.**
>
> Ekstensi ini dibuat sebagai bentuk solidaritas untuk meringankan beban kerja tersebut. Namun, robot hanyalah solusi jangka pendek (band-aid).
>
> **Pesan untuk rekan-rekan Nakes:**  
> Politik berdampak langsung pada keseharian kerja Anda. Kebijakan yang dibuat di atas menentukan seberapa banyak kertas atau form digital yang harus Anda isi hari ini. Oleh karena itu, di masa depan, mari lebih bijak dan cermat dalam memilih pemimpin. Pilihlah presiden dan wakil rakyat dengan benar, yang memiliki visi substantif terhadap sistem kesehatan, bukan yang sekadar menciptakan program berbasis proyek kosmetik yang ujung-ujungnya mengorbankan waktu berharga nakes bersama pasien.

---

## 📦 Persiapan

1. Pastikan Anda sudah login dan berada di halaman utama aplikasi:  
   👉 [https://sehatindonesiaku.kemkes.go.id/](https://sehatindonesiaku.kemkes.go.id/)
2. Siapkan file data Excel Anda (format bebas, karena nanti bisa di-mapping langsung di dalam ekstensi).

---

## 🔧 Instalasi (Developer Mode)

Karena ini adalah ekstensi khusus, instalasi dilakukan melalui **Developer Mode** di Google Chrome:

1. **Download / Clone** repository ini ke komputer Anda dan ekstrak jika berupa file ZIP.
2. Buka **Google Chrome**.
3. Masuk ke halaman ekstensi dengan cara:
   - Klik ikon `⋮` (Menu) → `Extensions` → `Manage Extensions`
   - Atau langsung akses tautan: [chrome://extensions/](chrome://extensions/)
4. Aktifkan **Developer Mode** melalui tombol _toggle_ di kanan atas halaman.
5. Klik tombol **Load unpacked** di kiri atas.
6. Pilih folder proyek ini (folder yang berisi file `manifest.json`).
7. Ekstensi **CKG Robot** akan muncul dan siap digunakan.

---

## ▶️ Cara Penggunaan

1. Buka aplikasi **Sehat Indonesiaku** dan pastikan Anda sudah login.
2. Klik ikon **CKG Robot** pada daftar ekstensi Chrome Anda (bisa di-pin agar mudah diakses).
3. Klik tombol untuk **Load Data** dan pilih file Excel Anda.
4. Lakukan pemetaan (mapping) kolom dari Excel ke kolom input sistem yang sesuai.
5. Pilih proses yang ingin dijalankan:
   - **Jalankan Pendaftaran dan Kehadiran** → Untuk otomatis mendaftar & menyatakan hadir.
   - **Jalankan Pemeriksaan** → Untuk otomatis input data pemeriksaan default & kirim rapor.
6. Pantau status yang muncul di layar dan tunggu hingga proses selesai.
7. Unduh hasil **History & Logs** dalam format Excel untuk arsip laporan Anda.

---

## 🛠 Troubleshooting

- **Tombol atau UI Ekstensi Tidak Muncul:** Coba refresh (F5) halaman utama aplikasi Sehat Indonesiaku.
- **Data Excel Gagal Terbaca:** Pastikan file tidak dalam keadaan _corrupt_ atau terkunci (password). Periksa kembali pemetaan kolom saat me-load file.
- **Proses Berhenti di Tengah Jalan:** Periksa stabilitas koneksi internet Anda, lalu coba jalankan ulang proses dari baris data yang belum terinput.

---

## 💻 Developer Notes

Untuk mengompilasi skrip pembaruan dari PowerShell ke Executable (jika diperlukan):

```powershell
Invoke-PS2EXE -InputFile ".\update.ps1" `
              -OutputFile ".\update.exe"
```
