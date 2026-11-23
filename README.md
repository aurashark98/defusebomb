# 💣 AI Bomb Defusal Unit (Neural Detonator)

Game simulasi penjinakan bom berbasis web yang menantang pemain memecahkan masalah **Machine Learning & Data Science** (EDA, Preprocessing, Scaling, Imputasi, Evaluasi Matriks) di bawah tekanan waktu mundur digital.

Setiap kesalahan potong kabel atau salah input akan memicu **Strike** dan penalti waktu (**-45 detik**)!

---

## ⚡ Fitur Utama

- **Ticking Digital HUD**: Tampilan jam digital 7-segment dengan efek detak jantung bom (*tick-tock* Web Audio API).
- **Penalti Waktu & Goncangan Layar**: Salah menjawab memotong waktu dan mengguncang layar secara dramatis.
- **8 Modul Taktis AI**:
  1. **Modul 01**: Kabel Imputasi Data (Mean vs Median vs Outlier).
  2. **Modul 02**: Radar Multikolinearitas & EDA (Korelasi Pearson r = 1.00).
  3. **Modul 03**: Keypad Detonator Confusion Matrix (Hitung Precision dari TP, FP, TN, FN).
  4. **Modul 04**: Terminal CRT Bugfix (Mencegah Data Leakage `scaler.transform`).
  5. **Modul 05**: Kabel Encoding High Cardinality (Target/Frequency Encoding vs Curse of Dimensionality).
  6. **Modul 06**: Dial Kalibrasi Overfitting Tree (Pruning `max_depth` pada Decision Tree).
  7. **Modul 07**: Urutan Urgen Pipeline ML (Menyusun sekuens eksekusi data yang benar).
  8. **Modul 08**: Optimasi Metrik Kritis Nyawa (Recall vs False Negative).
- **100% Client-Side Audio Synth**: Tidak ada file MP3 eksternal; semua suara (detik bom, kabel putus, alarm penalti, ledakan bom, musik kemenangan) disintesis langsung lewat browser via **Web Audio API**.
- **Animasi Confetti**: Perayaan kemenangan otomatis saat semua modul berhasil didefuse.

---

## 🛠️ Menjalankan di Komputer Lokal

1. Buka terminal di folder ini:
   ```bash
   npm run dev
   ```
2. Buka URL yang muncul di browser (biasanya `http://localhost:5173`).

---

## 🚀 Cara Hosting ke Vercel (Gratis & Cepat)

### Cara 1: Lewat GitHub (Paling Direkomendasikan)
1. Inisialisasi Git dan push folder ini ke repository GitHub kamu:
   ```bash
   git init
   git add .
   git commit -m "feat: AI Bomb Defusal Game"
   git branch -M main
   git remote add origin https://github.com/<username-kamu>/<nama-repo>.git
   git push -u origin main
   ```
2. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
3. Klik tombol **"Add New..."** -> **"Project"**.
4. Pilih repository `gameSoalAI` kamu, lalu klik **"Deploy"**.
5. Selesai! Game langsung aktif di domain publik seperti `https://ai-bomb-defusal.vercel.app`.

### Cara 2: Lewat Vercel CLI Langsung dari Terminal
Jika sudah punya Vercel CLI:
```bash
npx vercel
```
Ikuti petunjuk di terminal (pilih default untuk semua pertanyaan), dan proyek akan langsung ter-upload ke Vercel.
