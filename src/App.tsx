import React, { useState, useEffect, useRef } from 'react';
import { getFreshModules, DEFAULT_SETTINGS } from './data/modules';
import { DefusalModule } from './types/game';
import { AppSettings, DEFAULT_APP_SETTINGS } from './types/settings';
import { sound } from './utils/audio';
import { BombScene } from './components/3d/BombScene';
import { DefusedModal } from './components/DefusedModal';
import { ExplosionModal } from './components/ExplosionModal';
import { MainMenu } from './components/menu/MainMenu';
import { SettingsModal } from './components/menu/SettingsModal';
import { HowToPlayModal } from './components/menu/HowToPlayModal';
import { ClueModal } from './components/menu/ClueModal';
import { Shield, Settings, BookOpen, Home, FileText } from 'lucide-react';

export const App: React.FC = () => {
  // Game & View States
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'defused' | 'detonated'>('menu');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isClueModalOpen, setIsClueModalOpen] = useState<boolean>(false);

  // Session Key: increments on every restart/retry to guarantee full component tree re-mounting
  const [sessionKey, setSessionKey] = useState<number>(1);

  // Exploration & Secrets State
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
  const [hasFlashlight, setHasFlashlight] = useState<boolean>(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);
  const [hasHintPaper, setHasHintPaper] = useState<boolean>(false);

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
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SETTINGS.totalTimeSeconds); // 600s (20 mins)
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

  // Pick up hint paper from chest
  const handlePickUpHintPaper = () => {
    setHasHintPaper(true);
    setPenaltyNotification('KERTAS HINT DIAMBIL! Tekan [H] untuk baca.');
    setTimeout(() => setPenaltyNotification(null), 3000);
  };

  // Pick up flashlight near bomb
  const handlePickUpFlashlight = () => {
    setHasFlashlight(true);
    setPenaltyNotification('SENTER DIAMBIL! Tekan [F] untuk nyalakan/matikan.');
    setTimeout(() => setPenaltyNotification(null), 3000);
  };

  // Open secret chest with key
  const handleOpenChest = () => {
    sound.playVictory();
    setIsChestOpen(true);
  };

  // Start / Restart game (Completely pristine reset!)
  const handleStartGame = () => {
    setGameState('playing');
    setTimeLeft(DEFAULT_SETTINGS.totalTimeSeconds); // 1200 seconds
    setStrikes(0);
    setPenaltyNotification(null);
    setCurrentModuleIndex(0);
    setHasKey(false);
    setIsChestOpen(false);
    setIsClueModalOpen(false);
    setHasFlashlight(false);
    setIsFlashlightOn(false);
    setHasHintPaper(false);
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
                      AI DEFUSAL UNIT // 20 MIN OPERATION
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


              </div>
            </div>
          </header>

          {/* Main Container */}
          <main className="flex-1 w-full h-[calc(100vh-56px)] overflow-hidden relative">
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
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
              onGoToMenu={() => setGameState('menu')}
              hasKey={hasKey}
              isChestOpen={isChestOpen}
              onPickUpKey={handlePickUpKey}
              onOpenChest={handleOpenChest}
              onOpenClueBook={() => setIsClueModalOpen(true)}
              hasFlashlight={hasFlashlight}
              isFlashlightOn={isFlashlightOn}
              onToggleFlashlight={() => setIsFlashlightOn(prev => !prev)}
              onPickUpFlashlight={handlePickUpFlashlight}
              hasHintPaper={hasHintPaper}
              onPickUpHintPaper={handlePickUpHintPaper}
              onOpenHintPaper={() => setIsClueModalOpen(true)}
              penaltyNotification={penaltyNotification}
            />
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
