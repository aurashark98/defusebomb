import React, { useState } from 'react';
import { BookOpen, X, Clock, AlertTriangle, Scissors, Terminal, Calculator, Sliders, Layers, Check } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'aturan' | 'kontrol' | 'modul'>('aturan');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-yellow-500/80 rounded-xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Top ribbon */}
        <div className="h-1.5 w-full hazard-stripes absolute top-0 left-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-black tracking-wider text-white uppercase">
              PANDUAN OPERASI // HOW TO PLAY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2 flex-shrink-0">
          {[
            { id: 'aturan', label: '1. ATURAN MISI' },
            { id: 'kontrol', label: '2. KONTROL 3D' },
            { id: 'modul', label: '3. JENIS MODUL AI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-zinc-950 shadow-md'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed pr-1">
          {activeTab === 'aturan' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-yellow-300 uppercase block mb-0.5">SISA WAKTU DETONATOR</strong>
                  <p className="text-zinc-400">
                    Kamu memiliki waktu terbatas <span className="text-yellow-400 font-bold">(10 menit)</span> untuk menjelajahi ruangan, menemukan kunci rahasia, membuka dokumen petunjuk di dalam peti, dan memecahkan seluruh modul AI di koper bom sebelum hitungan mundur mencapai 00:00.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-300 uppercase block mb-0.5">PENALTI KESALAHAN (STRIKES)</strong>
                  <p className="text-zinc-400">
                    Setiap kali salah potong kabel atau salah memasukkan nilai, bom akan mendapat <span className="text-red-400 font-bold">1 Strike</span> dan waktu bom langsung dipotong <span className="text-red-400 font-bold">-45 Detik</span>!
                  </p>
                  <p className="text-zinc-500 mt-1">
                    *Maksimal 3 Strike sebelum bom mengalami korsleting total dan meledak seketika!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kontrol' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                <strong className="text-yellow-400 uppercase block">EKSPLORASI RUANGAN PENYEKAPAN (FIRST-PERSON):</strong>
                <ul className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                  <li>🏃 <strong>[W, A, S, D]:</strong> Berjalan maju, mundur, kiri, kanan menjelajahi ruangan interogasi.</li>
                  <li>👀 <strong>Geser Mouse / Touchpad:</strong> Melihat ke sekeliling (kiri, kanan, atas, bawah). Klik layar saat berdiri untuk mengaktifkan Mouse Look, tekan [ESC] untuk melepas kursor.</li>
                  <li>🪑 <strong>[Q]:</strong> Duduk kembali di kursi meja bom. (Harus duduk dulu sebelum bisa defuse koper!).</li>
                  <li>🧍 <strong>[E]:</strong> Berdiri dari kursi untuk mulai menjelajah ruangan.</li>
                  <li>🔑 <strong>[X]:</strong> Tombol Interaksi:
                    <ul className="pl-4 list-disc text-zinc-400 mt-1 space-y-0.5">
                      <li>Di dekat rak perkakas: Menjawab teka-teki Elsi untuk mengambil Kunci Emas.</li>
                      <li>Di dekat lemari sudut belakang: Membuka Peti Rahasia berisi dokumen bocoran AI.</li>
                      <li>Saat duduk di kursi meja: Mulai interaksi defuse bom koper 3D!</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                <strong className="text-cyan-400 uppercase block">INTERAKSI MODUL BOM 3D (SAAT DUDUK & TEKAN X):</strong>
                <ul className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                  <li>🖱️ <strong>Klik & Drag:</strong> Putar koper bom 360 derajat (depan / belakang).</li>
                  <li>🔍 <strong>Scroll Mouse:</strong> Zoom in mendekati modul untuk melihat teks & diagram.</li>
                  <li>⚡ <strong>Klik Objek 3D:</strong> Klik kabel untuk potong, klik keypad untuk masukkan digit, klik dial untuk set nilai, klik opsi tactical multiple choice.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'modul' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Modul Potong Kabel (Wires)</strong>
                  <p className="text-zinc-400 text-[11px]">Analisis problem data (misal: imputasi outlier, high cardinality encoding) lalu potong kabel jawaban yang tepat.</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                <Calculator className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Keypad Confusion Matrix</strong>
                  <p className="text-zinc-400 text-[11px]">Hitung nilai metrik (Precision, Recall, Accuracy) dari tabel TP, FP, TN, FN lalu ketik persentasenya di tombol Numpad.</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Terminal CRT Bugfix</strong>
                  <p className="text-zinc-400 text-[11px]">Baca cuplikan kode Python/Pandas yang bocor (*data leakage*), pilih patch baris kode pengganti yang aman.</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
                <Sliders className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Dial Kalibrasi Overfitting</strong>
                  <p className="text-zinc-400 text-[11px]">Gunakan tombol -5/+5 untuk memutar knob `max_depth` ke rentang pruning optimal agar model tidak overfitting.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
          >
            <Check className="w-4 h-4" />
            MENGERTI // TUTUP PANDUAN
          </button>
        </div>
      </div>
    </div>
  );
};
