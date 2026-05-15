import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyPhases } from '../data/historyContent';
import { Lock, Unlock, PlayCircle, Target, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
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

      {/* HERO SECTION / WELCOME */}
      <div className="glass-panel p-8 md:p-16 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Selamat Datang di Masa Depan Pembelajaran Sejarah
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Zitora: <span className="text-gen">Adaptasi</span> Menembus Batas Waktu.
            </h2>
            

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-surface/80 backdrop-blur-sm p-4 rounded-2xl border border-glass-border flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs opacity-50 font-bold uppercase tracking-tighter">Level Awalmu</div>
                  <div className="font-black text-primary text-xl">Level {initialLevel}</div>
                </div>
              </div>
              <div className="bg-surface/80 backdrop-blur-sm p-4 rounded-2xl border border-glass-border flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs opacity-50 font-bold uppercase tracking-tighter">Mulai Belajar</div>
                  <div className="font-black text-secondary text-xl">Fase E Awal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 flex justify-center">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary to-secondary rounded-[40px] flex items-center justify-center shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-white/10 rounded-[40px] backdrop-blur-sm transform rotate-6 scale-95 -z-10"></div>
              <span className="material-symbols-outlined text-9xl text-white drop-shadow-2xl">history_edu</span>
            </motion.div>
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
            <Target className="w-5 h-5 text-secondary" /> Misi Harian Aktif
          </h3>
          <div className="text-xs font-bold opacity-60">Reward instan berupa poin & kenaikan ZPD</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {dailyQuests.map(q => (
            <div key={q.id} className="bg-surface/50 p-4 rounded-xl border border-glass-border flex flex-col gap-2 transition-all hover:border-secondary/50">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className={`font-bold text-sm ${q.isCompleted ? 'text-green-500' : 'text-on-surface'}`}>{q.title}</span>
                  <span className="text-[10px] text-primary font-bold">+{q.reward} Poin</span>
                </div>
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
              <div key={idx} className="bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                <Award className="w-4 h-4" /> {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-12 pb-20">
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
                  const isLocked = false; // Chapters are unlocked within phase as requested
                  const isCompleted = moduleProgress[chapter.id]?.isCompleted;
                  
                  return (
                    <div 
                      key={chapter.id}
                      onClick={() => handleStartChapter(phase.id, chapter.id, isLocked)}
                      className={`glass-panel p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group hover:border-primary/50`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isCompleted ? 'bg-green-500 text-white' : 'bg-gradient-to-br from-primary to-secondary text-white'}`}>
                          {isCompleted ? <span className="material-symbols-outlined text-xl">check</span> : (cIndex + 1)}
                        </div>
                        <div className="p-2 bg-surface/50 rounded-lg backdrop-blur-sm">
                          <Unlock className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-lg mb-2 line-clamp-2">{chapter.title}</h4>
                      <p className="text-sm opacity-70 mb-6 flex-1 line-clamp-3">{chapter.summary}</p>
                      
                      <div className="mt-auto">
                        <button className="w-full py-2 rounded-xl bg-surface/80 hover:bg-surface text-primary font-bold transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white">
                          <PlayCircle className="w-5 h-5" />
                          {isCompleted ? 'Baca Ulang' : 'Mulai Baca'}
                        </button>
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
