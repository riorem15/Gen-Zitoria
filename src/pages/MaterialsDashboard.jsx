import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyPhases } from '../data/historyContent';
import { Lock, Unlock, PlayCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MaterialsDashboard() {
  const navigate = useNavigate();
  const { moduleProgress, completedPhases } = useStore();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const getPhaseProgress = (chapters) => {
    if (!chapters || chapters.length === 0) return 0;
    const totalProgress = chapters.reduce((sum, chap) => sum + (moduleProgress[chap.id]?.progress || 0), 0);
    return Math.round(totalProgress / chapters.length);
  };

  const checkIsLocked = (phaseIndex) => {
    if (phaseIndex === 0) return false;
    const prevPhase = historyPhases[phaseIndex - 1];
    return !completedPhases.includes(prevPhase.id);
  };

  const handleStartChapter = (phaseId, chapterId, isLocked) => {
    if (!isLocked) navigate(`/material/${phaseId}/${chapterId}`);
  };

  const handleStartPhaseExam = (phaseId) => {
    navigate(`/play?mode=phase_exam&phase=${phaseId}`);
  };

  const togglePhase = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="glass-panel p-8 relative overflow-hidden mb-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>
        <h2 className="text-3xl md:text-4xl font-black mb-3 flex items-center gap-3">
          <BookOpen className="text-primary w-8 h-8" />
          <span className="text-gen">Pustaka</span> Materi
        </h2>
        <p className="text-on-surface opacity-80 text-lg">
          Materi dalam satu fase kini terbuka semua. Selesaikan kuis kenaikan fase untuk membuka fase berikutnya!
        </p>
      </div>

      <div className="space-y-6">
        {historyPhases.map((phase, pIndex) => {
          const isExpanded = expandedPhase === phase.id;
          const phaseProgress = getPhaseProgress(phase.chapters);
          const isPhaseLocked = checkIsLocked(pIndex);
          const isPhaseCompleted = completedPhases.includes(phase.id);
          
          return (
            <motion.div 
              key={phase.id} 
              layout
              className={`glass-panel border-2 transition-colors duration-300 ${isPhaseLocked ? 'opacity-70 grayscale' : ''} ${isExpanded ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-glass-border'}`}
            >
              {/* Capsule Header (Clickable) */}
              <div 
                onClick={() => !isPhaseLocked && togglePhase(phase.id)}
                className={`p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group ${isPhaseLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 flex items-center gap-2">
                      {isPhaseLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      Fase {pIndex + 1}
                    </div>
                    {isPhaseCompleted && (
                      <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/20">
                        Lulus Evaluasi
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-on-background mb-2">{phase.title}</h3>
                  <p className="text-on-surface opacity-70 line-clamp-2 pr-4">{phase.description}</p>
                </div>

                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right flex flex-col items-end">
                    <div className="text-3xl font-black text-primary">{phaseProgress}%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Penyelesaian</div>
                    <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden border border-glass-border">
                      <div className="h-full bg-primary" style={{ width: `${phaseProgress}%` }}></div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full transition-colors shadow-sm ${isExpanded ? 'bg-primary text-white' : 'bg-surface text-primary group-hover:bg-primary/10'}`}>
                    {isPhaseLocked ? <Lock className="w-6 h-6 opacity-30" /> : isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </div>
              </div>

              {/* Capsule Content (Accordion) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 pt-0 border-t border-glass-border bg-surface/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-8">
                        {phase.chapters.map((chapter, cIndex) => {
                          const isCompleted = moduleProgress[chapter.id]?.isCompleted;
                          
                          return (
                            <div 
                              key={chapter.id}
                              onClick={() => handleStartChapter(phase.id, chapter.id, false)}
                              className={`glass-panel p-5 flex flex-col bg-background/50 border border-glass-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer hover:border-primary/50 group`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-sm ${isCompleted ? 'bg-green-500 text-white' : 'bg-gradient-to-br from-primary to-secondary text-white'}`}>
                                  {isCompleted ? <span className="material-symbols-outlined text-lg">check</span> : (cIndex + 1)}
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-lg mb-2 leading-tight">{chapter.title}</h4>
                              <p className="text-xs opacity-70 mb-5 flex-1 line-clamp-3">{chapter.summary}</p>
                              
                              <div className="mt-auto">
                                <button className="w-full py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                  <PlayCircle className="w-4 h-4" />
                                  {isCompleted ? 'Baca Ulang' : 'Mulai Baca'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Phase Exam Section */}
                      <div className="mt-8 pt-8 border-t border-glass-border">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-br from-purple-600/10 to-primary/10 border border-primary/20">
                          <div>
                            <h4 className="text-xl font-black mb-1">Ujian Kenaikan Fase 🎓</h4>
                            <p className="text-sm opacity-70">Selesaikan 30 soal campuran untuk membuka fase berikutnya. Minimal skor: 70.</p>
                          </div>
                          <button 
                            onClick={() => handleStartPhaseExam(phase.id)}
                            className="px-8 py-4 rounded-2xl bg-primary text-white font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                          >
                            <Trophy className="w-5 h-5" />
                            {isPhaseCompleted ? 'Ulang Ujian' : 'Mulai Ujian Fase'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
