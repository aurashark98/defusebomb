import React, { useState } from 'react';
import { Sliders, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TuningDialData } from '../../types/game';
import { sound } from '../../utils/audio';

interface TuningDialModuleProps {
  dialData: TuningDialData;
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const TuningDialModule: React.FC<TuningDialModuleProps> = ({
  dialData,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [val, setVal] = useState<number>(dialData.currentValue);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDefused) return;
    setVal(parseInt(e.target.value, 10));
    sound.playKeypadClick();
  };

  const handleLock = () => {
    if (isDefused) return;

    const [minTarget, maxTarget] = dialData.targetRange;
    const isTarget = val >= minTarget && val <= maxTarget;

    if (isTarget) {
      sound.playModuleDefused();
      setFeedback({ message: dialData.correctFeedback, isCorrect: true });
      onSolve();
    } else {
      const explanation = `${dialData.wrongFeedback} Nilai ${dialData.parameterName} = ${val} belum menghentikan overfitting/underfitting.`;
      setFeedback({ message: explanation, isCorrect: false });
      onStrike(explanation);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-xs uppercase font-bold text-yellow-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            DIAL HYPERPARAMETER TUNING
          </span>
          <span className="text-[10px] text-zinc-500 uppercase">PRUNING CALIBRATOR</span>
        </div>

        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
          <div className="text-red-400 font-bold mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {dialData.scenario}
          </div>
          <p className="text-[11px] text-zinc-400">{dialData.description}</p>
        </div>

        {/* Dial Slider Gauge */}
        <div className="space-y-2 py-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-mono">PARAMETER: <strong className="text-white">{dialData.parameterName}</strong></span>
            <span className="font-digital text-3xl text-yellow-400">{val} <span className="text-xs font-mono text-zinc-500">{dialData.unit}</span></span>
          </div>

          <input
            type="range"
            min={dialData.min}
            max={dialData.max}
            step={dialData.step}
            value={val}
            disabled={isDefused}
            onChange={handleChange}
            className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 disabled:opacity-50"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>MIN: {dialData.min}</span>
            <span className="text-emerald-400/80">ZONA PRUNING AMAN: [{dialData.targetRange[0]} - {dialData.targetRange[1]}]</span>
            <span>MAX: {dialData.max}</span>
          </div>
        </div>

        {!isDefused && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleLock}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              KUNCI NILAI HYPERPARAMETER
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded border text-xs leading-relaxed flex items-start gap-2 ${
            feedback.isCorrect
              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
              : 'bg-red-950/60 border-red-500 text-red-200'
          }`}
        >
          {feedback.isCorrect ? (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <strong>{feedback.isCorrect ? 'KALIBRASI BERHASIL!' : 'KALIBRASI DITOLAK!'}</strong> {feedback.message}
          </div>
        </div>
      )}
    </div>
  );
};
