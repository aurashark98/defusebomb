import React from 'react';
import { Play, BookOpen, Settings, ShieldAlert, AlertTriangle, Clock } from 'lucide-react';
import { sound } from '../../utils/audio';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenHowToPlay,
  onOpenSettings
}) => {
  const handleStart = () => {
    sound.playKeypadClick();
    onStartGame();
  };

  const handleHowToPlay = () => {
    sound.playKeypadClick();
    onOpenHowToPlay();
  };

  const handleSettings = () => {
    sound.playKeypadClick();
    onOpenSettings();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0d0d11] overflow-hidden select-none font-sans">
      
      {/* ── Background Tactical Grid ─────────────────────────────────────────── */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#eab308 1px, transparent 1px),
            linear-gradient(90deg, #eab308 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute inset-0 bg-radial-gradient opacity-60 pointer-events-none" />

      {/* ── Top-Left Corner Hazard Ribbon ────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-36 h-36 overflow-hidden pointer-events-none z-20">
        <div 
          className="w-52 h-10 bg-yellow-500 absolute -top-1 -left-12 -rotate-45 shadow-2xl flex items-center justify-center border-b-2 border-black"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 14px, #eab308 14px, #eab308 28px)'
          }}
        />
      </div>

      {/* ── Top-Right HUD Navigation (Setting | Cara Bermain) ─────────────────── */}
      <div className="absolute top-4 right-4 z-30 flex items-center">
        <div 
          className="relative bg-zinc-950/90 border border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.2)] px-5 py-2.5 flex items-center gap-3 backdrop-blur-md"
          style={{
            clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 12px)'
          }}
        >
          {/* Subtle Corner accent */}
          <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-yellow-400 pointer-events-none" />
          
          <button
            onClick={handleSettings}
            className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 hover:text-yellow-400 transition tracking-wider"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>SETTING</span>
          </button>

          <div className="h-3.5 w-px bg-zinc-700/80" />

          <button
            onClick={handleHowToPlay}
            className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 hover:text-yellow-400 transition tracking-wider"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>CARA BERMAIN</span>
          </button>
        </div>
      </div>

      {/* ── Background Left: Realistic 3D Bomb Illustration ──────────────────── */}
      <div className="absolute left-6 lg:left-14 top-1/2 -translate-y-1/2 w-64 lg:w-80 h-96 opacity-40 lg:opacity-75 pointer-events-none z-0 hidden sm:block">
        <div className="relative w-full h-full">
          {/* Heavy Explosive Frame Blocks */}
          <div className="absolute top-8 left-4 w-44 h-72 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border-2 border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Texture ridges */}
            <div className="h-full w-full flex flex-col justify-between p-2 opacity-50">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 w-full bg-zinc-950 border-t border-b border-zinc-800 rounded" />
              ))}
            </div>

            {/* Glowing Red LED Timer Display (05:00) */}
            <div className="absolute top-14 left-4 right-4 bg-black/95 border-2 border-red-950 p-2.5 rounded-lg shadow-[inset_0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center">
              <span className="font-mono font-black text-3xl sm:text-4xl text-red-600 tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
                05:00
              </span>
            </div>

            {/* Microcontroller & Wiring Details */}
            <div className="absolute bottom-6 left-4 right-4 h-16 bg-zinc-950 border border-zinc-800 rounded p-1.5 flex gap-1">
              <div className="w-8 h-full bg-emerald-950/70 border border-emerald-600/50 rounded flex items-center justify-center text-[8px] font-mono text-emerald-400">
                PCB
              </div>
              <div className="flex-1 flex flex-col justify-around py-1">
                <div className="h-1 bg-red-600 rounded-full" />
                <div className="h-1 bg-blue-500 rounded-full" />
                <div className="h-1 bg-yellow-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Tangled Wires behind/around bomb */}
          <svg className="absolute -top-6 -left-6 w-64 h-80 pointer-events-none" viewBox="0 0 200 250">
            <path d="M 50 10 C 30 70, 70 120, 40 180" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 70 20 C 110 80, 20 140, 60 210" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 30 40 C 90 90, 80 160, 50 230" stroke="#eab308" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 85 5 C 120 60, 40 110, 80 190" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Background Right: Giant Stencil "DEFUSE" & Hazard Stripes ────────── */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-25 lg:opacity-45 pointer-events-none z-0 hidden md:block overflow-hidden">
        {/* Diagonal Warning Barrier */}
        <div 
          className="w-full h-14 -rotate-12 absolute top-28 right-0 border-y-2 border-yellow-500/50"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.8) 0, rgba(0,0,0,0.8) 16px, rgba(234,179,8,0.7) 16px, rgba(234,179,8,0.7) 32px)'
          }}
        />
        <div 
          className="w-full h-14 -rotate-12 absolute bottom-20 right-0 border-y-2 border-yellow-500/50"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.8) 0, rgba(0,0,0,0.8) 16px, rgba(234,179,8,0.7) 16px, rgba(234,179,8,0.7) 32px)'
          }}
        />
        {/* Giant Watermark Text */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-7xl lg:text-8xl font-black italic tracking-widest text-zinc-700/60 -rotate-12 select-none">
          DEFUSE
        </div>
      </div>

      {/* ── Main Tactical Center Frame (Mecha Beveled Container) ─────────────── */}
      <div className="relative z-10 max-w-xl w-full mx-4">
        
        {/* Outer Glowing Yellow Frame */}
        <div 
          className="relative bg-gradient-to-b from-[#18181f] via-[#121217] to-[#0c0c10] border-2 border-yellow-500 rounded-3xl p-6 sm:p-9 shadow-[0_0_35px_rgba(234,179,8,0.35)] backdrop-blur-xl space-y-6"
          style={{
            clipPath: 'polygon(0% 28px, 28px 0%, calc(100% - 28px) 0%, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0% calc(100% - 28px))'
          }}
        >
          {/* Top Decorative Hazard Chevrons (Top Bevel Corners) */}
          <div 
            className="absolute top-1 left-9 w-20 h-2 pointer-events-none opacity-80"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 4px, #eab308 4px, #eab308 8px)'
            }}
          />
          <div 
            className="absolute top-1 right-9 w-20 h-2 pointer-events-none opacity-80"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 4px, #eab308 4px, #eab308 8px)'
            }}
          />

          {/* Top Badge: [🛡️ CLASSIFIED DEFUSAL PROTOCOL // SEC-LEVEL 5] */}
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase pt-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
            <span>CLASSIFIED DEFUSAL PROTOCOL // SEC-LEVEL 5</span>
          </div>

          {/* Main Title: AI DEFUSAL UNIT */}
          <div className="text-center space-y-1.5">
            <h1 className="text-4xl sm:text-5xl font-black italic tracking-wide uppercase drop-shadow-lg">
              <span className="text-white">AI DEFUSAL </span>
              <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">UNIT</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 tracking-wider">
              <span className="w-6 h-px bg-zinc-600" />
              <span>OPERATION NEURAL DETONATOR 3.0</span>
              <span className="w-6 h-px bg-zinc-600" />
            </div>
          </div>

          {/* Status Bar (Bomb Status: ARMED | Time Limit: 05:00) */}
          <div className="bg-black/80 border border-zinc-800/90 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 fill-red-500/20" />
              <span className="text-zinc-300 font-bold">
                BOMB STATUS: <span className="text-red-500 font-black tracking-wider">ARMED</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="font-bold text-zinc-200">TIME LIMIT: 05:00</span>
            </div>
          </div>

          {/* Action Button: MULAI (START DEFUSAL) */}
          <div className="pt-2">
            <button
              onClick={handleStart}
              className="group relative w-full py-4 sm:py-4.5 px-6 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(234,179,8,0.5)] border-2 border-yellow-200/50 active:scale-[0.98] transition-all overflow-hidden"
            >
              {/* Subtle hazard stripes accent on the right edge */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-24 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 6px, transparent 6px, transparent 12px)'
                }}
              />

              <Play className="w-5 h-5 fill-black text-black transition-transform group-hover:scale-125" />
              <span className="font-black">MULAI (START DEFUSAL)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
