import React, { useState, useEffect, useRef } from 'react';
import { getFreshModules, DEFAULT_SETTINGS } from './data/modules';
import { DefusalModule } from './types/game';
import { AppSettings, DEFAULT_APP_SETTINGS } from './types/settings';
import { sound } from './utils/audio';
import { DigitalTimer } from './components/DigitalTimer';
import { ModuleListNav } from './components/ModuleListNav';
import { WireCutModule } from './components/modules/WireCutModule';
import { TerminalFixModule } from './components/modules/TerminalFixModule';
import { ConfusionMatrixKeypadModule } from './components/modules/ConfusionMatrixKeypadModule';
import { PipelineSequenceModule } from './components/modules/PipelineSequenceModule';
import { TuningDialModule } from './components/modules/TuningDialModule';
import { TacticalChoiceModule } from './components/modules/TacticalChoiceModule';
import { BombScene } from './components/3d/BombScene';
import { DefusedModal } from './components/DefusedModal';
import { ExplosionModal } from './components/ExplosionModal';
import { MainMenu } from './components/menu/MainMenu';
import { SettingsModal } from './components/menu/SettingsModal';
import { HowToPlayModal } from './components/menu/HowToPlayModal';
import { ClueModal } from './components/menu/ClueModal';
import { Shield, Box, Layers, AlertTriangle, Settings, BookOpen, Home, Key, FileText } from 'lucide-react';

export const App: React.FC = () => {
  // Game & View States
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'defused' | 'detonated'>('menu');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isClueModalOpen, setIsClueModalOpen] = useState<boolean>(false);

  // Session Key: increments on every restart/retry to guarantee full component tree re-mounting
  const [sessionKey, setSessionKey] = useState<number>(1);

  // Exploration & Secrets State
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);

  // Settings State (Persisted in localStorage)
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ai_bomb_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_APP_SETTINGS;
  });

  const [modules, setModules] = useState<DefusalModule[]>(() => getFreshModules());
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SETTINGS.totalTimeSeconds); // 600s (10 mins)
  const [strikes, setStrikes] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [penaltyNotification, setPenaltyNotification] = useState<string | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [detonationReason, setDetonationReason] = useState<'timeout' | 'max_strikes'>('timeout');

  const timerRef = useRef<number | null>(null);

  // Apply initial volume
  useEffect(() => {
    sound.setVolume(settings.volume);
  }, []);

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem('ai_bomb_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Main countdown timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setDetonationReason('timeout');
            setGameState('detonated');
            return 0;
          }
          const next = prev - 1;
          sound.playTick(next < 60);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle wrong answer / strike
  const handleStrike = (_explanation: string) => {
    sound.playPenaltyBuzzer();
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);

    // Screen shake animation
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);

    // Floating Penalty notification
    const penaltyAmount = DEFAULT_SETTINGS.penaltyPerStrikeSeconds;
    setPenaltyNotification(`-${penaltyAmount}s PENALTY!`);
    setTimeout(() => setPenaltyNotification(null), 2500);

    // Subtract time
    setTimeLeft(prev => {
      const updated = Math.max(0, prev - penaltyAmount);
      if (updated === 0 || newStrikes >= DEFAULT_SETTINGS.maxStrikes) {
        setDetonationReason(newStrikes >= DEFAULT_SETTINGS.maxStrikes ? 'max_strikes' : 'timeout');
        setGameState('detonated');
        return 0;
      }
      return updated;
    });

    if (newStrikes >= DEFAULT_SETTINGS.maxStrikes) {
      setDetonationReason('max_strikes');
      setGameState('detonated');
    }
  };

  // Handle module solve
  const handleSolveModule = (index: number) => {
    sound.playModuleDefused();

    const updatedModules = [...modules];
    updatedModules[index] = {
      ...updatedModules[index],
      isDefused: true
    };
    setModules(updatedModules);

    // Check if all modules are defused!
    const allDefused = updatedModules.every(m => m.isDefused);
    if (allDefused) {
      setGameState('defused');
      return;
    }

    // Advance to next unsolved
    const nextUnsolvedIndex = updatedModules.findIndex((m, idx) => idx > index && !m.isDefused);
    if (nextUnsolvedIndex !== -1) {
      setCurrentModuleIndex(nextUnsolvedIndex);
    } else {
      const firstUnsolved = updatedModules.findIndex(m => !m.isDefused);
      if (firstUnsolved !== -1) setCurrentModuleIndex(firstUnsolved);
    }
  };

  // Pick up secret key in room
  const handlePickUpKey = () => {
    sound.playVictory();
    setHasKey(true);
    setPenaltyNotification('KUNCI PETI DIAMBIL!');
    setTimeout(() => setPenaltyNotification(null), 3000);
  };

  // Open secret chest with key
  const handleOpenChest = () => {
    sound.playVictory();
    setIsChestOpen(true);
    setIsClueModalOpen(true);
  };

  // Start / Restart game (Completely pristine reset!)
  const handleStartGame = () => {
    setGameState('playing');
    setTimeLeft(DEFAULT_SETTINGS.totalTimeSeconds); // 600 seconds
    setStrikes(0);
    setPenaltyNotification(null);
    setCurrentModuleIndex(0);
    setHasKey(false);
    setIsChestOpen(false);
    setIsClueModalOpen(false);
    // Deep clone fresh modules
    setModules(getFreshModules());
    // Remount whole 3D/2D game components fresh
    setSessionKey(prev => prev + 1);
  };

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  const currentMod = modules[currentModuleIndex];
  const defusedCount = modules.filter(m => m.isDefused).length;

  return (
    <div className={`w-full h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden select-none transition-all ${screenShake ? 'animate-shake' : ''
      }`}>
      {/* If in Menu, render Main Menu Screen */}
      {gameState === 'menu' ? (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        /* If in Game / Playing */
        <>
          {/* Top Header */}
          <header className="h-14 border-b-2 border-zinc-800 bg-zinc-900/90 px-4 sm:px-8 shadow-md flex-shrink-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGameState('menu')}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-zinc-700 flex items-center gap-1.5 text-xs font-mono font-bold transition"
                  title="Kembali ke Menu Utama"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">MENU</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h1 className="text-xs sm:text-sm font-black tracking-wide text-zinc-100">
                      AI DEFUSAL UNIT // 10 MIN OPERATION
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isChestOpen && (
                  <button
                    onClick={() => setIsClueModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg border border-emerald-500 bg-emerald-950/80 hover:bg-emerald-900 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition glow-green"
                    title="Buka Catatan Intelijen Peti"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">CATATAN PETI</span>
                  </button>
                )}

                <button
                  onClick={() => setIsHowToPlayOpen(true)}
                  className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition"
                  title="Cara Bermain"
                >
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition"
                  title="Pengaturan"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={() => setViewMode(prev => prev === '3d' ? '2d' : '3d')}
                  className="px-3 py-1.5 rounded-lg border border-yellow-500/60 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-yellow-400 flex items-center gap-1.5 transition shadow"
                >
                  {viewMode === '3d' ? (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span>MODE 2D</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-3.5 h-3.5" />
                      <span>MODE 3D</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Container */}
          <main className="flex-1 w-full h-[calc(100vh-56px)] overflow-hidden relative">
            {viewMode === '3d' ? (
              /* ================= 3D VIEW (Hostage Room with WASD Walking & Chest Secrets) ================= */
              <BombScene
                key={sessionKey}
                modules={modules}
                currentModuleIndex={currentModuleIndex}
                onSelectModule={(idx) => setCurrentModuleIndex(idx)}
                timeLeft={timeLeft}
                strikes={strikes}
                maxStrikes={DEFAULT_SETTINGS.maxStrikes}
                settings={settings}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onRestart={handleStartGame}
                onSolveModule={handleSolveModule}
                onStrike={handleStrike}
                onSwitchTo2D={() => setViewMode('2d')}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
                onGoToMenu={() => setGameState('menu')}
                hasKey={hasKey}
                isChestOpen={isChestOpen}
                onPickUpKey={handlePickUpKey}
                onOpenChest={handleOpenChest}
                onOpenClueBook={() => setIsClueModalOpen(true)}
                penaltyNotification={penaltyNotification}
              />
            ) : (
              /* ================= 2D TACTICAL CONSOLE VIEW ================= */
              <div key={sessionKey} className="h-full overflow-y-auto max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-4">
                <DigitalTimer
                  timeLeft={timeLeft}
                  strikes={strikes}
                  maxStrikes={DEFAULT_SETTINGS.maxStrikes}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  onRestart={handleStartGame}
                  penaltyNotification={penaltyNotification}
                />

                <ModuleListNav
                  modules={modules}
                  currentModuleIndex={currentModuleIndex}
                  onSelectModule={(idx) => setCurrentModuleIndex(idx)}
                />

                {currentMod && (
                  <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 border border-yellow-500/30 uppercase tracking-widest">
                            {currentMod.category}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            ID: {currentMod.id.toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                          {currentMod.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentMod.isDefused ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1.5 glow-green">
                            DEFUSED
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-950/80 border border-red-500 text-red-300 flex items-center gap-1.5 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            ACTIVE DETONATOR
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-zinc-950/70 p-3.5 rounded-lg border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 mb-5 leading-relaxed">
                      {currentMod.description}
                    </div>

                    {currentMod.type === 'cut-wire' && currentMod.wires && (
                      <WireCutModule
                        wires={currentMod.wires}
                        isDefused={currentMod.isDefused}
                        onSolve={() => handleSolveModule(currentModuleIndex)}
                        onStrike={handleStrike}
                      />
                    )}

                    {currentMod.type === 'terminal-fix' && currentMod.terminalData && (
                      <TerminalFixModule
                        context={currentMod.terminalData.context}
                        brokenCode={currentMod.terminalData.brokenCode}
                        options={currentMod.terminalData.options}
                        isDefused={currentMod.isDefused}
                        onSolve={() => handleSolveModule(currentModuleIndex)}
                        onStrike={handleStrike}
                      />
                    )}

                    {currentMod.type === 'confusion-matrix' && currentMod.matrixData && (
                      <ConfusionMatrixKeypadModule
                        matrixData={currentMod.matrixData}
                        isDefused={currentMod.isDefused}
                        onSolve={() => handleSolveModule(currentModuleIndex)}
                        onStrike={handleStrike}
                      />
                    )}

                    {currentMod.type === 'pipeline-sequence' && currentMod.pipelineSteps && (
                      <PipelineSequenceModule
                        initialSteps={currentMod.pipelineSteps}
                        isDefused={currentMod.isDefused}
                        onSolve={() => handleSolveModule(currentModuleIndex)}
                        onStrike={handleStrike}
                      />
                    )}

                    {currentMod.type === 'tuning-dial' && currentMod.dialData && (
                      <TuningDialModule
                        dialData={currentMod.dialData}
                        isDefused={currentMod.isDefused}
                        onSolve={() => handleSolveModule(currentModuleIndex)}
                        onStrike={handleStrike}
                      />
                    )}

                    {currentMod.type === 'tactical-choice' && currentMod.tacticalOptions && (
                      <TacticalChoiceModule
                        options={currentMod.tacticalOptions}
                        isDefused={currentMod.isDefused}
                        onSolve={() => handleSolveModule(currentModuleIndex)}
                        onStrike={handleStrike}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </>
      )}

      {/* Global Modals */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isHowToPlayOpen && (
        <HowToPlayModal
          onClose={() => setIsHowToPlayOpen(false)}
        />
      )}

      {isClueModalOpen && (
        <ClueModal
          onClose={() => setIsClueModalOpen(false)}
        />
      )}

      {gameState === 'defused' && (
        <DefusedModal
          remainingTime={timeLeft}
          strikes={strikes}
          maxStrikes={DEFAULT_SETTINGS.maxStrikes}
          totalModules={modules.length}
          onRestart={handleStartGame}
        />
      )}

      {gameState === 'detonated' && (
        <ExplosionModal
          reason={detonationReason}
          defusedCount={defusedCount}
          totalModules={modules.length}
          onRestart={handleStartGame}
        />
      )}
    </div>
  );
};

export default App;
