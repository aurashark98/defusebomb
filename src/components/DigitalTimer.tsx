import React from 'react';
import { Volume2, VolumeX, AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface DigitalTimerProps {
  timeLeft: number;
  strikes: number;
  maxStrikes: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  penaltyNotification: string | null;
}

export const DigitalTimer: React.FC<DigitalTimerProps> = ({
  timeLeft,
  strikes,
  maxStrikes,
  isMuted,
  onToggleMute,
  onRestart,
  penaltyNotification
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isCritical = timeLeft < 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-zinc-900 border-2 border-zinc-700 rounded-lg p-3 sm:p-4 shadow-2xl relative overflow-hidden">
      {/* Top metallic bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3 text-xs tracking-wider text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            DETONATION TIMER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded border ${
              isMuted ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-zinc-800 border-yellow-500/50 text-yellow-400'
            } hover:bg-zinc-700 transition`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onRestart}
            className="p-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
            title="Restart Mission"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Big LED Digital Clock */}
        <div className="relative">
          <div className="bg-black/90 px-5 py-2 rounded-md border-2 border-zinc-800 shadow-inner flex items-center justify-center">
            <span
              className={`font-digital text-5xl sm:text-6xl tracking-widest ${
                isCritical
                  ? 'text-red-500 animate-pulse text-glow-red'
                  : 'text-amber-500 text-glow-amber'
              }`}
            >
              {formattedTime}
            </span>
          </div>

          {/* Floating Penalty Indicator */}
          {penaltyNotification && (
            <div className="absolute -top-3 right-0 sm:-right-8 bg-red-600 text-white font-black text-xs sm:text-sm px-2 py-0.5 rounded shadow-lg animate-bounce border border-red-300">
              {penaltyNotification}
            </div>
          )}
        </div>

        {/* Strike Indicators */}
        <div className="flex flex-col items-center sm:items-end">
          <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            CRITICAL STRIKES: {strikes} / {maxStrikes}
          </div>
          
          <div className="flex items-center gap-2 bg-black/80 px-3 py-2 rounded border border-zinc-800">
            {Array.from({ length: maxStrikes }).map((_, idx) => {
              const isStruck = idx < strikes;
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center font-black text-sm sm:text-base border transition-all ${
                    isStruck
                      ? 'bg-red-600 border-red-400 text-white glow-red animate-pulse'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-700'
                  }`}
                >
                  {isStruck ? 'X' : '·'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
