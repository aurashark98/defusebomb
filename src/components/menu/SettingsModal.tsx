import React from 'react';
import { Volume2, Monitor, Gauge, X, Check, Sliders, Sparkles } from 'lucide-react';
import { AppSettings, GraphicsQuality, TargetFps } from '../../types/settings';
import { sound } from '../../utils/audio';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onUpdateSettings({ volume: val });
    sound.setVolume(val);
    sound.playTestBeep();
  };

  const handleGraphicsChange = (q: GraphicsQuality) => {
    sound.playKeypadClick();
    onUpdateSettings({ graphicsQuality: q });
  };

  const handleFpsChange = (fps: TargetFps) => {
    sound.playKeypadClick();
    onUpdateSettings({ targetFps: fps });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-yellow-500/80 rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Top ribbon */}
        <div className="h-1.5 w-full hazard-stripes absolute top-0 left-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-black tracking-wider text-white uppercase">
              PENGATURAN SISTEM // SETTINGS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Volume Settings */}
        <div className="space-y-2 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase">
              <Volume2 className="w-4 h-4 text-yellow-400" />
              VOLUME SUARA
            </span>
            <span className="font-digital text-2xl text-yellow-400">{settings.volume}%</span>
          </div>
          
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.volume}
            onChange={handleVolumeChange}
            className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>MUTE (0%)</span>
            <span>STANDAR (80%)</span>
            <span>MAKSIMAL (100%)</span>
          </div>
        </div>

        {/* 2. Graphics Quality */}
        <div className="space-y-2.5 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase">
              <Monitor className="w-4 h-4 text-cyan-400" />
              KUALITAS GRAFIK 3D
            </span>
            <span className="text-[10px] text-zinc-500 font-mono uppercase">
              PRESET: {settings.graphicsQuality}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => {
              const isSelected = settings.graphicsQuality === q;
              return (
                <button
                  key={q}
                  onClick={() => handleGraphicsChange(q)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="uppercase">{q}</span>
                  <span className="text-[9px] font-normal text-zinc-500">
                    {q === 'low' ? 'Hemat Daya' : q === 'medium' ? 'Seimbang' : 'Ultra HD'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Target FPS Cap */}
        <div className="space-y-2.5 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase">
              <Gauge className="w-4 h-4 text-emerald-400" />
              TARGET FRAME RATE (FPS)
            </span>
            <span className="text-[10px] text-zinc-500 font-mono uppercase">
              LIMIT: {settings.targetFps} FPS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {([30, 60, 120] as TargetFps[]).map((fps) => {
              const isSelected = settings.targetFps === fps;
              return (
                <button
                  key={fps}
                  onClick={() => handleFpsChange(fps)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{fps} FPS</span>
                  <span className="text-[9px] font-normal text-zinc-500">
                    {fps === 30 ? 'Efisien' : fps === 60 ? 'Standar' : 'Smooth 120Hz'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save & Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
        >
          <Check className="w-4 h-4" />
          SIMPAN & KEMBALI
        </button>
      </div>
    </div>
  );
};
