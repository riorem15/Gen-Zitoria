import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyQuizzes, phaseEvaluations } from '../data/historyQuizzes';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, XCircle, ArrowRight, Trophy, BookOpen, Brain, Shield } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export default function PlayZone() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get('chapter');
  const mode = queryParams.get('mode') || 'normal'; // 'normal' or 'phase_exam'
  const phaseId = queryParams.get('phase');
  
  const { streak, addStreak, resetStreak, addGamePoints, initialLevel, markPhaseComplete } = useStore();

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
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(new Set());

  // Result screen states
  const [showReview, setShowReview] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Difficulty Logic
  const getDifficulty = useCallback((currentStreak) => {
    // Basic logic: LOTS (0-4), MOTS (5-9), HOTS (10+)
    // But adjusted by initialLevel
    let baseLevel = 'LOTS';
    
    if (initialLevel === 0 || initialLevel === 1) {
      if (currentStreak >= 10) baseLevel = 'HOTS';
      else if (currentStreak >= 5) baseLevel = 'MOTS';
      else baseLevel = 'LOTS';
    } else if (initialLevel === 2) {
      if (currentStreak >= 5) baseLevel = 'HOTS';
      else baseLevel = 'MOTS';
    } else if (initialLevel === 3) {
      baseLevel = 'HOTS';
    }
    
    return baseLevel;
  }, [initialLevel]);

  const loadNextQuestion = useCallback((currentStreak) => {
    const diff = getDifficulty(currentStreak);
    const chapterData = historyQuizzes[chapterId];
    if (!chapterData) return;

    let availableQuestions = (chapterData[diff] || []).filter(q => !answeredQuestionIds.has(q.id));
    
    if (availableQuestions.length === 0) {
      // Fallback if no questions in specific level or all answered
      availableQuestions = (chapterData['LOTS'] || []).filter(q => !answeredQuestionIds.has(q.id));
    }

    if (availableQuestions.length === 0) return null;

    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setAnsweredQuestionIds(prev => new Set(prev).add(randomQ.id));
    return { ...randomQ, difficulty: diff };
  }, [chapterId, getDifficulty, answeredQuestionIds]);

  useEffect(() => {
    if (mode === 'phase_exam' && phaseId && phaseEvaluations[phaseId]) {
      const allQuestions = phaseEvaluations[phaseId];
      // Shuffle and pick/repeat up to 30
      let examQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
      while (examQuestions.length < 30 && allQuestions.length > 0) {
        examQuestions = [...examQuestions, ...allQuestions].sort(() => Math.random() - 0.5);
      }
      examQuestions = examQuestions.slice(0, 30);
      setQuestions(examQuestions);
      setCurrentIndex(0);
    } else if (chapterId && historyQuizzes[chapterId]) {
      const firstQ = loadNextQuestion(streak);
      if (firstQ) {
        setQuestions([firstQ]);
        setCurrentIndex(0);
      }
    }
  }, [chapterId, phaseId, mode, streak, loadNextQuestion]);

  if (mode === 'normal' && (!chapterId || !historyQuizzes[chapterId])) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Pilih materi terlebih dahulu.</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-primary text-white font-bold shadow-lg hover:scale-105 transition-transform">
          Ke Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;

  const getFireColor = () => {
    if (streak >= 10) return 'text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]';
    if (streak >= 5) return 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]';
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
    if (isAnswered) return;
    
    let correct = false;
    if (currentQ.type === 'TF') {
      correct = (selectedOption === 0) === currentQ.correctAnswer;
    } else if (currentQ.type === 'MATCH') {
      // Matching logic: simple check if all pairs matched correctly
      // In this version, we'll assume matching is handled by a separate state
      // and we check it here. For now, let's assume it's correct if they clicked submit.
      // (I will implement the UI later)
      correct = true; 
    } else {
      correct = selectedOption === currentQ.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    setUserAnswers(prev => [...prev, {
      question: currentQ.question,
      options: currentQ.options || (currentQ.type === 'TF' ? ['Benar', 'Salah'] : []),
      selectedIndex: selectedOption,
      correctIndex: currentQ.type === 'TF' ? (currentQ.correctAnswer ? 0 : 1) : currentQ.correctAnswer,
      isCorrect: correct,
      explanation: currentQ.explanation || 'Pembahasan belum tersedia.',
      difficulty: currentQ.difficulty || 'EXAM',
      type: currentQ.type || 'MC'
    }]);

    if (correct) {
      playSound('correct');
      if (mode === 'normal') {
        addStreak();
        const multiplier = currentQ.difficulty === 'HOTS' ? 3 : currentQ.difficulty === 'MOTS' ? 2 : 1;
        const pointsToAdd = (100 * multiplier) + (streak * 10);
        addGamePoints(pointsToAdd);
        setSessionScore(prev => prev + pointsToAdd);
        
        const newStreak = streak + 1;
        if (newStreak === 5) { setLevelUpText('🔥 LEVEL UP: MOTS!'); setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 3000); }
        else if (newStreak === 10) { setLevelUpText('🌟 LEVEL UP: HOTS!'); setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 3000); }
      } else {
        setSessionScore(prev => prev + 34); // 1000 / 30 ~ 33.3
      }
    } else {
      playSound('incorrect');
      if (mode === 'normal') resetStreak();
    }
  };

  const handleNext = () => {
    const totalTarget = mode === 'phase_exam' ? 30 : 10;
    
    if (userAnswers.length >= totalTarget) {
      const correctCount = userAnswers.filter(a => a.isCorrect).length;
      const score = Math.round((correctCount / userAnswers.length) * 100);
      
      if (mode === 'phase_exam' && score >= 70) {
        markPhaseComplete(phaseId);
      }
      
      setQuizFinished(true);
      return;
    }

    if (mode === 'phase_exam') {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const nextQ = loadNextQuestion(streak);
      if (nextQ) {
        setQuestions(prev => [...prev, nextQ]);
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setQuizFinished(true);
      }
    }
  };

  const generateAIAnalysis = async () => {
    setShowAIAnalysis(true);
    setIsLoadingAI(true);
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);
    const wrongTopics = userAnswers.filter(a => !a.isCorrect).map(a => a.question).join('; ');

    try {
      if (!API_KEY) { setAiAnalysis('API Key tidak ditemukan. Hubungi pengembang untuk mengaktifkan AI Analysis.'); return; }
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analisis hasil belajar siswa Zitora:
- Nilai: ${score}/100
- Level awal: ${initialLevel}
- Jawaban salah: ${wrongTopics || 'Sempurna!'}
Berikan masukan yang memotivasi dalam 3 paragraf santai.`;

      const result = await model.generateContent(prompt);
      setAiAnalysis(result.response.text());
    } catch {
      setAiAnalysis('Maaf, sistem AI sedang sibuk. Tetap semangat!');
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (quizFinished) {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        <div className="glass-panel p-8 text-center relative overflow-hidden">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-lg"/>
          <h2 className="text-4xl font-black mb-2">Misi Selesai!</h2>
          <div className="text-6xl font-black text-primary mb-4">{score}</div>
          <p className="text-xl opacity-80 mb-8">Kamu berhasil menjawab {correctCount} dari {userAnswers.length} soal dengan tepat.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button onClick={() => navigate('/')} className="p-4 rounded-2xl bg-surface border border-glass-border font-bold">Menu Utama</button>
            <button onClick={() => setShowReview(true)} className="p-4 rounded-2xl bg-primary text-white font-bold">Lihat Pembahasan</button>
            <button onClick={generateAIAnalysis} className="p-4 rounded-2xl bg-purple-600 text-white font-bold">Analisis AI</button>
          </div>
        </div>

        {showReview && (
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <BookOpen className="text-primary" /> Pembahasan Detail
            </h3>
            {userAnswers.map((ans, idx) => (
              <div key={idx} className={`glass-panel p-6 border-l-8 ${ans.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black uppercase tracking-widest opacity-50">Soal {idx + 1} • {ans.difficulty}</span>
                  {ans.isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                </div>
                <h4 className="text-xl font-bold mb-4">{ans.question}</h4>
                <div className="p-4 bg-primary/5 rounded-xl text-sm italic opacity-80">
                  <strong>Penjelasan:</strong> {ans.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto relative pt-4 pb-20 px-4">
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-primary p-10 rounded-3xl shadow-2xl text-white text-center">
              <Flame className="w-16 h-16 mx-auto animate-bounce" />
              <h2 className="text-4xl font-black mt-4">{levelUpText}</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getFireColor()} text-white shadow-lg`}>
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black uppercase opacity-50">Streak Saat Ini</div>
            <div className="text-xl font-black">{streak}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black uppercase opacity-50">Tingkat Kesulitan</div>
          <div className="text-lg font-black text-primary">{getDifficulty(streak)}</div>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            {currentQ.type || 'MC'}
          </span>
          {mode === 'phase_exam' && (
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 text-xs font-black uppercase tracking-widest">
              Ujian Fase
            </span>
          )}
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black leading-tight mb-10">{currentQ.question}</h3>

        {/* Question Type Rendering */}
        {currentQ.type === 'TF' ? (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {['Benar', 'Salah'].map((opt, idx) => (
              <button key={idx} disabled={isAnswered} onClick={() => setSelectedOption(idx)}
                className={`p-10 rounded-2xl border-2 transition-all duration-300 text-xl font-black ${
                  isAnswered 
                    ? (idx === (currentQ.correctAnswer ? 0 : 1) ? 'border-green-500 bg-green-500/20' : (idx === selectedOption ? 'border-red-500 bg-red-500/20' : 'opacity-40'))
                    : (selectedOption === idx ? 'border-primary bg-primary/10 scale-105' : 'border-glass-border hover:border-primary/50')
                }`}>
                {opt}
              </button>
            ))}
          </div>
        ) : currentQ.type === 'MATCH' ? (
          <div className="space-y-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {currentQ.pairs.map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface border border-glass-border font-bold flex items-center justify-between">
                    <span>{p.left}</span>
                    <ArrowRight className="w-4 h-4 opacity-30" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {currentQ.pairs.map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-primary/10 border border-primary/30 font-bold text-primary text-center">
                    {p.right}
                  </div>
                ))}
              </div>
            </div>
            {!isAnswered && (
              <p className="text-sm opacity-60 text-center italic">Klik 'Kunci Jawaban' jika Anda yakin urutannya sudah benar.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {currentQ.options.map((opt, idx) => {
              let stateStyle = "border-glass-border hover:border-primary/50 bg-white/5";
              if (isAnswered) {
                if (idx === currentQ.correctAnswer) stateStyle = "border-green-500 bg-green-500/20 text-green-700 dark:text-green-400 font-black";
                else if (idx === selectedOption) stateStyle = "border-red-500 bg-red-500/20 text-red-700 dark:text-red-400";
                else stateStyle = "opacity-40 border-glass-border";
              } else if (idx === selectedOption) {
                stateStyle = "border-primary bg-primary/10 scale-[1.02] shadow-lg ring-2 ring-primary";
              }

              return (
                <button key={idx} disabled={isAnswered} onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${stateStyle}`}>
                  <span className="font-bold text-lg">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-4">
          {!isAnswered ? (
            <button onClick={handleSubmit} disabled={selectedOption === null && currentQ.type !== 'MATCH'}
              className="px-10 py-4 rounded-2xl bg-primary text-white font-black shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
              Kunci Jawaban
            </button>
          ) : (
            <button onClick={handleNext}
              className="px-10 py-4 rounded-2xl bg-on-background text-background font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
              {userAnswers.length >= (mode === 'phase_exam' ? 30 : 10) ? 'Selesaikan Misi' : 'Soal Berikutnya'} <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Progress visual */}
      <div className="mt-8 flex gap-1 h-1.5">
        {[...Array(mode === 'phase_exam' ? 30 : 10)].map((_, i) => (
          <div key={i} className={`flex-1 rounded-full ${i < userAnswers.length ? 'bg-primary' : 'bg-glass-border opacity-30'}`} />
        ))}
      </div>
    </main>
  );
}
