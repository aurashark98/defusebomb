import React from 'react';
import { CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { DefusalModule } from '../types/game';

interface ModuleListNavProps {
  modules: DefusalModule[];
  currentModuleIndex: number;
  onSelectModule: (index: number) => void;
}

export const ModuleListNav: React.FC<ModuleListNavProps> = ({
  modules,
  currentModuleIndex,
  onSelectModule,
}) => {
  const defusedCount = modules.filter(m => m.isDefused).length;

  return (
    <div className="bg-zinc-900/90 border-2 border-zinc-700 rounded-lg p-3 sm:p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          CIRCUITS DECRYPTED: {defusedCount} / {modules.length}
        </span>
        <div className="w-24 bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${(defusedCount / modules.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {modules.map((mod, index) => {
          const isSelected = index === currentModuleIndex;
          const isDefused = mod.isDefused;

          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(index)}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-yellow-500 bg-zinc-800/90 shadow-md ring-1 ring-yellow-500/50'
                  : isDefused
                  ? 'border-emerald-600/60 bg-emerald-950/20 hover:bg-emerald-950/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-bold text-zinc-400">
                  MOD 0{index + 1}
                </span>
                {isDefused ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
                )}
              </div>

              <div className="text-[11px] font-semibold truncate text-zinc-200">
                {mod.category}
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
