import React from 'react';
import { X, CheckCircle, Sparkles, FileText, Lightbulb } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ClueModalProps {
  onClose: () => void;
}

export const ClueModal: React.FC<ClueModalProps> = ({ onClose }) => {
  const handleClose = () => {
    sound.playKeypadClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-emerald-500/80 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5 max-h-[90vh] flex flex-col glow-green animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-emerald-500 absolute top-0 left-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                CATATAN INTELIJEN PETI TERSIMPAN
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                CLUE PROTOKOL DEFUSAL (HINT TIPIS)
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box with Subtle Hints */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 font-mono text-xs text-zinc-300">
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-600/40 text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Peti terbuka! Berikut petunjuk samar untuk membantu penalaran logikamu tanpa membocorkan jawaban langsung:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Clue 1 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #01 SENSOR CITRA MEDIS MATA
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Jika AI hanya dilatih di pencahayaan studio yang seragam, ia akan bingung di dunia nyata. Kurangnya variasi dan augmentasi kondisi pencahayaan pada data latih adalah akar permasalahannya.
              </p>
            </div>

            {/* Clue 2 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #02 BIAS DATA REKRUTMEN
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ketika 90% data pelamar masa lalu adalah laki-laki, AI menganggap gender tersebut sebagai faktor keberhasilan. Ketidakseimbangan ini melahirkan bias data yang tidak adil.
              </p>
            </div>

            {/* Clue 3 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #03 POLA VS PEMAHAMAN MANUSIA
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                AI tidak memiliki akal atau kesadaran. AI hanya mencocokkan pola statistik dan fitur piksel dari data yang telah dipelajari, bukan memahami esensi objek seperti manusia.
              </p>
            </div>

            {/* Clue 4 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #04 EVALUASI MODEL BARU
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Model yang baru selesai dilatih tidak boleh langsung dipakai di lapangan. Wajib dilakukan tahap pengujian (testing) dengan data baru untuk mengukur akurasi dan generalisasinya.
              </p>
            </div>

            {/* Clue 5 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #05 DIVERSIFIKASI DATASET KUCING
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Jika AI hanya kenal kucing putih, kucing hitam tampak asing. Solusi tepat bukanlah menghapus data atau menambah kucing putih, melainkan memperkaya variasi warna dan pose kucing.
              </p>
            </div>

            {/* Clue 6 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #06 EVOLUSI DEEP BLUE & ALPHAGO
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Dari catur berbasis aturan (1997) hingga permainan Go dengan kompleksitas kombinasi hampir tak terhingga (2016), AI terus berevolusi memecahkan problem yang semakin kompleks.
              </p>
            </div>

            {/* Clue 7 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #07 KOREKSI LABEL DATA (LABEL NOISE)
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Prinsip Garbage In, Garbage Out. Jika foto diberi label yang keliru, tindakan terbaik adalah memperbaiki dan memvalidasi kebenaran label tersebut sesuai objek aslinya.
              </p>
            </div>

            {/* Clue 8 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #08 PREDIKSI DINAMIS GOOGLE MAPS
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Prediksi macet dan waktu tiba bekerja dengan menemukan pola dari data pergerakan pengguna secara real-time dipadukan dengan riwayat lalu lintas historis.
              </p>
            </div>

            {/* Clue 9 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #09 PIPELINE TEACHABLE MACHINE
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Urutan logis pembuatan model: Kumpulkan contoh gambar gerakan lebih dulu → Latih model (training) → Uji akurasi (testing) → Gunakan model dalam aplikasi.
              </p>
            </div>

            {/* Clue 10 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #10 SISTEM REKOMENDASI PRODUK
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Pencarian dan riwayat belanja pengguna sangat penting agar sistem AI dapat mempelajari pola minat serta preferensi unik setiap pelanggan untuk memberi saran yang tepat.
              </p>
            </div>

            {/* Clue 11 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #11 KUALITAS DATA & PERFORMA AI
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Model secanggih apa pun akan gagal bila dilatih dengan data cacat. Kualitas, keberagaman variasi, serta ketepatan label data adalah faktor utama keberhasilan prediksi.
              </p>
            </div>

            {/* Clue 12 */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-yellow-400 font-bold text-[11px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                #12 HUMAN-IN-THE-LOOP MEDIS
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                AI medis hebat dalam mendeteksi pola citra, namun keputusan akhir, pertimbangan etis, empati, serta tanggung jawab medis mutlak berada di tangan dokter manusia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
