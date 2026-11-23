import React, { useState } from 'react';
import { Crosshair, Check, AlertTriangle } from 'lucide-react';
import { TacticalChoiceOption } from '../../types/game';
import { sound } from '../../utils/audio';

interface TacticalChoiceModuleProps {
  options: TacticalChoiceOption[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const TacticalChoiceModule: React.FC<TacticalChoiceModuleProps> = ({
  options,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleSelect = (opt: TacticalChoiceOption) => {
    if (isDefused) return;
    setSelectedId(opt.id);
    sound.playKeypadClick();

    if (opt.isCorrect) {
      setFeedback({ message: opt.explanation, isCorrect: true });
      onSolve();
    } else {
      setFeedback({ message: opt.explanation, isCorrect: false });
      onStrike(opt.explanation);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-xs uppercase font-bold text-yellow-400 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4" />
            PILIH DIAGNOSA PROTOKOL TAKTIS
          </span>
          <span className="text-[10px] text-zinc-500 uppercase">THEORETICAL ANALYSIS</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {options.map((opt, idx) => {
            const isSelected = selectedId === opt.id;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={opt.id}
                disabled={isDefused}
                onClick={() => handleSelect(opt)}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-3 ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100'
                      : 'bg-red-950/80 border-red-400 text-red-100'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/80'
                }`}
              >
                <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-600 border-emerald-300 text-white'
                      : 'bg-red-600 border-red-300 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}>
                  {letters[idx]}
                </span>

                <div className="flex-1 leading-relaxed">
                  {opt.text}
                </div>

                {isSelected && (
                  <div className="flex-shrink-0 mt-0.5">
                    {opt.isCorrect ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
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
            <strong>{feedback.isCorrect ? 'ANALISIS TEPAT!' : 'ANALISIS KELIRU!'}</strong> {feedback.message}
          </div>
        </div>
      )}
    </div>
  );
};
