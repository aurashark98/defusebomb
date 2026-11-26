import React, { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Settings, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Activity, 
  Radio, 
  Zap, 
  Crosshair,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
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
  // Interactive 3D tilt tracking for cinematic hero bomb visual
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xRatio = (clientX - left) / width - 0.5;
    const yRatio = (clientY - top) / height - 0.5;
    
    setTilt({
      x: -yRatio * 14, // Subtle vertical pitch
      y: xRatio * 18   // Subtle horizontal yaw
    });

    setMousePos({
      x: ((clientX - left) / width) * 100,
      y: ((clientY - top) / height) * 100
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

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
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#08090A] text-[#F5F5F5] select-none font-sans flex flex-col justify-between"
    >
      {/* ── BACKGROUND TACTICAL AMBIENCE & CINEMATIC LIGHTING ─────────────── */}
      {/* Precision military coordinate grid */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#FFC400 1px, transparent 1px),
            linear-gradient(90deg, #FFC400 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Dynamic Specular Mouse Spotlight */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none blur-[150px] transition-all duration-300 opacity-20"
        style={{
          background: 'radial-gradient(circle, #FFC400 0%, #FF3030 45%, transparent 70%)',
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Static Industrial Ambient Lighting */}
      <div className="absolute -top-32 right-10 w-[550px] h-[550px] bg-[#FFC400]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-[500px] h-[500px] bg-[#FF3030]/10 rounded-full blur-[130px] pointer-events-none" />
      
      {/* CRT Scanline & Vignette */}
      <div className="absolute inset-0 scanline opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient opacity-70 pointer-events-none" />

      {/* ── TOP HEADER: STRENGTHENED BOMBATAG BRANDING & HUD NAV ─────────── */}
      <header className="relative z-30 w-full px-5 py-3.5 sm:px-8 lg:px-12 flex items-center justify-between border-b border-[#34383D]/80 bg-[#08090A]/90 backdrop-blur-md shadow-lg flex-shrink-0">
        
        {/* UPPER-LEFT: STRENGTHENED BOMBATAG BRANDING */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Tactical Logo Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#17191C] border-2 border-[#FFC400] flex items-center justify-center shadow-[0_0_15px_rgba(255,196,0,0.4)] relative overflow-hidden group">
              <Crosshair className="w-4 h-4 text-[#FFC400] animate-pulse" />
              <div 
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #FFC400 0, #FFC400 2px, transparent 2px, transparent 4px)'
                }}
              />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black italic tracking-tight uppercase text-[#F5F5F5] leading-none">
                  BOMBA<span className="text-[#FFC400] drop-shadow-[0_0_10px_rgba(255,196,0,0.6)]">TAG</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-[#FFC400] px-1.5 py-0.2 bg-[#17191C] border border-[#FFC400]/40 rounded">
                  v2.4
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 font-semibold uppercase hidden sm:block">
                TACTICAL DEFUSAL PROTOCOL
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#34383D] hidden md:block" />

          {/* Operational Security Clearance Pill */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#17191C]/80 border border-[#34383D]">
            <div className="w-2 h-2 rounded-full bg-[#FF3030] animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-300">
              CLEARANCE: <span className="text-[#FFC400]">SEC-LEVEL 5</span>
            </span>
          </div>
        </div>

        {/* UPPER-RIGHT NAVIGATION: HOW TO PLAY & SETTINGS */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* How to Play Button */}
          <button
            onClick={handleHowToPlay}
            className="group relative px-3.5 sm:px-4 py-2 rounded-lg bg-[#17191C] hover:bg-[#34383D] border border-[#34383D] hover:border-[#FFC400] transition-all flex items-center gap-2 shadow-sm text-xs font-mono font-bold tracking-wider text-[#F5F5F5] hover:text-[#FFC400] active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FFC400] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">HOW TO PLAY</span>
            <span className="sm:hidden">GUIDE</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={handleSettings}
            className="group relative px-3.5 sm:px-4 py-2 rounded-lg bg-[#17191C] hover:bg-[#34383D] border border-[#34383D] hover:border-[#FFC400] transition-all flex items-center gap-2 shadow-sm text-xs font-mono font-bold tracking-wider text-[#F5F5F5] hover:text-[#FFC400] active:scale-95 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FFC400] group-hover:rotate-90 transition-all" />
            <span className="hidden sm:inline">SETTINGS</span>
            <span className="sm:hidden">SET</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT (2-COLUMN BALANCED RESPONSIVE GRID) ────────────────── */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-center">
        
        {/* ══════════════════════════════════════════════════════════════════════
            LEFT COLUMN: BRAND HERO, TAGLINE, AI IDENTITY & DOMINANT START CTA
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 lg:space-y-6 text-left">
          
          {/* Situation Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#17191C] border border-[#34383D] text-[10px] sm:text-[11px] font-mono text-[#FFC400] w-fit shadow-inner">
            <Radio className="w-3 h-3 text-[#FF3030] animate-pulse" />
            <span className="font-bold tracking-widest uppercase">CRITICAL DEFUSAL MISSION</span>
          </div>

          {/* Prominent BOMBATAG Title Block */}
          <div className="space-y-2">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#17191C] to-[#08090A] border-2 border-[#FFC400] flex items-center justify-center shadow-[0_0_25px_rgba(255,196,0,0.35)] relative overflow-hidden flex-shrink-0">
                <Crosshair className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFC400]" />
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #FFC400 0, #FFC400 3px, transparent 3px, transparent 6px)'
                  }}
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#FFC400] uppercase">
                  AI DEFUSAL UNIT
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black italic tracking-tight uppercase leading-none">
                  <span className="text-[#F5F5F5] drop-shadow-md">BOMBA</span>
                  <span className="text-[#FFC400] drop-shadow-[0_0_25px_rgba(255,196,0,0.65)]">TAG</span>
                </h1>
              </div>
            </div>

            {/* REQUIRED TAGLINE: THINK FAST. DEFUSE SAFE. */}
            <div className="relative pl-3 border-l-4 border-[#FFC400] py-0.5 mt-2">
              <p className="text-sm sm:text-base font-mono font-black tracking-[0.16em] text-[#F5F5F5] uppercase">
                THINK FAST. <span className="text-[#FFC400] drop-shadow-[0_0_10px_rgba(255,196,0,0.5)]">DEFUSE SAFE.</span>
              </p>
            </div>
          </div>

          {/* AI / ML Educational Threat Specification Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#17191C]/95 border border-[#34383D] shadow-xl space-y-2.5 backdrop-blur-md relative overflow-hidden">
            {/* Top metallic hazard edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFC400] via-[#FF3030] to-[#34383D]" />
            
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-[#FFC400] font-bold uppercase">
                <Cpu className="w-3.5 h-3.5 text-[#FFC400]" />
                NEURAL ORDNANCE // 12 MODULES
              </span>
              <span className="text-[9px] font-mono bg-[#08090A] px-2 py-0.5 rounded border border-[#34383D] text-zinc-300 font-semibold">
                AI / ML CURRICULUM
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-300 leading-relaxed">
              Disarm 12 interactive machine learning modules spanning data quality, model evaluation, recruitment bias, and vision augmentation.
            </p>

            {/* Telemetry Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
              <div className="bg-[#08090A] border border-[#34383D] p-2 rounded-lg text-center">
                <div className="text-zinc-500 text-[9px] uppercase font-bold">COUNTDOWN</div>
                <div className="text-[#FFC400] font-black text-xs sm:text-sm">20:00</div>
              </div>
              <div className="bg-[#08090A] border border-[#34383D] p-2 rounded-lg text-center">
                <div className="text-zinc-500 text-[9px] uppercase font-bold">STRIKE LIMIT</div>
                <div className="text-[#FF3030] font-black text-xs sm:text-sm">3 STRIKES</div>
              </div>
              <div className="bg-[#08090A] border border-[#34383D] p-2 rounded-lg text-center">
                <div className="text-zinc-500 text-[9px] uppercase font-bold">ACTIVE SLOTS</div>
                <div className="text-emerald-400 font-black text-xs sm:text-sm">12 CIRCUITS</div>
              </div>
            </div>
          </div>

          {/* ── DOMINANT YELLOW START BUTTON (PRIMARY #FFC400) ────────────────── */}
          <div className="pt-0.5">
            <button
              onClick={handleStart}
              className="group relative w-full py-4 sm:py-4.5 px-6 sm:px-8 rounded-xl bg-[#FFC400] hover:bg-[#ffe066] text-[#08090A] font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-3.5 shadow-[0_0_35px_rgba(255,196,0,0.55),0_10px_20px_rgba(0,0,0,0.5)] border-2 border-[#FFC400] hover:border-white active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
            >
              {/* Corner hazard stripes highlight */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-28 opacity-25 pointer-events-none transition-opacity group-hover:opacity-35"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #08090A 0, #08090A 8px, transparent 8px, transparent 16px)'
                }}
              />

              <div className="w-8 h-8 rounded-lg bg-[#08090A] text-[#FFC400] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner flex-shrink-0">
                <Play className="w-4 h-4 fill-[#FFC400] ml-0.5" />
              </div>

              <div className="flex flex-col text-left">
                <span className="leading-none text-base sm:text-lg font-black tracking-wide">
                  START MISSION
                </span>
                <span className="text-[10px] font-mono tracking-widest font-bold opacity-80 mt-0.5">
                  [ INITIATE DEFUSAL PROTOCOL ]
                </span>
              </div>
            </button>
          </div>

          {/* Sub-footer telemetry info */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5 border-t border-[#34383D]/50">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#FFC400]" />
              SECTOR 04 // 3D HOSTAGE ROOM READY
            </span>
            <span className="text-zinc-400">FLASHLIGHT [1] • CLUE [2]</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            RIGHT COLUMN: REFINED CINEMATIC HERO BOMB SUITCASE (DEPTH & DETAIL)
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex items-center justify-center relative perspective-[1200px] py-2">
          
          {/* Volumetric Radial Glow Backdrop */}
          <div className="absolute w-72 sm:w-96 lg:w-[460px] h-72 sm:h-96 lg:h-[460px] rounded-full bg-[#FFC400]/15 blur-3xl pointer-events-none animate-pulse" />
          
          {/* Dynamic 3D Parallax Bomb Case Container */}
          <div 
            className="relative w-full max-w-[540px] xl:max-w-[580px] aspect-[4/3] transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Top Military Carry Handle with Steel Bracket Pins */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-[#34383D] via-[#17191C] to-[#08090A] border-2 border-[#34383D] rounded-t-xl shadow-2xl flex items-center justify-center z-10">
              <div className="w-36 h-3 bg-[#08090A] rounded-full border border-[#34383D]/90 shadow-inner" />
              {/* Left/Right Steel Pivot Brackets */}
              <div className="absolute -left-2.5 top-1.5 w-3.5 h-5 bg-[#34383D] border border-zinc-600 rounded flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#17191C]" />
              </div>
              <div className="absolute -right-2.5 top-1.5 w-3.5 h-5 bg-[#34383D] border border-zinc-600 rounded flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#17191C]" />
              </div>
            </div>

            {/* Heavy Armored Suitcase Body with Multi-layered Depth */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#22252a] via-[#121417] to-[#08090A] border-4 border-[#34383D] rounded-3xl p-4 sm:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(255,196,0,0.22)] overflow-hidden flex flex-col justify-between">
              
              {/* Metallic Top Bevel Specular Sheen */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {/* Heavy Corner Reinforcements with Hex Bolts and Yellow Accents */}
              {/* Top-Left */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#FFC400] rounded-tl-2xl pointer-events-none">
                <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#34383D] border border-zinc-500 shadow-sm" />
              </div>
              {/* Top-Right */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#FFC400] rounded-tr-2xl pointer-events-none">
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#34383D] border border-zinc-500 shadow-sm" />
              </div>
              {/* Bottom-Left */}
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#FFC400] rounded-bl-2xl pointer-events-none">
                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#34383D] border border-zinc-500 shadow-sm" />
              </div>
              {/* Bottom-Right */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#FFC400] rounded-br-2xl pointer-events-none">
                <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#34383D] border border-zinc-500 shadow-sm" />
              </div>

              {/* Ruggedized Outer Ribs Texture */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none flex justify-between px-7 py-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2.5 h-full bg-white rounded-full" />
                ))}
              </div>

              {/* ── TOP SECTION: DUAL-SIDED MASTER TIMER & STRIKE HUD ─────── */}
              <div className="relative z-10 bg-[#08090A]/95 border-2 border-[#34383D] rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between">
                
                {/* Master Digital Timer Display with Bezel & Glow */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#17191C] border border-[#34383D] flex items-center justify-center text-[#FFC400] shadow-inner">
                    <Clock className="w-5 h-5 text-[#FFC400] animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-400 font-bold uppercase flex items-center gap-1.5">
                      <span>MASTER DETONATION CLOCK</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3030] animate-ping" />
                    </div>
                    {/* Glowing Danger Red 20:00 Digital Segment Display */}
                    <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#FF3030] drop-shadow-[0_0_18px_rgba(255,48,48,0.85)] leading-tight">
                      20:00
                    </div>
                  </div>
                </div>

                {/* Strike Indicators */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[#FF3030]" />
                    STRIKES (0/3)
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#17191C] border-2 border-[#34383D] shadow-inner flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#08090A]" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#17191C] border-2 border-[#34383D] shadow-inner flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#08090A]" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#17191C] border-2 border-[#34383D] shadow-inner flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#08090A]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CENTER SECTION: REFINED 6-BAY FRONT MODULE MATRIX ─────── */}
              <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 my-2 sm:my-3">
                
                {/* Bay 1: Medical Eye Vision Sensor */}
                <div className="bg-gradient-to-b from-[#1a1d22] to-[#121417] border border-[#34383D] hover:border-[#FFC400] transition-colors rounded-xl p-2 sm:p-2.5 flex flex-col justify-between h-18 sm:h-20 shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#FFC400] font-bold">MOD-01</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-200 font-bold leading-tight">
                    EYE VISION SENSOR
                  </div>
                  <div className="h-1 w-full bg-[#08090A] rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#FFC400]" />
                  </div>
                </div>

                {/* Bay 2: Recruitment Bias Wires */}
                <div className="bg-gradient-to-b from-[#1a1d22] to-[#121417] border border-[#34383D] hover:border-[#FFC400] transition-colors rounded-xl p-2 sm:p-2.5 flex flex-col justify-between h-18 sm:h-20 shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#FFC400] font-bold">MOD-02</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3030] shadow-[0_0_6px_#ff3030] animate-pulse" />
                  </div>
                  {/* Wires simulation */}
                  <div className="flex items-center gap-1 py-0.5">
                    <div className="h-3.5 flex-1 bg-[#FF3030] rounded-sm shadow-sm" />
                    <div className="h-3.5 flex-1 bg-blue-500 rounded-sm shadow-sm" />
                    <div className="h-3.5 flex-1 bg-[#FFC400] rounded-sm shadow-sm" />
                    <div className="h-3.5 flex-1 bg-emerald-500 rounded-sm shadow-sm" />
                  </div>
                  <div className="text-[9px] font-mono text-zinc-400 truncate">
                    WIRE CUT // BIAS
                  </div>
                </div>

                {/* Bay 3: Pattern vs Human */}
                <div className="bg-gradient-to-b from-[#1a1d22] to-[#121417] border border-[#34383D] hover:border-[#FFC400] transition-colors rounded-xl p-2 sm:p-2.5 flex flex-col justify-between h-18 sm:h-20 shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#FFC400] font-bold">MOD-03</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] shadow-[0_0_6px_#ffc400]" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-200 font-bold leading-tight">
                    PATTERN RECOG
                  </div>
                  <div className="text-[8px] font-mono text-zinc-400">
                    A B C D PROTOCOL
                  </div>
                </div>

                {/* Bay 4: Model Evaluation Testing Phase */}
                <div className="bg-gradient-to-b from-[#1a1d22] to-[#121417] border border-[#34383D] hover:border-[#FFC400] transition-colors rounded-xl p-2 sm:p-2.5 flex flex-col justify-between h-18 sm:h-20 shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#FFC400] font-bold">MOD-04</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-200 font-bold leading-tight">
                    TESTING PHASE
                  </div>
                  <div className="h-1 w-full bg-[#08090A] rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-cyan-400" />
                  </div>
                </div>

                {/* Bay 5: Cat Dataset Diversification */}
                <div className="bg-gradient-to-b from-[#1a1d22] to-[#121417] border border-[#34383D] hover:border-[#FFC400] transition-colors rounded-xl p-2 sm:p-2.5 flex flex-col justify-between h-18 sm:h-20 shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#FFC400] font-bold">MOD-05</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-200 font-bold leading-tight">
                    DIVERSIFY DATA
                  </div>
                  <div className="text-[8px] font-mono text-zinc-400">
                    4-COLOR WIRES
                  </div>
                </div>

                {/* Bay 6: Deep Blue vs AlphaGo */}
                <div className="bg-gradient-to-b from-[#1a1d22] to-[#121417] border border-[#34383D] hover:border-[#FFC400] transition-colors rounded-xl p-2 sm:p-2.5 flex flex-col justify-between h-18 sm:h-20 shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#FFC400] font-bold">MOD-06</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-200 font-bold leading-tight">
                    AI COMPLEXITY
                  </div>
                  <div className="text-[8px] font-mono text-zinc-400">
                    DEEP BLUE / GO
                  </div>
                </div>
              </div>

              {/* ── BOTTOM SECTION: PCB HARDWARE METRICS & DUAL-SIDED BADGE ─ */}
              <div className="relative z-10 pt-2 flex items-center justify-between border-t border-[#34383D] text-[9px] sm:text-[10px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#FFC400]/20 border border-[#FFC400] flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#FFC400] rounded-full animate-ping" />
                  </div>
                  <span className="text-zinc-300 font-bold tracking-wider">
                    REVERSE SIDE: 6 ADDITIONAL MODULES ARMED
                  </span>
                </div>
                <span className="text-[#FFC400] font-bold tracking-widest bg-[#08090A] px-2 py-0.5 rounded border border-[#34383D]">
                  SN: AI-8409-X
                </span>
              </div>
            </div>

            {/* Industrial Heavy Toggle Latches on Left and Right sides */}
            <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-16 bg-[#FFC400] border-2 border-[#08090A] rounded-l-md shadow-xl flex flex-col justify-between py-1 items-center">
              <div className="w-2.5 h-1 bg-black/60 rounded" />
              <div className="w-2.5 h-1 bg-black/60 rounded" />
            </div>
            <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-16 bg-[#FFC400] border-2 border-[#08090A] rounded-r-md shadow-xl flex flex-col justify-between py-1 items-center">
              <div className="w-2.5 h-1 bg-black/60 rounded" />
              <div className="w-2.5 h-1 bg-black/60 rounded" />
            </div>
          </div>
        </div>

      </main>

      {/* ── BOTTOM STATUS BAR FOOTER ───────────────────────────────────────── */}
      <footer className="relative z-30 w-full px-5 py-2.5 sm:px-8 lg:px-12 border-t border-[#34383D]/80 bg-[#08090A]/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start">
          <span className="text-zinc-500">ENVIRONMENT:</span>
          <span className="text-[#F5F5F5] font-bold">HOSTAGE ROOM // 3D FIRST-PERSON</span>
          <span className="text-[#34383D] hidden sm:inline">|</span>
          <span className="text-zinc-500">CONTROLS:</span>
          <span className="text-[#FFC400]">WASD • SENTER [1] • CLUE [2]</span>
        </div>

        <div className="text-zinc-500 text-[9px] sm:text-[10px]">
          BOMBATAG &copy; 2026 // ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
};
