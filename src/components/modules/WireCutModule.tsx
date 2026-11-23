import React, { useState } from 'react';
import { Scissors, CheckCircle, AlertTriangle } from 'lucide-react';
import { WireOption } from '../../types/game';
import { sound } from '../../utils/audio';

interface WireCutModuleProps {
  wires: WireOption[];
  isDefused: boolean;
  onSolve: () => void;
  onStrike: (explanation: string) => void;
}

export const WireCutModule: React.FC<WireCutModuleProps> = ({
  wires,
  isDefused,
  onSolve,
  onStrike
}) => {
  const [cutWireIds, setCutWireIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleCut = (wire: WireOption) => {
    if (isDefused || cutWireIds.includes(wire.id)) return;

    sound.playWireCut();
    setCutWireIds(prev => [...prev, wire.id]);

    if (wire.isCorrect) {
      setFeedback({ message: wire.explanation, isCorrect: true });
      onSolve();
    } else {
      setFeedback({ message: wire.explanation, isCorrect: false });
      onStrike(wire.explanation);
    }
  };

  const getWireColorClasses = (color: WireOption['color']) => {
    switch (color) {
      case 'red': return 'bg-red-500 border-red-700 shadow-red-500/50';
      case 'blue': return 'bg-blue-500 border-blue-700 shadow-blue-500/50';
      case 'yellow': return 'bg-amber-400 border-amber-600 shadow-amber-400/50';
      case 'green': return 'bg-emerald-500 border-emerald-700 shadow-emerald-500/50';
      case 'purple': return 'bg-purple-500 border-purple-700 shadow-purple-500/50';
      case 'cyan': return 'bg-cyan-400 border-cyan-600 shadow-cyan-400/50';
      default: return 'bg-zinc-400 border-zinc-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 relative">
        <div className="text-xs uppercase font-bold text-zinc-400 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-yellow-400">
            <Scissors className="w-4 h-4" />
            INSTRUKSI: POTONG KABEL YANG MERUPAKAN SOLUSI TEPAT!
          </span>
          <span className="text-[10px] text-zinc-500">AWAS: SALAH POTONG = TIME PENALTY</span>
        </div>

        <div className="space-y-4 py-2">
          {wires.map((wire, idx) => {
            const isCut = cutWireIds.includes(wire.id);

            return (
              <div
                key={wire.id}
                className="group relative flex items-center justify-between bg-zinc-900/80 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition"
              >
                {/* Left Connector Terminal */}
                <div className="w-4 h-6 bg-amber-600/60 rounded border border-amber-500/70 flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                </div>

                {/* Wire Graphic */}
                <div className="flex-1 mx-3 flex items-center justify-center relative overflow-hidden py-2">
                  {isCut ? (
                    <div className="flex items-center w-full justify-between">
                      <div className={`h-2.5 w-[38%] rounded-l ${getWireColorClasses(wire.color)}`} />
                      <div className="text-red-500 font-black text-xs uppercase tracking-widest px-2 animate-pulse">
                        [ SEVERED ]
                      </div>
                      <div className={`h-2.5 w-[38%] rounded-r ${getWireColorClasses(wire.color)}`} />
                    </div>
                  ) : (
                    <div
                      className={`h-2.5 w-full rounded shadow-md border-t border-b ${getWireColorClasses(
                        wire.color
                      )} group-hover:brightness-125 transition-all cursor-pointer`}
                      onClick={() => handleCut(wire)}
                    />
                  )}
                </div>

                {/* Right Connector Terminal */}
                <div className="w-4 h-6 bg-amber-600/60 rounded border border-amber-500/70 flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                </div>

                {/* Wire Label & Action Button */}
                <div className="ml-4 w-1/2 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-200">
                    <strong className="text-zinc-400 mr-1.5">[{idx + 1}]</strong>
                    {wire.label}
                  </span>

                  {!isCut && !isDefused && (
                    <button
                      onClick={() => handleCut(wire)}
                      className="ml-2 px-2.5 py-1 text-xs font-bold rounded bg-red-600/80 hover:bg-red-500 text-white flex items-center gap-1 border border-red-400 shadow transition active:scale-95"
                    >
                      <Scissors className="w-3 h-3" />
                      SNIP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded border text-xs leading-relaxed flex items-start gap-2 ${
            feedback.isCorrect
              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
              : 'bg-red-950/60 border-red-500 text-red-200'
          }`}
        >
          {feedback.isCorrect ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <strong>{feedback.isCorrect ? 'SIRKUIT DINONAKTIFKAN!' : 'PERINGATAN SALAH POTONG!'}</strong> {feedback.message}
          </div>
        </div>
      )}
    </div>
  );
};
