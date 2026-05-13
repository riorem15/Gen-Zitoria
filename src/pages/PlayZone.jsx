import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyQuizzes } from '../data/historyQuizzes';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, XCircle, ArrowRight, Trophy, BookOpen, Brain } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export default function PlayZone() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get('chapter');
  const { streak, addStreak, resetStreak, addGamePoints } = useStore();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpText, setLevelUpText] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  // Result screen states
  const [showReview, setShowReview] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (chapterId && historyQuizzes[chapterId]) {
      setQuestions(historyQuizzes[chapterId]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuizFinished(false);
      setSessionScore(0);
      setUserAnswers([]);
    }
  }, [chapterId]);

  if (!chapterId || !historyQuizzes[chapterId]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Pilih materi terlebih dahulu.</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-primary text-white font-bold">
          Ke Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;

  const getFireColor = () => {
    if (currentIndex >= 10) return 'text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]';
    if (currentIndex >= 5) return 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]';
    return 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]';
  };

  const playSound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) { /* audio not supported */ }
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    setUserAnswers(prev => [...prev, {
      question: currentQ.question,
      options: currentQ.options,
      selectedIndex: selectedOption,
      correctIndex: currentQ.correctAnswer,
      selectedOptionText: currentQ.options[selectedOption],
      correctOptionText: currentQ.options[currentQ.correctAnswer],
      isCorrect: correct,
      explanation: currentQ.explanation || 'Pembahasan belum tersedia.',
    }]);

    if (correct) {
      playSound('correct');
      addStreak();
      addGamePoints(100 + (streak * 10));
      setSessionScore(prev => prev + 100 + (streak * 10));
      const newStreak = streak + 1;
      if (newStreak === 5) { setLevelUpText('LEVEL UP: Menengah (MOTS)'); setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 3000); }
      else if (newStreak === 10) { setLevelUpText('LEVEL UP: Sulit (HOTS)'); setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 3000); }
    } else {
      playSound('incorrect');
      resetStreak();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const generateAIAnalysis = async () => {
    setShowAIAnalysis(true);
    setIsLoadingAI(true);
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);
    const wrongTopics = userAnswers.filter(a => !a.isCorrect).map(a => a.question).join('; ');

    try {
      if (!API_KEY) { setAiAnalysis('API Key tidak ditemukan. Aktifkan VITE_GEMINI_API_KEY di .env'); return; }
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Kamu adalah Zitoria AI, analis performa belajar sejarah yang ramah dan memotivasi.
Siswa baru saja menyelesaikan evaluasi soal sejarah dengan hasil berikut:
- Nilai: ${score}/100 (${correctCount} dari ${userAnswers.length} soal benar)
- Soal yang dijawab salah: ${wrongTopics || 'tidak ada (sempurna!)'}

Berikan analisis performa yang:
1. Dimulai dengan pujian yang personal sesuai nilai
2. Sebutkan hal yang sudah dikuasai dengan baik
3. Berikan saran konkret untuk topik yang perlu dipelajari ulang
4. Tutup dengan kalimat motivasi yang menyemangati

Gunakan bahasa Indonesia yang santai, hangat, dan edukatif. Panjang: 3-4 paragraf. Gunakan emoji untuk lebih menarik.`;

      const result = await model.generateContent(prompt);
      setAiAnalysis(result.response.text());
    } catch {
      setAiAnalysis('Maaf, Zitoria AI sedang tidak tersedia. Tetap semangat belajar!');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // ─── RESULT SCREEN ────────────────────────────────────────────
  if (quizFinished) {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);

    if (showReview) {
      return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
          <button onClick={() => setShowReview(false)}
            className="flex items-center gap-2 font-bold mb-6 hover:text-primary transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180"/> Kembali ke Hasil
          </button>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <BookOpen className="text-primary w-8 h-8"/> Pembahasan Jawaban
          </h2>
          <div className="space-y-6">
            {userAnswers.map((ans, idx) => (
              <div key={idx} className="glass-panel p-6 border-l-4" style={{ borderLeftColor: ans.isCorrect ? '#22c55e' : '#ef4444' }}>
                <h3 className="text-lg font-bold mb-4">{idx + 1}. {ans.question}</h3>
                <div className="space-y-2 mb-4">
                  {ans.options.map((opt, i) => (
                    <div key={i} className={`p-3 rounded-xl border-2 flex items-center gap-2 ${
                      i === ans.correctIndex ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-bold' :
                      i === ans.selectedIndex && !ans.isCorrect ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400' :
                      'border-glass-border opacity-50'
                    }`}>
                      {i === ans.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/>}
                      {i === ans.selectedIndex && !ans.isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0"/>}
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <span className="text-xs uppercase font-bold text-primary mb-1 block">💡 Pembahasan:</span>
                  <p className="opacity-90 leading-relaxed">{ans.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (showAIAnalysis) {
      return (
        <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-500">
          <button onClick={() => setShowAIAnalysis(false)}
            className="flex items-center gap-2 font-bold mb-6 hover:text-primary transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180"/> Kembali ke Hasil
          </button>
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Brain className="text-purple-500 w-7 h-7"/> Analisis Performa AI
            </h2>
            {isLoadingAI ? (
              <div className="space-y-3">
                <div className="h-4 bg-glass-border rounded animate-pulse"/>
                <div className="h-4 bg-glass-border rounded animate-pulse w-5/6"/>
                <div className="h-4 bg-glass-border rounded animate-pulse w-4/6"/>
                <p className="text-sm opacity-60 mt-4 animate-pulse">Zitoria AI sedang menganalisis...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="text-on-surface leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto text-center mt-8 animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 pointer-events-none"/>
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-lg"/>
          <h2 className="text-4xl font-black mb-2">Evaluasi Selesai!</h2>
          <p className="text-lg opacity-80 mb-2">{correctCount} dari {userAnswers.length} soal benar</p>

          {/* Score visual */}
          <div className="relative w-32 h-32 mx-auto my-6">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-glass-border"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                strokeDasharray={`${score} ${100 - score}`}
                className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{score}</span>
              <span className="text-xs opacity-60 font-bold">/ 100</span>
            </div>
          </div>

          <div className="bg-surface/80 p-4 rounded-2xl mb-6 border border-glass-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Poin Sesi</h3>
            <div className="text-4xl font-black">+{sessionScore}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-glass border border-glass-border font-bold hover:bg-white/20 transition-all">
              Tutup
            </button>
            <button onClick={() => setShowReview(true)}
              className="px-6 py-2.5 rounded-xl bg-surface border border-primary text-primary font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4"/> Pembahasan
            </button>
            <button onClick={generateAIAnalysis}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-primary text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Brain className="w-4 h-4"/> Analisis AI
            </button>
            <button onClick={() => navigate('/leaderboard')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ SCREEN ──────────────────────────────────────────────
  return (
    <main className="max-w-3xl mx-auto relative pt-4 pb-20">
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-surface/90 backdrop-blur-xl p-10 rounded-3xl border border-glass-border shadow-2xl">
              <Flame className={`w-24 h-24 mx-auto animate-pulse ${getFireColor()}`}/>
              <h2 className="text-3xl font-black mt-4">{levelUpText}</h2>
              <p className="font-bold text-primary mt-2">Soal akan semakin menantang!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Level: {currentQ.level}</span>
          <div className="text-on-surface font-bold opacity-70">Soal {currentIndex + 1} dari {questions.length}</div>
        </div>
        <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-glass-border shadow-sm">
          <Flame className={`w-6 h-6 ${streak > 0 ? getFireColor() : 'text-slate-300'} ${streak > 0 ? 'animate-pulse' : ''}`}/>
          <span className="font-black text-lg">{streak} Streak</span>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
        <h3 className="text-2xl md:text-3xl font-bold leading-relaxed mb-8">{currentQ.question}</h3>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            let btnClass = 'border-glass-border bg-surface/50 hover:bg-glass text-on-surface';
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) btnClass = 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] ring-1 ring-green-500';
              else if (idx === selectedOption) btnClass = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 opacity-70 ring-1 ring-red-500';
              else btnClass = 'border-glass-border opacity-40';
            } else if (idx === selectedOption) btnClass = 'border-primary bg-primary/10 text-primary ring-2 ring-primary shadow-inner';

            return (
              <button key={idx} disabled={isAnswered}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 text-lg ${btnClass}`}>
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/>}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="w-6 h-6 text-red-500 shrink-0"/>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Only show Benar/Salah after answering — no explanation yet */}
        {isAnswered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-2xl border-2 flex items-center gap-3 ${isCorrect ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            {isCorrect
              ? <><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0"/><span className="font-black text-green-600 dark:text-green-400">Tepat Sekali! 🎉</span></>
              : <><XCircle className="w-6 h-6 text-red-500 shrink-0"/><span className="font-black text-red-600 dark:text-red-400">Kurang Tepat — Pembahasan akan muncul di akhir 📋</span></>
            }
          </motion.div>
        )}

        <div className="mt-8 flex justify-end">
          {!isAnswered ? (
            <button onClick={handleSubmit} disabled={selectedOption === null}
              className="px-8 py-3 rounded-xl bg-primary text-white font-bold disabled:opacity-50 hover:bg-primary/90 shadow-md transition-all">
              Kunci Jawaban
            </button>
          ) : (
            <button onClick={handleNext}
              className="px-8 py-3 rounded-xl bg-on-background text-background font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
              {currentIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil'}
              <ArrowRight className="w-5 h-5"/>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8 flex gap-1 h-2">
        {questions.map((_, i) => (
          <div key={i} className={`flex-1 rounded-full ${i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-primary/50 animate-pulse' : 'bg-glass-border'}`}/>
        ))}
      </div>
    </main>
  );
}
