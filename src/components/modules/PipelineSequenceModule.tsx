import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, AlertTriangle, Layers } from 'lucide-react';
import { PipelineStep } from '../../types/game';
import { sound } from '../../utils/audio';

interface PipelineSequenceModuleProps {
  initialSteps: PipelineStep[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const PipelineSequenceModule: React.FC<PipelineSequenceModuleProps> = ({
  initialSteps,
  isDefused,
  onSolve,
  onStrike
}) => {
  // Scramble initial steps so user has to sort them
  const [steps, setSteps] = useState<PipelineStep[]>(() => {
    // Deterministic shuffle
    return [
      initialSteps[2],
      initialSteps[0],
      initialSteps[4],
      initialSteps[1],
      initialSteps[3],
    ];
  });

  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isDefused) return;
    sound.playKeypadClick();

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setSteps(newSteps);
  };

  const handleVerify = () => {
    if (isDefused) return;

    // Check if step orders match 1, 2, 3, 4, 5
    const isCorrect = steps.every((s, idx) => s.order === idx + 1);

    if (isCorrect) {
      sound.playModuleDefused();
      setFeedback({
        message: 'SEKUENS VALID! Data split dilakukan di awal sebelum imputasi dan scaling untuk mencegah Data Leakage.',
        isCorrect: true
      });
      onSolve();
    } else {
      const explanation = 'URUTAN PIPELINE SALAH! Pastikan Train/Test split dilakukan sebelum transformator apa pun, dan evaluasi diletakkan di akhir.';
      setFeedback({ message: explanation, isCorrect: false });
      onStrike(explanation);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
          <span className="text-xs uppercase font-bold text-yellow-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            URUTKAN PIPELINE MACHINE LEARNING
          </span>
          <span className="text-[10px] text-zinc-500">GUNAKAN TOMBOL ATAS / BAWAH</span>
        </div>

        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-zinc-800 text-yellow-400 font-bold text-xs flex items-center justify-center border border-zinc-700">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-zinc-200">{step.name}</span>
              </div>

              {!isDefused && (
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveStep(idx, 'up')}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:hover:bg-zinc-800 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === steps.length - 1}
                    onClick={() => moveStep(idx, 'down')}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:hover:bg-zinc-800 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {!isDefused && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleVerify}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              <Check className="w-4 h-4" />
              KALIBRASI & KUNCI URUTAN
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
            <strong>{feedback.isCorrect ? 'VALIDASI PIPELINE SUKSES!' : 'PIPELINE ERROR!'}</strong> {feedback.message}
          </div>
        </div>
      )}
    </div>
  );
};
