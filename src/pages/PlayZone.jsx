import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { historyQuizzes } from '../data/historyQuizzes';
import { historyPhases } from '../data/historyContent';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, XCircle, ArrowRight, Trophy, BookOpen } from 'lucide-react';

export default function PlayZone() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get('chapter');

  const { streak, addStreak, resetStreak, points } = useStore();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpText, setLevelUpText] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);

  // New state to track answers and show review
  const [userAnswers, setUserAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (chapterId && historyQuizzes[chapterId]) {
      setQuestions(historyQuizzes[chapterId]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuizFinished(false);
      setSessionScore(0);
      setUserAnswers([]);
      setShowReview(false);
    }
  }, [chapterId]);

  if (!chapterId || !historyQuizzes[chapterId]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Pilih materi terlebih dahulu untuk memulai evaluasi.</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-primary text-white font-bold">
          Ke Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  if (!currentQ) {
    return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  // Determine fire color based on index/level
  const getFireColor = () => {
    if (currentIndex >= 10) return "text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"; // HOTS
    if (currentIndex >= 5) return "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"; // MOTS
    return "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"; // LOTS
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'correct') {
        // Cheerful ding
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } else {
        // Disappointing buzz
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.log("Audio not supported or disabled", e);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    // Save answer history for review
    setUserAnswers(prev => [...prev, {
      question: currentQ.question,
      selectedOptionText: currentQ.options[selectedOption],
      correctOptionText: currentQ.options[currentQ.correctAnswer],
      isCorrect: correct,
      explanation: currentQ.explanation || "Pembahasan spesifik untuk soal ini belum tersedia."
    }]);

    if (correct) {
      playSound('correct');
      addStreak();
      setSessionScore(prev => prev + 100 + (streak * 10)); // Bonus points for streak
      
      // Check for level up after adding streak (streak + 1)
      const newStreak = streak + 1;
      if (newStreak === 5) {
        setLevelUpText("LEVEL UP: Menengah (MOTS)");
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      } else if (newStreak === 10) {
        setLevelUpText("LEVEL UP: Sulit (HOTS)");
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    } else {
      playSound('incorrect');
      resetStreak();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    if (showReview) {
      return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
          <button 
            onClick={() => setShowReview(false)}
            className="flex items-center gap-2 font-bold mb-6 hover:text-primary transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" /> Kembali ke Skor
          </button>
          
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <BookOpen className="text-primary w-8 h-8" /> Pratinjau Jawaban
          </h2>
          
          <div className="space-y-6">
            {userAnswers.map((ans, idx) => (
              <div key={idx} className="glass-panel p-6 border-l-4" style={{ borderLeftColor: ans.isCorrect ? '#22c55e' : '#ef4444' }}>
                <h3 className="text-xl font-bold mb-4">{idx + 1}. {ans.question}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-surface/50 p-4 rounded-xl border border-glass-border">
                    <span className="text-xs uppercase font-bold opacity-60 mb-1 block">Jawaban Kamu:</span>
                    <span className={`font-bold ${ans.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {ans.selectedOptionText}
                    </span>
                  </div>
                  {!ans.isCorrect && (
                    <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                      <span className="text-xs uppercase font-bold text-green-600 dark:text-green-400 mb-1 block">Kunci Jawaban:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {ans.correctOptionText}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <span className="text-xs uppercase font-bold text-primary mb-1 block">Pembahasan:</span>
                  <p className="text-on-surface opacity-90">{ans.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto text-center mt-12 animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 pointer-events-none"></div>
          
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-4xl font-black mb-2">Evaluasi Selesai!</h2>
          <p className="text-lg opacity-80 mb-8">Kamu telah menyelesaikan {questions.length} soal.</p>
          
          <div className="bg-surface/80 p-6 rounded-2xl mb-8 border border-glass-border">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Poin Sesi Ini</h3>
            <div className="text-5xl font-black text-on-surface">{sessionScore}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/')} className="px-8 py-3 rounded-xl bg-glass border border-glass-border font-bold hover:bg-white/20 transition-all">
              Tutup
            </button>
            <button onClick={() => setShowReview(true)} className="px-8 py-3 rounded-xl bg-surface border border-primary text-primary font-bold hover:bg-primary/10 transition-all">
              Pratinjau Jawaban
            </button>
            <button onClick={() => navigate('/leaderboard')} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Lihat Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto relative pt-4 pb-20">
      
      {/* Level Up Popup Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center bg-surface/90 backdrop-blur-xl p-10 rounded-3xl border border-glass-border shadow-2xl">
              <Flame className={`w-32 h-32 mx-auto animate-pulse ${getFireColor()}`} />
              <h2 className="text-3xl font-black mt-4 text-on-surface">{levelUpText}</h2>
              <p className="font-bold text-primary mt-2">Soal akan semakin menantang!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">
            Level: {currentQ.level}
          </span>
          <div className="text-on-surface font-bold opacity-70">
            Soal {currentIndex + 1} dari {questions.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-glass-border shadow-sm">
          <Flame className={`w-6 h-6 ${streak > 0 ? getFireColor() : 'text-slate-300'} ${streak > 0 ? 'animate-pulse' : ''}`} />
          <span className="font-black text-lg">{streak} Streak</span>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 relative overflow-hidden transition-all duration-300">
        <h3 className="text-2xl md:text-3xl font-bold leading-relaxed mb-8">
          {currentQ.question}
        </h3>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "border-glass-border bg-surface/50 hover:bg-glass text-on-surface";
            
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) {
                btnClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] ring-1 ring-green-500";
              } else if (idx === selectedOption) {
                btnClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 opacity-70 ring-1 ring-red-500";
              } else {
                btnClass = "border-glass-border opacity-40";
              }
            } else if (idx === selectedOption) {
              btnClass = "border-primary bg-primary/10 text-primary ring-2 ring-primary shadow-inner";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 text-lg ${btnClass}`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation Box */}
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-6 p-6 rounded-2xl border-2 ${isCorrect ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}
          >
            <h4 className={`font-black flex items-center gap-2 mb-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect ? <CheckCircle2 className="w-6 h-6"/> : <XCircle className="w-6 h-6"/>}
              {isCorrect ? 'Tepat Sekali!' : 'Ops, Kurang Tepat!'}
            </h4>
            <div className="bg-surface/50 p-4 rounded-xl mt-3">
              <span className="text-xs uppercase font-bold text-primary mb-1 block">Pembahasan:</span>
              <p className="text-on-surface opacity-90 leading-relaxed font-medium">
                {currentQ.explanation || "Pembahasan spesifik untuk soal ini belum tersedia."}
              </p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-end">
          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-8 py-3 rounded-xl bg-primary text-white font-bold disabled:opacity-50 transition-all hover:bg-primary/90 shadow-md"
            >
              Kunci Jawaban
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-xl bg-on-background text-background font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
            >
              {currentIndex < questions.length - 1 ? 'Soal Selanjutnya' : 'Selesai'} 
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Visual Indicator of Progress */}
      <div className="mt-8 flex gap-1 h-2">
        {questions.map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full ${i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-primary/50 animate-pulse' : 'bg-glass-border'}`}
          ></div>
        ))}
      </div>
    </main>
  );
}

