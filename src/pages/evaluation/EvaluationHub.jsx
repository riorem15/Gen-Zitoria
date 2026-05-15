import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { historyPhases } from '../../data/historyContent';
import { Lock, CheckCircle2, ChevronRight, Star } from 'lucide-react';

const phaseMap = {
  'fase_e': 'fase_e',
  'fase_f': 'fase_f',
};

const evalPhaseMap = {
  'fase_e': 'fase_e',
  'fase_f': 'fase_f',
};

export default function EvaluationHub() {
  const navigate = useNavigate();
  const { moduleProgress, completedPhases } = useStore();

  const getPhaseProgress = (chapters) => {
    if (!chapters?.length) return 0;
    const total = chapters.reduce((s, c) => s + (moduleProgress[c.id]?.progress || 0), 0);
    return Math.round(total / chapters.length);
  };

  const isPhaseAllComplete = (chapters) =>
    chapters.every(c => moduleProgress[c.id]?.isCompleted);

  return (
    <div className="max-w-3xl mx-auto pt-2 pb-24 px-4 space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"/>
        <h2 className="text-3xl font-black mb-1">📋 Evaluasi</h2>
        <p className="opacity-70">Selesaikan semua materi dalam satu fase untuk membuka Evaluasi Akhir Fase!</p>
      </div>

      {historyPhases.map((phase, idx) => {
        const progress = getPhaseProgress(phase.chapters);
        const allDone = isPhaseAllComplete(phase.chapters);
        const evalId = evalPhaseMap[phase.id];
        const stampDone = evalId ? completedPhases.includes(evalId) : false;
        const evalLocked = !allDone;

        return (
          <motion.div key={phase.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">{phase.title}</h3>
                <p className="text-sm opacity-60">{phase.description}</p>
              </div>
              {stampDone && (
                <div className="shrink-0 opacity-80">
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#dc2626" strokeWidth="4"/>
                    <text x="50" y="44" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="serif">{evalId?.toUpperCase().replace('_',' ')}</text>
                    <text x="50" y="58" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="900" fontFamily="serif">SELESAI</text>
                  </svg>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold opacity-60">
                <span>Progress Materi</span><span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700" style={{ width: `${progress}%` }}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {phase.chapters.map(c => (
                <div key={c.id} className={`flex items-center gap-2 p-2 rounded-lg ${moduleProgress[c.id]?.isCompleted ? 'text-green-500' : 'opacity-50'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0"/>
                  <span className="text-xs font-bold truncate">{c.title}</span>
                </div>
              ))}
            </div>

            {evalId && (
              <button
                onClick={() => !evalLocked && navigate(`/evaluation/${evalId}`)}
                disabled={evalLocked}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                  evalLocked
                    ? 'opacity-40 cursor-not-allowed border-glass-border bg-surface/30'
                    : stampDone
                      ? 'border-green-500 bg-green-500/10 text-green-600 hover:bg-green-500/20'
                      : 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}>
                {evalLocked ? <><Lock className="w-4 h-4"/> Selesaikan semua materi dulu</> :
                  stampDone ? <><Star className="w-4 h-4"/> Ujian Ulang — Tingkatkan Nilai</> :
                  <>Mulai Evaluasi Akhir <ChevronRight className="w-4 h-4"/></>}
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
