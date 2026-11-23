import React, { useState } from 'react';
import { Terminal, Check, AlertTriangle } from 'lucide-react';
import { TerminalFixOption } from '../../types/game';
import { sound } from '../../utils/audio';

interface TerminalFixModuleProps {
  context: string;
  brokenCode: string;
  options: TerminalFixOption[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const TerminalFixModule: React.FC<TerminalFixModuleProps> = ({
  context,
  brokenCode,
  options,
  isDefused,
  onSolve,
  onStrike,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleSelectOption = (opt: TerminalFixOption) => {
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
      {/* Retro CRT Terminal Box */}
      <div className="bg-black border-2 border-emerald-900 rounded-lg p-4 font-mono relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 scanline pointer-events-none" />

        <div className="flex items-center justify-between border-b border-emerald-950 pb-2 mb-3 text-emerald-500 text-xs">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold tracking-wider">NEURAL_TERMINAL://PATCH_BUFFER_04</span>
          </div>
          <span className="text-[10px] text-emerald-700 uppercase">STATUS: BUG DETECTED</span>
        </div>

        <div className="text-xs text-emerald-400/90 mb-2 font-semibold">
          # {context}
        </div>

        {/* Code View */}
        <pre className="bg-zinc-950 p-3 rounded border border-emerald-900/60 text-emerald-300 text-xs overflow-x-auto leading-relaxed">
          {brokenCode}
        </pre>
      </div>

      {/* Available Patches */}
      <div className="space-y-2">
        <div className="text-xs uppercase font-bold text-zinc-400">
          PILIH KODE PATCH UNTUK MENUTUP KEBOCOORAN DATA:
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt, idx) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                disabled={isDefused}
                onClick={() => handleSelectOption(opt)}
                className={`p-3 rounded-lg border text-left font-mono text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : 'bg-red-950/80 border-red-400 text-red-200'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-emerald-600 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">[{idx + 1}]</span>
                  <code className="text-emerald-300 font-semibold">{opt.codeSnippet}</code>
                </div>

                {isSelected && (
                  <div>
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

      {/* Feedback banner */}
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
            <strong>{feedback.isCorrect ? 'PATCH BERHASIL DIPASANG!' : 'PATCH REJECTED!'}</strong> {feedback.message}
          </div>
        </div>
      )}
    </div>
  );
};
