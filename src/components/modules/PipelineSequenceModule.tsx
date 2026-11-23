import React, { useState, useCallback } from 'react';
import { Check, AlertTriangle, Layers, GripVertical } from 'lucide-react';
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
  // Pool of items to place (always shown scrambled)
  const POOL_ORDER = [2, 0, 4, 1, 3]; // scrambled indices into initialSteps
  const poolItems = POOL_ORDER.map(i => initialSteps[i]);

  // 5 slots, each holds a step id or null
  const [slots, setSlots] = useState<(PipelineStep | null)[]>([null, null, null, null, null]);
  // Which pool items have been placed
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  // Which pool item is selected to place
  const [selected, setSelected] = useState<PipelineStep | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleSelectFromPool = (step: PipelineStep) => {
    if (isDefused || placed.has(step.id)) return;
    sound.playKeypadClick();
    setSelected(prev => prev?.id === step.id ? null : step);
  };

  const handleClickSlot = (slotIdx: number) => {
    if (isDefused) return;

    // If slot already has an item, remove it back to pool
    if (slots[slotIdx] !== null) {
      const removed = slots[slotIdx]!;
      sound.playKeypadClick();
      setSlots(prev => { const n = [...prev]; n[slotIdx] = null; return n; });
      setPlaced(prev => { const n = new Set(prev); n.delete(removed.id); return n; });
      return;
    }

    // If something selected from pool, place it
    if (selected) {
      sound.playKeypadClick();
      setSlots(prev => { const n = [...prev]; n[slotIdx] = selected; return n; });
      setPlaced(prev => new Set([...prev, selected.id]));
      setSelected(null);
    }
  };

  const handleVerify = () => {
    if (isDefused) return;
    if (slots.some(s => s === null)) {
      setFeedback({ message: 'Semua slot harus diisi terlebih dahulu!', isCorrect: false });
      return;
    }

    // Check if each slot's item has the correct order
    const isCorrect = slots.every((step, idx) => step!.order === idx + 1);

    if (isCorrect) {
      sound.playModuleDefused();
      setFeedback({
        message: 'SEKUENS VALID! Data split dilakukan di awal sebelum imputasi dan scaling untuk mencegah Data Leakage.',
        isCorrect: true
      });
      onSolve();
    } else {
      const explanation = 'URUTAN PIPELINE SALAH! Pastikan Train/Test Split dilakukan SEBELUM transformasi apapun, dan evaluasi di akhir.';
      setFeedback({ message: explanation, isCorrect: false });
      onStrike(explanation);
      // Reset slots so they can retry
      setSlots([null, null, null, null, null]);
      setPlaced(new Set());
      setSelected(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
          <span className="text-xs uppercase font-bold text-yellow-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            URUTKAN PIPELINE MACHINE LEARNING
          </span>
        </div>

        {/* Instructions */}
        <div className="mb-4 p-2.5 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-400 leading-relaxed">
          <strong className="text-yellow-400">Cara bermain:</strong> Klik item dari <span className="text-cyan-400">POOL</span> untuk memilihnya, lalu klik <span className="text-yellow-400">SLOT</span> yang sesuai. Klik item di slot untuk mengembalikannya ke pool.
        </div>

        {/* Two-column layout: Pool | Slots */}
        <div className="grid grid-cols-2 gap-4">
          {/* LEFT: Pool of items */}
          <div>
            <div className="text-[10px] uppercase font-bold text-cyan-400 mb-2 tracking-widest">📦 POOL LANGKAH</div>
            <div className="space-y-1.5">
              {poolItems.map(step => {
                const isPlaced = placed.has(step.id);
                const isSelectedItem = selected?.id === step.id;
                return (
                  <button
                    key={step.id}
                    disabled={isPlaced || isDefused}
                    onClick={() => handleSelectFromPool(step)}
                    className={`w-full text-left px-2.5 py-2 rounded text-xs font-semibold border transition flex items-center gap-2
                      ${isPlaced
                        ? 'opacity-30 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-500'
                        : isSelectedItem
                          ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-cyan-500/60 hover:bg-zinc-700 cursor-pointer active:scale-95'
                      }`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                    <span>{step.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Numbered slots */}
          <div>
            <div className="text-[10px] uppercase font-bold text-yellow-400 mb-2 tracking-widest">🔢 URUTAN EKSEKUSI</div>
            <div className="space-y-1.5">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClickSlot(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs border transition flex items-center gap-2 min-h-[36px]
                    ${slot
                      ? 'bg-yellow-950/40 border-yellow-500/70 text-yellow-100 hover:border-red-400 hover:bg-red-950/30'
                      : selected
                        ? 'border-dashed border-cyan-500/80 bg-cyan-950/20 text-cyan-400 cursor-pointer hover:bg-cyan-950/40 animate-pulse'
                        : 'border-dashed border-zinc-700 bg-zinc-900 text-zinc-600 cursor-default'
                    }`}
                >
                  <span className="w-5 h-5 rounded bg-zinc-800 text-yellow-400 font-black text-[10px] flex items-center justify-center border border-zinc-700 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold">
                    {slot ? slot.name : selected ? '← Klik untuk tempatkan' : 'Kosong'}
                  </span>
                  {slot && <span className="ml-auto text-red-400 text-[10px] font-bold">✕ hapus</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!isDefused && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleVerify}
              disabled={slots.some(s => s === null)}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              <Check className="w-4 h-4" />
              KUNCI URUTAN
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
