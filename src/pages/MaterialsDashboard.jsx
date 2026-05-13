import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyPhases } from '../data/historyContent';
import { Lock, Unlock, PlayCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MaterialsDashboard() {
  const navigate = useNavigate();
  const { moduleProgress } = useStore();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const getPhaseProgress = (chapters) => {
    if (!chapters || chapters.length === 0) return 0;
    const totalProgress = chapters.reduce((sum, chap) => sum + (moduleProgress[chap.id]?.progress || 0), 0);
    return Math.round(totalProgress / chapters.length);
  };

  const checkIsLocked = (phaseIndex, chapterIndex) => {
    if (phaseIndex === 0 && chapterIndex === 0) return false;
    if (chapterIndex > 0) {
      const prevChapterId = historyPhases[phaseIndex].chapters[chapterIndex - 1].id;
      return !moduleProgress[prevChapterId]?.isCompleted;
    }
    if (phaseIndex > 0) {
      const prevPhase = historyPhases[phaseIndex - 1];
      const prevPhaseLastChapterId = prevPhase.chapters[prevPhase.chapters.length - 1].id;
      return !moduleProgress[prevPhaseLastChapterId]?.isCompleted;
    }
    return true;
  };

  const handleStartChapter = (phaseId, chapterId, isLocked) => {
    if (!isLocked) navigate(`/material/${phaseId}/${chapterId}`);
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
          Pilih fase sejarah (kapsul) di bawah ini untuk membuka daftar materinya.
        </p>
      </div>

      <div className="space-y-6">
        {historyPhases.map((phase, pIndex) => {
          const isExpanded = expandedPhase === phase.id;
          const phaseProgress = getPhaseProgress(phase.chapters);
          
          return (
            <motion.div 
              key={phase.id} 
              layout
              className={`glass-panel border-2 transition-colors duration-300 ${isExpanded ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-glass-border'}`}
            >
              {/* Capsule Header (Clickable) */}
              <div 
                onClick={() => togglePhase(phase.id)}
                className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                      Fase {pIndex + 1}
                    </div>
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
                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {phase.chapters.map((chapter, cIndex) => {
                          const isLocked = checkIsLocked(pIndex, cIndex);
                          const isCompleted = moduleProgress[chapter.id]?.isCompleted;
                          
                          return (
                            <div 
                              key={chapter.id}
                              onClick={() => handleStartChapter(phase.id, chapter.id, isLocked)}
                              className={`glass-panel p-5 flex flex-col bg-background/50 border border-glass-border transition-all duration-300 ${isLocked ? 'opacity-60 grayscale-[30%] cursor-not-allowed' : 'hover:-translate-y-1.5 hover:shadow-xl cursor-pointer hover:border-primary/50 group'}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-sm ${isCompleted ? 'bg-green-500 text-white' : isLocked ? 'bg-surface-variant text-on-surface-variant' : 'bg-gradient-to-br from-primary to-secondary text-white'}`}>
                                  {isCompleted ? <span className="material-symbols-outlined text-lg">check</span> : (cIndex + 1)}
                                </div>
                                <div className="p-1.5 bg-surface/80 rounded-lg backdrop-blur-sm">
                                  {isLocked ? <Lock className="w-4 h-4 text-on-surface opacity-50" /> : <Unlock className="w-4 h-4 text-primary" />}
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-lg mb-2 leading-tight">{chapter.title}</h4>
                              <p className="text-xs opacity-70 mb-5 flex-1 line-clamp-3">{chapter.summary}</p>
                              
                              <div className="mt-auto">
                                {!isLocked ? (
                                  <button className="w-full py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                    <PlayCircle className="w-4 h-4" />
                                    {isCompleted ? 'Baca Ulang' : 'Mulai Baca'}
                                  </button>
                                ) : (
                                  <button className="w-full py-2 rounded-xl bg-surface/30 text-on-surface opacity-50 font-bold cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                                    <Lock className="w-4 h-4" /> Terkunci
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
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
