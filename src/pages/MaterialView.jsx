import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { historyPhases } from '../data/historyContent';
import { useStore } from '../store/useStore';
import { ArrowLeft, CheckCircle2, AlertTriangle, Play, Pause, Volume2 } from 'lucide-react';

export default function MaterialView() {
  const { phaseId, chapterId } = useParams();
  const navigate = useNavigate();
  const { moduleProgress, completeModule, updateModuleProgress } = useStore();
  const contentRef = useRef(null);
  
  const [phase, setPhase] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Find phase and chapter
    const currentPhaseIndex = historyPhases.findIndex(p => p.id === phaseId);
    if (currentPhaseIndex === -1) return navigate('/');
    
    const currentPhase = historyPhases[currentPhaseIndex];
    setPhase(currentPhase);
    
    const currentChapterIndex = currentPhase.chapters.findIndex(c => c.id === chapterId);
    if (currentChapterIndex === -1) return navigate('/');
    
    setChapter(currentPhase.chapters[currentChapterIndex]);

    // Check lock status (simplified, based on previous chapter completion)
    let locked = false;
    if (currentChapterIndex > 0) {
      const prevChapterId = currentPhase.chapters[currentChapterIndex - 1].id;
      locked = !moduleProgress[prevChapterId]?.isCompleted;
    } else if (currentPhaseIndex > 0) {
      const prevPhase = historyPhases[currentPhaseIndex - 1];
      const prevPhaseLastChapterId = prevPhase.chapters[prevPhase.chapters.length - 1].id;
      locked = !moduleProgress[prevPhaseLastChapterId]?.isCompleted;
    }
    
    setIsLocked(locked);
  }, [phaseId, chapterId, moduleProgress, navigate]);

  // Track scroll progress and save to DB
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const scrolled = el.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    if (total <= 0) return;
    const pct = Math.round((scrolled / total) * 100);
    if (pct > (moduleProgress[chapterId]?.progress || 0)) {
      updateModuleProgress(chapterId, pct);
    }
  }, [chapterId, moduleProgress, updateModuleProgress]);

  // Stop speech when leaving page
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!chapter || !phase) return null;

  const isCompleted = moduleProgress[chapter.id]?.isCompleted;

  const handleMarkComplete = () => {
    completeModule(chapter.id); // async - syncs to DB
  };;

  const handleStartEvaluation = () => {
    navigate(`/play?chapter=${chapter.id}`);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Maaf, browser Anda tidak mendukung fitur suara.");
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      // Strip HTML tags for clean reading
      const tmp = document.createElement("DIV");
      tmp.innerHTML = chapter.content;
      const textToRead = tmp.textContent || tmp.innerText || "";

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9; // Slightly slower for storytelling
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      window.speechSynthesis.cancel(); // Stop any ongoing
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto space-y-6 pb-20">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-on-surface opacity-70 hover:opacity-100 font-bold mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Kembali
      </button>

      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="border-b border-glass-border pb-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold text-primary tracking-widest uppercase">{phase.title}</span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-xs font-bold bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Selesai Dipelajari
                </span>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="text-3xl md:text-5xl font-black">{chapter.title}</h1>
              {!isLocked && (
                <button 
                  onClick={handleToggleSpeech}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isPlaying && !isPaused 
                      ? 'bg-primary/20 border-primary text-primary animate-pulse' 
                      : 'bg-surface border-glass-border hover:bg-glass hover:text-primary'
                  }`}
                >
                  {isPlaying && !isPaused ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="font-bold text-sm">
                    {isPlaying && !isPaused ? 'Jeda Kisah' : isPlaying && isPaused ? 'Lanjut Kisah' : 'Dengarkan Kisah'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {isLocked ? (
            <div className="bg-surface-variant/50 border border-glass-border rounded-2xl p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Materi Terkunci</h3>
              <p className="opacity-70 mb-6">Kamu harus menyelesaikan materi sebelumnya untuk membuka materi ini secara penuh.</p>
              
              <div className="bg-surface p-6 rounded-xl text-left border border-glass-border">
                <h4 className="font-bold text-primary mb-2">Pratinjau Singkat:</h4>
                <p className="italic opacity-80">{chapter.summary}</p>
              </div>
            </div>
          ) : (
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="space-y-6 text-lg leading-relaxed opacity-90 max-w-none max-h-[70vh] overflow-y-auto pr-2"
            >
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            </div>
          )}

          {!isLocked && (
            <div className="mt-12 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
              {!isCompleted ? (
                <button 
                  onClick={handleMarkComplete}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-glass border border-glass-border hover:bg-white/20 font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Tandai Selesai Dibaca
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 className="w-6 h-6" /> Materi telah diselesaikan
                </div>
              )}

              {isCompleted && (
                <button 
                  onClick={handleStartEvaluation}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Mulai Evaluasi <Play className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
