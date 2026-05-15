import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyQuizzes } from '../data/historyQuizzes';
import { phaseEvaluations } from '../data/evaluationData';
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
  
  const { streak, addStreak, resetStreak, addGamePoints, initialLevel, markPhaseComplete, updateQuestProgress } = useStore();

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

  // Matching Logic States
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});

  // Analysis screen states
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Difficulty Logic
  const getDifficulty = useCallback((currentStreak) => {
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
      availableQuestions = (chapterData['LOTS'] || []).filter(q => !answeredQuestionIds.has(q.id));
    }
    if (availableQuestions.length === 0) return null;

    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setAnsweredQuestionIds(prev => new Set(prev).add(randomQ.id));
    return { ...randomQ, difficulty: diff };
  }, [chapterId, getDifficulty, answeredQuestionIds]);

  useEffect(() => {
    if (mode === 'phase_exam' && phaseId && phaseEvaluations[phaseId]) {
      const all = phaseEvaluations[phaseId];
      const mc = all.filter(q => q.type === 'MC');
      const tf = all.filter(q => q.type === 'TF');
      const match = all.filter(q => q.type === 'MATCH');

      const pick = (arr, count) => {
        let res = [];
        while (res.length < count && arr.length > 0) {
          res = [...res, ...arr].sort(() => Math.random() - 0.5);
        }
        return res.slice(0, count);
      };

      // 50% MC (15), 30% TF (9), 20% Match (6)
      const examQuestions = [
        ...pick(mc, 15),
        ...pick(tf, 9),
        ...pick(match, 6)
      ].sort(() => Math.random() - 0.5);

      setQuestions(examQuestions);
      setCurrentIndex(0);
    } else if (chapterId && historyQuizzes[chapterId]) {
      const firstQ = loadNextQuestion(streak);
      if (firstQ) {
        setQuestions([firstQ]);
        setCurrentIndex(0);
      }
    }
  }, [chapterId, phaseId, mode]);

  const currentQ = questions[currentIndex];

  const handleMatchClick = (side, item) => {
    if (isAnswered) return;
    if (side === 'left') {
      setSelectedLeft(item);
    } else if (side === 'right' && selectedLeft) {
      setMatches(prev => ({ ...prev, [selectedLeft]: item }));
      setSelectedLeft(null);
    }
  };

  const handleSubmit = () => {
    if (isAnswered) return;
    
    let correct = false;
    if (currentQ.type === 'TF') {
      correct = (selectedOption === 0) === currentQ.correctAnswer;
    } else if (currentQ.type === 'MATCH') {
      const correctMatches = currentQ.pairs.every(p => matches[p.left] === p.right);
      correct = correctMatches;
    } else {
      correct = selectedOption === currentQ.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    const answerData = {
      question: currentQ.question,
      options: currentQ.options || (currentQ.type === 'TF' ? ['Benar', 'Salah'] : []),
      selectedIndex: selectedOption,
      correctIndex: currentQ.type === 'TF' ? (currentQ.correctAnswer ? 0 : 1) : currentQ.correctAnswer,
      isCorrect: correct,
      explanation: currentQ.explanation || 'Pembahasan belum tersedia.',
      difficulty: currentQ.difficulty || 'EXAM',
      type: currentQ.type || 'MC'
    };

    setUserAnswers(prev => [...prev, answerData]);

    if (correct) {
      if (mode === 'normal') {
        addStreak();
        const multiplier = currentQ.difficulty === 'HOTS' ? 3 : currentQ.difficulty === 'MOTS' ? 2 : 1;
        const pointsToAdd = (100 * multiplier) + (streak * 10);
        addGamePoints(pointsToAdd);
        setSessionScore(prev => prev + pointsToAdd);
        
        const newStreak = streak + 1;
        if (newStreak === 5) { 
          updateQuestProgress(2, 5);
          setLevelUpText('🔥 LEVEL UP: MOTS!'); 
          setShowLevelUp(true); 
          setTimeout(() => setShowLevelUp(false), 3000); 
        }
        else if (newStreak === 10) { 
          updateQuestProgress(3, 10);
          setLevelUpText('🌟 LEVEL UP: HOTS!'); 
          setShowLevelUp(true); 
          setTimeout(() => setShowLevelUp(false), 3000); 
        }
      }
    } else {
      if (mode === 'normal') resetStreak();
    }
  };

  const handleNext = () => {
    const totalTarget = mode === 'phase_exam' ? 30 : 15;
    
    if (userAnswers.length >= totalTarget) {
      const correctCount = userAnswers.filter(a => a.isCorrect).length;
      const score = Math.round((correctCount / userAnswers.length) * 100);
      
      if (mode === 'phase_exam' && score >= 70) {
        markPhaseComplete(phaseId);
      }
      
      setQuizFinished(true);
      return;
    }

    setMatches({});
    setSelectedLeft(null);

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

  const runPerformanceAnalysis = () => {
    setIsAnalyzing(true);
    setShowAnalysis(true);
    
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);
    const wrongAnswers = userAnswers.filter(a => !a.isCorrect);

    setTimeout(() => {
      let feedback = "";
      if (score >= 90) {
        feedback = `Luar biasa! Performa kamu berada di atas 95% pengguna Zitora lainnya. Kamu memiliki pemahaman yang sangat tajam terhadap detail sejarah. Pertahankan konsistensimu dalam menganalisis hubungan sebab-akibat (kausalitas) sejarah.`;
      } else if (score >= 70) {
        feedback = `Bagus! Kamu berada di atas 75% pengguna. Pemahaman dasarmu sudah sangat kuat. Namun, kamu perlu sedikit lebih teliti pada bagian ${wrongAnswers[0]?.question.substring(0, 30) || 'detail kronologi'}.`;
      } else {
        feedback = `Tetap semangat! Performa kamu saat ini setara dengan 40% pengguna awal. Fokuslah untuk membaca materi kembali dengan mode 'Pahami Makna' bukan sekadar menghafal. Kamu masih sering terkecoh pada bagian ${wrongAnswers[0]?.question.substring(0, 30) || 'konsep dasar'}.`;
      }
      
      setAnalysisText(feedback);
      setIsAnalyzing(false);
    }, 2500);
  };

  if (quizFinished) {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);
    const isPassed = mode === 'phase_exam' ? score >= 70 : true;

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        <div className="glass-panel p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Trophy className="w-64 h-64 rotate-12" />
          </div>
          
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg ${isPassed ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {isPassed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>

          <h2 className="text-4xl font-black mb-2">{isPassed ? 'Misi Selesai!' : 'Coba Lagi'}</h2>
          <div className={`text-7xl font-black mb-4 ${isPassed ? 'text-primary' : 'text-red-500'}`}>{score}</div>
          
          <p className="text-xl opacity-80 mb-8">
            {mode === 'phase_exam' 
              ? (isPassed ? 'Selamat! Kamu lulus ujian fase dan membuka materi baru.' : 'Maaf, skor kamu belum mencapai target 70. Pelajari kembali materi fase ini.')
              : `Kamu berhasil menjawab ${correctCount} dari ${userAnswers.length} soal.`}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button onClick={() => navigate('/')} className="p-4 rounded-2xl bg-surface border border-glass-border font-bold hover:bg-surface/80 transition-colors">Menu Utama</button>
            <button onClick={() => setShowReview(!showReview)} className="p-4 rounded-2xl bg-primary text-white font-bold hover:scale-105 transition-all">Lihat Pembahasan</button>
            <button onClick={runPerformanceAnalysis} className="p-4 rounded-2xl bg-purple-600 text-white font-bold hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Brain className="w-5 h-5" /> Analisis Belajar
            </button>
          </div>

          <AnimatePresence>
            {showAnalysis && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-8 pt-8 border-t border-glass-border text-left">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <motion.div 
                      animate={{ 
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1, 1.1, 1],
                        y: [0, -5, 0, -5, 0]
                      }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="material-symbols-outlined text-6xl text-purple-600">search</span>
                    </motion.div>
                    <p className="font-bold animate-pulse text-purple-700">Menganalisis pola kognitif dan performamu...</p>
                  </div>
                ) : (
                  <div className="bg-purple-500/10 p-6 rounded-2xl border border-purple-500/20">
                    <h4 className="text-xl font-black text-purple-700 mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5" /> Analisis Performa Real-Time
                    </h4>
                    <p className="leading-relaxed text-on-surface opacity-90">{analysisText}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showReview && (
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <BookOpen className="text-primary" /> Pembahasan Detail
            </h3>
            {userAnswers.map((ans, idx) => (
              <div key={idx} className={`glass-panel p-6 border-l-8 ${ans.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black uppercase tracking-widest opacity-50">Soal {idx + 1} • {ans.type}</span>
                  {ans.isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                </div>
                <h4 className="text-xl font-bold mb-4">{ans.question}</h4>
                <div className="p-4 bg-primary/5 rounded-xl text-sm italic opacity-80 border border-primary/10">
                  <strong>Pembahasan:</strong> {ans.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!currentQ) return null;

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

      <div className="mb-6 flex justify-between items-center bg-surface/50 p-4 rounded-2xl border border-glass-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase opacity-50">Streak</div>
            <div className="text-lg font-black">{streak}</div>
          </div>
        </div>
        <div className="h-10 w-px bg-glass-border"></div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase opacity-50">Progress Soal</div>
          <div className="text-lg font-black text-primary">{userAnswers.length + 1} / {mode === 'phase_exam' ? 30 : 15}</div>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-12 relative overflow-hidden border-2 border-primary/5 shadow-2xl">
        <div className="flex items-center gap-2 mb-8">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            {currentQ.type} • {currentQ.difficulty || 'EXAM'}
          </span>
          {mode === 'phase_exam' && (
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
              Evaluasi Fase
            </span>
          )}
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black leading-tight mb-10">{currentQ.question}</h3>

        {/* Question Type Rendering */}
        {currentQ.type === 'TF' ? (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {['Benar', 'Salah'].map((opt, idx) => (
              <button key={idx} disabled={isAnswered} onClick={() => setSelectedOption(idx)}
                className={`p-10 rounded-3xl border-2 transition-all duration-300 text-2xl font-black ${
                  isAnswered 
                    ? (idx === (currentQ.correctAnswer ? 0 : 1) ? 'border-green-500 bg-green-500/20 text-green-700' : (idx === selectedOption ? 'border-red-500 bg-red-500/20 text-red-700' : 'opacity-40'))
                    : (selectedOption === idx ? 'border-primary bg-primary/10 scale-105 shadow-xl' : 'border-glass-border hover:border-primary/50')
                }`}>
                {opt}
              </button>
            ))}
          </div>
        ) : currentQ.type === 'MATCH' ? (
          <div className="space-y-6 mb-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 mb-2">Kiri (Pilih Satu)</p>
                {currentQ.pairs.map((p, i) => (
                  <button key={i} disabled={isAnswered} onClick={() => handleMatchClick('left', p.left)}
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all font-bold flex justify-between items-center ${matches[p.left] ? 'border-green-500/30 bg-green-500/5 opacity-50' : selectedLeft === p.left ? 'border-primary bg-primary/10' : 'border-glass-border'}`}>
                    <span>{p.left}</span>
                    {matches[p.left] && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">Linked</span>}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase opacity-40 mb-2">Kanan (Pasangkan)</p>
                {currentQ.pairs.map((p, i) => {
                  const isLinked = Object.values(matches).includes(p.right);
                  return (
                    <button key={i} disabled={isAnswered || !selectedLeft} onClick={() => handleMatchClick('right', p.right)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all font-bold ${isLinked ? 'border-green-500/30 bg-green-500/5 opacity-50' : 'border-glass-border hover:border-primary/50'}`}>
                      {p.right}
                    </button>
                  );
                })}
              </div>
            </div>
            {Object.keys(matches).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-glass-border">
                {Object.entries(matches).map(([l, r], idx) => (
                  <div key={idx} className="bg-surface p-2 px-3 rounded-lg text-xs border border-glass-border flex items-center gap-2">
                    <span className="font-bold text-primary">{l}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
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
                stateStyle = "border-primary bg-primary/10 scale-[1.02] shadow-xl ring-2 ring-primary";
              }

              return (
                <button key={idx} disabled={isAnswered} onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${stateStyle}`}>
                  <span className="font-bold text-xl">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {isAnswered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-6 rounded-2xl bg-surface border border-glass-border shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <h4 className="font-black text-lg">Pembahasan Jawaban</h4>
              </div>
              <p className="text-on-surface opacity-80 leading-relaxed italic">{currentQ.explanation || 'Pembahasan menarik sedang disiapkan!'}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-4">
          {!isAnswered ? (
            <button onClick={handleSubmit} disabled={(selectedOption === null && currentQ.type !== 'MATCH') || (currentQ.type === 'MATCH' && Object.keys(matches).length < currentQ.pairs.length)}
              className="px-12 py-5 rounded-3xl bg-primary text-white font-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
              Kunci Jawaban
            </button>
          ) : (
            <button onClick={handleNext}
              className="px-12 py-5 rounded-3xl bg-on-background text-background font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
              <span>Selanjutnya</span> <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
