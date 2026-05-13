import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Brain, Target, TrendingUp, Sparkles } from 'lucide-react';
import { historyPhases } from '../../data/historyContent';

export default function AIAnalysis() {
  const { streak, points, zpdLevel, moduleProgress } = useStore();

  const analysis = useMemo(() => {
    // Calculate total chapters completed
    let completedChapters = 0;
    let totalChapters = 0;
    
    historyPhases.forEach(phase => {
      phase.chapters.forEach(chap => {
        totalChapters++;
        if (moduleProgress[chap.id]?.isCompleted) completedChapters++;
      });
    });

    const completionRate = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    
    // Generate AI Feedback based on ZPD Level and Streak
    let feedback;
    let focus;
    let accuracyText;
    let accuracyColor;

    if (zpdLevel === 1) {
      if (streak === 0 && points > 0) {
        feedback = "Sepertinya kamu mengalami sedikit kesulitan di soal LOTS (Dasar). Jangan khawatir! AI menyarankan kamu untuk membaca ulang materi secara perlahan sebelum kembali mengerjakan evaluasi.";
        focus = "Penguatan Konsep Dasar";
      } else {
        feedback = "Kamu berada di jalur yang benar! Kuasai pondasi materi LOTS (Low Order Thinking Skills) ini. Tingkatkan streak-mu hingga 5 untuk membuka tantangan menengah.";
        focus = "Membangun Konsistensi";
      }
      accuracyText = "Berkembang";
      accuracyColor = "text-orange-500";
    } else if (zpdLevel === 2) {
      feedback = "Luar biasa! Kamu sudah masuk ke tahap MOTS (Menengah). AI melihat kemampuan analisis logismu semakin tajam. Teruskan momentum ini!";
      focus = "Analisis Logis (MOTS)";
      accuracyText = "Menengah";
      accuracyColor = "text-blue-500";
    } else {
      feedback = "Level Tertinggi Tercapai! 🔥 Kamu sudah di tahap HOTS (Sulit). AI sangat kagum dengan dedikasimu. Tantanganmu sekarang adalah mempertahankan best streak ini!";
      focus = "Pemikiran Kritis (HOTS)";
      accuracyText = "Tinggi / Master";
      accuracyColor = "text-purple-500";
    }

    if (completedChapters === 0) {
      feedback = "Selamat datang di Gen Zitoria! AI belum memiliki cukup data performa evaluasimu. Mulailah membaca materi bab pertama dan kerjakan evaluasinya untuk mendapatkan analisis pertamamu.";
      focus = "Mulai Perjalanan";
      accuracyText = "-";
      accuracyColor = "text-slate-500";
    }

    return {
      feedback,
      focus,
      completedChapters,
      totalChapters,
      completionRate: Math.round(completionRate),
      accuracyText,
      accuracyColor
    };
  }, [streak, points, zpdLevel, moduleProgress]);

  return (
    <div className="glass-panel p-6 md:p-8 relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20 transition-all duration-700 group-hover:bg-primary/20"></div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Left: AI Avatar / Icon */}
        <div className="flex flex-col items-center gap-4 shrink-0 md:w-1/4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 transition-transform group-hover:rotate-6">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-surface border border-glass-border rounded-full p-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              AI Insight
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              Mentor Personalmu
            </span>
          </div>
        </div>

        {/* Center: Feedback Text */}
        <div className="flex-1 border-l-0 md:border-l border-glass-border md:pl-8">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-on-background">Analisis Performa Terkini</h4>
          </div>
          <p className="text-on-surface opacity-80 leading-relaxed italic mb-6">
            "{analysis.feedback}"
          </p>
          
          <div className="bg-surface/50 rounded-xl p-4 border border-glass-border inline-flex items-center gap-3 shadow-sm">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <span className="text-xs font-bold uppercase opacity-60 block">Fokus Selanjutnya</span>
              <span className="font-bold text-sm text-on-surface">{analysis.focus}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div className="grid grid-cols-2 gap-4 shrink-0 md:w-1/3">
          <div className="bg-surface/50 p-4 rounded-xl border border-glass-border shadow-sm">
            <span className="text-xs font-bold uppercase opacity-60 block mb-1">Level Saat Ini</span>
            <div className={`font-black text-xl ${analysis.accuracyColor}`}>
              {zpdLevel === 1 ? 'Dasar' : zpdLevel === 2 ? 'Menengah' : 'Sulit'}
            </div>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-glass-border shadow-sm">
            <span className="text-xs font-bold uppercase opacity-60 block mb-1">Status Progres</span>
            <div className={`font-black text-xl ${analysis.accuracyColor}`}>
              {analysis.accuracyText}
            </div>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-glass-border col-span-2 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase opacity-60">Materi Diselesaikan</span>
              <span className="font-bold text-sm text-primary">{analysis.completionRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-glass-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${analysis.completionRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-right mt-1 opacity-50">
              {analysis.completedChapters} dari {analysis.totalChapters} Bab
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
