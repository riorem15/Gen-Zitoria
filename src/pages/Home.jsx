import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyPhases } from '../data/historyContent';
import { Lock, Unlock, PlayCircle, Target, CheckCircle2, Award } from 'lucide-react';
import AIAnalysis from '../components/dashboard/AIAnalysis';

export default function Home() {
  const navigate = useNavigate();
  const { moduleProgress, initialLevel, dailyQuests, unlockedBadges } = useStore();

  const handleStartChapter = (phaseId, chapterId, isLocked) => {
    if (!isLocked) {
      navigate(`/material/${phaseId}/${chapterId}`);
    }
  };

  const getPhaseProgress = (chapters) => {
    if (!chapters || chapters.length === 0) return 0;
    const totalProgress = chapters.reduce((sum, chap) => sum + (moduleProgress[chap.id]?.progress || 0), 0);
    return Math.round(totalProgress / chapters.length);
  };

  // Determine if a chapter is locked based on chronological order
  const checkIsLocked = (phaseIndex, chapterIndex) => {
    // If it's the very first chapter, it's always unlocked
    if (phaseIndex === 0 && chapterIndex === 0) return false;

    // Check previous chapter in the same phase
    if (chapterIndex > 0) {
      const prevChapterId = historyPhases[phaseIndex].chapters[chapterIndex - 1].id;
      return !moduleProgress[prevChapterId]?.isCompleted;
    }
    
    // If it's the first chapter of a subsequent phase, check the last chapter of the previous phase
    if (phaseIndex > 0) {
      const prevPhase = historyPhases[phaseIndex - 1];
      const prevPhaseLastChapterId = prevPhase.chapters[prevPhase.chapters.length - 1].id;
      return !moduleProgress[prevPhaseLastChapterId]?.isCompleted;
    }

    return true;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-gen">Jelajahi</span> Waktu.
            </h2>
            <p className="text-lg md:text-xl text-on-surface opacity-80 max-w-2xl">
              Level Awalmu: <strong className="text-primary">Level {initialLevel}</strong>. 
              Mulai perjalanan kronologismu dari awal masa praaksara hingga era reformasi modern.
            </p>
          </div>
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-float shrink-0">
            <span className="material-symbols-outlined text-6xl text-white">public</span>
          </div>
        </div>
      </div>

      <AIAnalysis />

      {/* Daily Quests Widget */}
      <div className="glass-panel p-6 border-l-4 border-l-secondary relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Target className="w-32 h-32" />
        </div>
        <div className="flex justify-between items-end mb-4 relative z-10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" /> Misi Harian
          </h3>
          <div className="text-xs font-bold opacity-60">Reset dalam 14:22:00</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {dailyQuests.map(q => (
            <div key={q.id} className="bg-surface/50 p-4 rounded-xl border border-glass-border flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className={`font-bold text-sm ${q.isCompleted ? 'text-green-500' : 'text-on-surface'}`}>{q.title}</span>
                {q.isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
              </div>
              <div className="w-full bg-glass-border h-1.5 rounded-full overflow-hidden mt-auto">
                <div className={`h-full ${q.isCompleted ? 'bg-green-500' : 'bg-secondary'} transition-all`} style={{ width: `${(q.current / q.target) * 100}%` }}></div>
              </div>
              <div className="text-[10px] font-bold opacity-50 text-right">{q.current} / {q.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Widget */}
      {unlockedBadges.length > 0 && (
        <div className="glass-panel p-6 border-t-4 border-t-orange-500 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" /> Pencapaian Lencana
          </h3>
          <div className="flex flex-wrap gap-4">
            {unlockedBadges.map((badge, idx) => (
              <div key={idx} className="bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <Award className="w-4 h-4" /> {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-12">
        {historyPhases.map((phase, pIndex) => {
          const phaseProgress = getPhaseProgress(phase.chapters);
          
          return (
            <div key={phase.id} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-on-background">{phase.title}</h3>
                  <p className="text-on-surface opacity-70">{phase.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-primary">{phaseProgress}%</div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-50">Selesai</div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-3 bg-glass rounded-full overflow-hidden mb-6 shadow-inner border border-glass-border">
                <div 
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000 ease-out relative"
                  style={{ width: `${phaseProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              {/* Chapters Carousel/Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {phase.chapters.map((chapter, cIndex) => {
                  const isLocked = checkIsLocked(pIndex, cIndex);
                  const isCompleted = moduleProgress[chapter.id]?.isCompleted;
                  
                  return (
                    <div 
                      key={chapter.id}
                      onClick={() => handleStartChapter(phase.id, chapter.id, isLocked)}
                      className={`glass-panel p-6 flex flex-col transition-all duration-300 ${isLocked ? 'opacity-60 grayscale-[50%] cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-xl cursor-pointer group'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isCompleted ? 'bg-green-500 text-white' : isLocked ? 'bg-surface-variant text-on-surface-variant' : 'bg-gradient-to-br from-primary to-secondary text-white'}`}>
                          {isCompleted ? <span className="material-symbols-outlined text-xl">check</span> : (cIndex + 1)}
                        </div>
                        <div className="p-2 bg-surface/50 rounded-lg backdrop-blur-sm">
                          {isLocked ? <Lock className="w-5 h-5 text-on-surface opacity-50" /> : <Unlock className="w-5 h-5 text-primary" />}
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-lg mb-2 line-clamp-2">{chapter.title}</h4>
                      <p className="text-sm opacity-70 mb-6 flex-1 line-clamp-3">{chapter.summary}</p>
                      
                      <div className="mt-auto">
                        {!isLocked && (
                          <button className="w-full py-2 rounded-xl bg-surface/80 hover:bg-surface text-primary font-bold transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white">
                            <PlayCircle className="w-5 h-5" />
                            {isCompleted ? 'Baca Ulang' : 'Mulai Baca'}
                          </button>
                        )}
                        {isLocked && (
                          <button className="w-full py-2 rounded-xl bg-surface/30 text-on-surface opacity-50 font-bold cursor-not-allowed flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" /> Terkunci
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
