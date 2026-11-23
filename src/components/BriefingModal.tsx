import React from 'react';
import { Play, ShieldAlert, Clock, AlertTriangle, Cpu, HelpCircle } from 'lucide-react';

interface BriefingModalProps {
  onStart: () => void;
  totalTimeSeconds: number;
  penaltySeconds: number;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  onStart,
  totalTimeSeconds,
  penaltySeconds
}) => {
  const minutes = Math.floor(totalTimeSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-yellow-500/80 rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
        
        {/* Hazard top ribbon */}
        <div className="h-2 w-full hazard-stripes absolute top-0 left-0" />

        <div className="text-center space-y-1 pt-1">
          <div className="text-[11px] font-black uppercase tracking-widest text-yellow-400 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            TOP SECRET // OPERASI DEFUSE AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI BOMB DEFUSAL UNIT
          </h1>
          <p className="text-xs text-zinc-400">
            Satu bom cerdas (Neural Detonator) terkunci dengan sirkuit soal-soal Machine Learning & Data Science.
          </p>
        </div>

        {/* Mission Rules */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-3">
            <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-yellow-300">WAKTU TERBATAS ({minutes} MENIT):</strong>
              <p className="text-zinc-400 mt-0.5">
                Kamu harus menyelesaikan seluruh modul (EDA, Preprocessing, Scaling, Evaluation) sebelum hitungan mundur mencapai 00:00.
              </p>
            </div>
          </div>

          <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-300">PENALTI WAKTU & STRIKE:</strong>
              <p className="text-zinc-400 mt-0.5">
                Setiap kali kamu salah menjawab/salah potong kabel, waktu bom langsung dipotong <span className="text-red-400 font-bold">-{penaltySeconds} detik</span> dan kamu mendapat 1 Strike. Maksimal 3 Strike!
              </p>
            </div>
          </div>

          <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-300">BERBAGAI TIPE MODUL:</strong>
              <p className="text-zinc-400 mt-0.5">
                Potong kabel logika, perbaiki baris kode bug di terminal CRT, hitung precision di confusion matrix keypad, dan urutkan pipeline data.
              </p>
            </div>
          </div>
        </div>

        {/* Start Game Action */}
        <div className="pt-2">
          <button
            onClick={onStart}
            className="w-full py-3.5 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            MULAI JINAKKAN BOM (START DEFUSAL)
          </button>
        </div>
      </div>
    </div>
  );
};
