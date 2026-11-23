import React, { useEffect } from 'react';
import { Flame, RotateCcw, AlertOctagon, Skull } from 'lucide-react';
import { sound } from '../utils/audio';

interface ExplosionModalProps {
  reason: 'timeout' | 'max_strikes';
  defusedCount: number;
  totalModules: number;
  onRestart: () => void;
}

export const ExplosionModal: React.FC<ExplosionModalProps> = ({
  reason,
  defusedCount,
  totalModules,
  onRestart
}) => {
  useEffect(() => {
    sound.playExplosion();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border-2 border-red-600 rounded-xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden glow-red animate-shake">
        
        {/* Danger stripes top */}
        <div className="h-2 w-full hazard-stripes-danger absolute top-0 left-0" />

        {/* Skull Explosion Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-xl glow-red animate-pulse">
          <Skull className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-black text-red-500 mb-1 flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            DETONATION SEQUENCE TRIGGERED!
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide text-glow-red">
            BOOOOM!
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {reason === 'timeout'
              ? 'WAKTU HABIS! Detonator bom meledak karena waktu perhitungan AI habis.'
              : 'LIMIT STRIKE TERCAPAI! Terlalu banyak kesalahan teknis memicu korsleting bom.'}
          </p>
        </div>

        {/* Progress achieved */}
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
          <span className="text-zinc-500 uppercase font-bold flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-yellow-500" />
            MODUL BERHASIL DINETRALKAN:
          </span>
          <span className="font-digital text-xl text-yellow-400">
            {defusedCount} / {totalModules}
          </span>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
        >
          <RotateCcw className="w-4 h-4" />
          COBA LAGI (RESET TIMER)
        </button>
      </div>
    </div>
  );
};
