import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, Award, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface DefusedModalProps {
  remainingTime: number;
  strikes: number;
  maxStrikes: number;
  totalModules: number;
  onRestart: () => void;
}

export const DefusedModal: React.FC<DefusedModalProps> = ({
  remainingTime,
  strikes,
  maxStrikes,
  totalModules,
  onRestart
}) => {
  useEffect(() => {
    sound.playVictory();
    // Confetti cannon
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#00ff88', '#00d2ff', '#facc15', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate Operator Rank
  let rank = 'SENIOR ML SPECIALIST';
  let badgeColor = 'text-yellow-400 border-yellow-500/50 bg-yellow-950/30';
  if (strikes === 0 && remainingTime > 120) {
    rank = 'CHIEF NEURAL ARCHITECT (S-RANK)';
    badgeColor = 'text-emerald-300 border-emerald-400 bg-emerald-950/50';
  } else if (strikes >= 2) {
    rank = 'JUNIOR DEFUSAL SURVIVOR';
    badgeColor = 'text-amber-400 border-amber-500 bg-amber-950/30';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-emerald-500 rounded-xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden glow-green animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top celebratory icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg glow-green">
          <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-black text-emerald-400 mb-1">
            MISI SELESAI // ANCAMAN DINETRALKAN
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            NEURAL BOMB DEFUSED!
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Semua {totalModules} modul AI Pipeline berhasil dipecahkan sebelum timer detonator mencapai nol.
          </p>
        </div>

        {/* Rank badge */}
        <div className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${badgeColor}`}>
          <Award className="w-5 h-5 flex-shrink-0" />
          <span className="font-bold text-xs tracking-wider uppercase">{rank}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-zinc-950/80 p-3 rounded border border-zinc-800">
            <div className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              SISA WAKTU
            </div>
            <div className="font-digital text-2xl text-emerald-400 mt-1">{timeFormatted}</div>
          </div>

          <div className="bg-zinc-950/80 p-3 rounded border border-zinc-800">
            <div className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              STRIKE PENALTY
            </div>
            <div className="font-digital text-2xl text-zinc-200 mt-1">
              {strikes} / {maxStrikes}
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onRestart}
          className="w-full py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
        >
          <RotateCcw className="w-4 h-4" />
          MAIN ULANG / OPERASI BARU
        </button>
      </div>
    </div>
  );
};
