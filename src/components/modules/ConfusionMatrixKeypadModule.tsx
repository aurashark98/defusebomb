import React, { useState } from 'react';
import { Calculator, Check, AlertTriangle, Delete, CornerDownLeft } from 'lucide-react';
import { ConfusionMatrixData } from '../../types/game';
import { sound } from '../../utils/audio';

interface ConfusionMatrixKeypadModuleProps {
  matrixData: ConfusionMatrixData;
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const ConfusionMatrixKeypadModule: React.FC<ConfusionMatrixKeypadModuleProps> = ({
  matrixData,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleKeyPress = (num: string) => {
    if (isDefused || pinInput.length >= 4) return;
    sound.playKeypadClick();
    setPinInput(prev => prev + num);
  };

  const handleClear = () => {
    sound.playKeypadClick();
    setPinInput('');
  };

  const handleSubmit = () => {
    if (isDefused || pinInput === '') return;
    const numericValue = parseInt(pinInput, 10);

    const isMatch = Math.abs(numericValue - matrixData.correctAnswer) <= (matrixData.tolerance || 0);

    if (isMatch) {
      sound.playKeypadClick();
      setFeedback({
        message: `KODE OTORISASI DITERIMA! Nilai ${matrixData.targetMetricLabel} adalah ${numericValue}% (${matrixData.tp} / (${matrixData.tp} + ${matrixData.fp}) = 0.80).`,
        isCorrect: true
      });
      onSolve();
    } else {
      const explanation = `KODE SALAH! Nilai ${matrixData.targetMetricLabel} bukan ${numericValue}%. ${matrixData.hint}`;
      setFeedback({ message: explanation, isCorrect: false });
      onStrike(explanation);
      setPinInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Column: Confusion Matrix Display */}
      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-xs uppercase font-bold text-yellow-400 flex items-center gap-1.5">
            <Calculator className="w-4 h-4" />
            RADAR MATRIX 2x2
          </span>
          <span className="text-[10px] text-zinc-500 uppercase">CLASSIFICATION REPORT</span>
        </div>

        <div className="overflow-hidden border border-zinc-700 rounded text-center text-xs">
          <div className="grid grid-cols-3 bg-zinc-900 border-b border-zinc-700 font-bold text-zinc-400 py-1.5">
            <div>Actual \ Pred</div>
            <div className="text-emerald-400">Pred: Positif</div>
            <div className="text-amber-400">Pred: Negatif</div>
          </div>
          <div className="grid grid-cols-3 border-b border-zinc-800 py-2 items-center bg-zinc-900/40">
            <div className="font-bold text-emerald-400">Act: Positif</div>
            <div className="font-black text-sm text-emerald-300 bg-emerald-950/40 mx-1 py-1 rounded border border-emerald-800/60">
              TP = {matrixData.tp}
            </div>
            <div className="font-black text-sm text-amber-300 bg-amber-950/40 mx-1 py-1 rounded border border-amber-800/60">
              FN = {matrixData.fn}
            </div>
          </div>
          <div className="grid grid-cols-3 py-2 items-center bg-zinc-900/40">
            <div className="font-bold text-amber-400">Act: Negatif</div>
            <div className="font-black text-sm text-red-300 bg-red-950/40 mx-1 py-1 rounded border border-red-800/60">
              FP = {matrixData.fp}
            </div>
            <div className="font-black text-sm text-zinc-300 bg-zinc-800/40 mx-1 py-1 rounded border border-zinc-700/60">
              TN = {matrixData.tn}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 leading-normal">
          <strong className="text-yellow-400">TARGET TARGET:</strong> Hitung nilai <span className="font-black text-white underline">{matrixData.targetMetricLabel}</span>.
          <div className="text-zinc-400 mt-1 italic">{matrixData.hint}</div>
        </div>
      </div>

      {/* Right Column: Military Keypad */}
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between">
        {/* Keypad Display Screen */}
        <div className="bg-black border-2 border-zinc-800 rounded p-2 mb-3 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 font-mono">INPUT CODE:</span>
          <div className="font-digital text-3xl text-emerald-400 tracking-widest px-2">
            {pinInput ? `${pinInput}%` : '_ _ %'}
          </div>
        </div>

        {/* 0-9 Keypad Grid */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key => (
            <button
              key={key}
              disabled={isDefused}
              onClick={() => handleKeyPress(key)}
              className="py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-sm border border-zinc-700 shadow active:scale-95 transition"
            >
              {key}
            </button>
          ))}
          <button
            disabled={isDefused}
            onClick={handleClear}
            className="py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold text-xs border border-zinc-700 flex items-center justify-center gap-1 active:scale-95 transition"
          >
            <Delete className="w-3.5 h-3.5" />
            CLR
          </button>
          <button
            disabled={isDefused}
            onClick={() => handleKeyPress('0')}
            className="py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-sm border border-zinc-700 active:scale-95 transition"
          >
            0
          </button>
          <button
            disabled={isDefused || !pinInput}
            onClick={handleSubmit}
            className="py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs border border-emerald-400 flex items-center justify-center gap-1 active:scale-95 transition"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            ENT
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mt-3 p-2 rounded border text-xs leading-tight flex items-start gap-1.5 ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-red-950/60 border-red-500 text-red-200'
            }`}
          >
            {feedback.isCorrect ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-[11px]">{feedback.message}</div>
          </div>
        )}
      </div>
    </div>
  );
};
