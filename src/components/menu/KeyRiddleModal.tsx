import React, { useState } from 'react';
import { Key, HelpCircle, Check, AlertTriangle, X, Zap } from 'lucide-react';
import { sound } from '../../utils/audio';

interface KeyRiddleModalProps {
  onSuccess: () => void;
  onWrong: () => void;
  onClose: () => void;
}

export const KeyRiddleModal: React.FC<KeyRiddleModalProps> = ({
  onSuccess,
  onWrong,
  onClose,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const options = [
    { val: 850, label: '850 Watt', isCorrect: false },
    { val: 900, label: '900 Watt', isCorrect: false },
    { val: 950, label: '950 Watt', isCorrect: true },
    { val: 1050, label: '1.050 Watt', isCorrect: false },
  ];

  const handleSelect = (opt: typeof options[0]) => {
    setSelectedAnswer(opt.val);
    sound.playKeypadClick();

    if (opt.isCorrect) {
      sound.playVictory();
      setFeedback({
        message: 'JAWABAN BENAR! (950 Watt) Total alokasi daya listrik cadangan untuk gabungan 1 Server Utama, 1 Switch Inti, dan 1 Sistem Pendingin (x + y + z) adalah tepat 950 Watt.',
        isCorrect: true
      });
      setTimeout(() => {
        onSuccess();
      }, 1400);
    } else {
      sound.playPenaltyBuzzer();
      setFeedback({
        message: `SALAH! (${opt.label}) bukan total daya yang tepat. Waktu bom terpotong penalti -45 detik!`,
        isCorrect: false
      });
      onWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-yellow-500 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Danger Ribbon */}
        <div className="h-1.5 w-full hazard-stripes absolute top-0 left-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                SISTEM LOGIKA ENERGI RUANG SERVER
              </div>
              <h2 className="text-base font-black text-white uppercase">
                PECAHKAN SOAL DAYA UNTUK AMBIL KUNCI
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Math Riddle Story */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono leading-relaxed space-y-2.5 max-h-[45vh] overflow-y-auto">
          <p className="text-zinc-300">
            Seorang insinyur jaringan sedang mengatur alokasi daya listrik (dalam satuan <strong>Watt</strong>) untuk tiga unit perangkat keras utama di ruang server: <strong>Server Utama (<span className="text-cyan-400">x</span>)</strong>, <strong>Switch Inti (<span className="text-emerald-400">y</span>)</strong>, dan <strong>Sistem Pendingin (<span className="text-yellow-400">z</span>)</strong>.
          </p>

          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 space-y-1.5 text-[11px] text-zinc-300">
            <div className="font-bold text-yellow-400 uppercase text-[10px] tracking-wider">
              LOG PEMANTAUAN TIGA KONDISI OPERASIONAL:
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-yellow-400 font-bold">1.</span>
              <span>2 unit Server Utama + 3 unit Switch Inti + 1 unit Sistem Pendingin = <strong className="text-white">1.850 Watt</strong>.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-yellow-400 font-bold">2.</span>
              <span>Pada mode hemat daya: beban 1 unit Server Utama + 2 unit Sistem Pendingin setara dengan <strong className="text-white">4 unit Switch Inti + 350 Watt</strong>.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-yellow-400 font-bold">3.</span>
              <span>Uji beban puncak: selisih beban 3 unit Server Utama terhadap gabungan 2 unit Switch Inti dan 1 unit Sistem Pendingin adalah <strong className="text-white">550 Watt</strong>.</span>
            </div>
          </div>

          <div className="pt-1 text-yellow-400 font-bold text-xs">
            👉 Berapakah total beban daya listrik yang dibutuhkan untuk menyalakan 1 Server Utama, 1 Switch Inti, dan 1 Sistem Pendingin secara bersamaan (<span className="text-cyan-400">x</span> + <span className="text-emerald-400">y</span> + <span className="text-yellow-400">z</span>)?
          </div>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-2 gap-2.5 font-mono">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.val;
            return (
              <button
                key={opt.val}
                onClick={() => handleSelect(opt)}
                className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-lg'
                      : 'bg-red-950 border-red-400 text-red-200 shadow-lg'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-white hover:border-yellow-500'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  opt.isCorrect ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Real-time Feedback */}
        {feedback && (
          <div
            className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-red-950/60 border-red-500 text-red-200'
            }`}
          >
            {feedback.isCorrect ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <strong>{feedback.isCorrect ? 'KUNCI EMAS DIDAPATKAN!' : 'JAWABAN SALAH!'}</strong> {feedback.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
