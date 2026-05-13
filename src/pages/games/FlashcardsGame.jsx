import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ArrowLeft, Send } from 'lucide-react';
import { questionBank } from '../../data/questions';
import { useStore } from '../../store/useStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const pgQuestions = questionBank.filter(q => q.type === 'pg' && Array.isArray(q.options));

export default function FlashcardsGame() {
  const { addGamePoints, addStreak, updateQuestProgress } = useStore();
  const [cards] = useState(() => [...pgQuestions].sort(() => 0.5 - Math.random()).slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [done, setDone] = useState(false);

  const currentCard = cards[currentIndex];

  const getAIFeedback = async (question, correct, userAns) => {
    setIsLoadingAI(true);
    try {
      if (!API_KEY) { setAiResponse('✨ Terus semangat belajar sejarah!'); return; }
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const match = userAns.trim().toLowerCase() === correct.trim().toLowerCase();
      const prompt = `Kamu adalah Zitoria AI, mentor sejarah yang menyenangkan. Siswa menjawab soal sejarah: "${question}". Jawaban benar: "${correct}". Jawaban siswa: "${userAns}". ${match ? 'Siswa menjawab BENAR!' : 'Siswa menjawab SALAH.'} Berikan respons singkat (1-2 kalimat) yang ${match ? 'memuji dan menambah info menarik' : 'mengoreksi dengan penjelasan singkat yang memotivasi'}. Gunakan bahasa santai.`;
      const result = await model.generateContent(prompt);
      setAiResponse(result.response.text());
    } catch { setAiResponse(isCorrect ? '🎉 Jawaban kamu tepat!' : '💡 Pelajari lagi ya!'); }
    finally { setIsLoadingAI(false); }
  };

  const handleCheck = () => {
    if (!userAnswer.trim() || answered) return;
    const correct = currentCard.correctAnswer.trim().toLowerCase();
    const user = userAnswer.trim().toLowerCase();
    const ok = correct.includes(user) || user.includes(correct) || correct === user;
    setIsCorrect(ok);
    setIsFlipped(true);
    setAnswered(true);
    if (ok) { setScore(s => s + 1); addGamePoints(100); addStreak(); }
    getAIFeedback(currentCard.question, currentCard.correctAnswer, userAnswer);
  };

  const handleNext = () => {
    if (currentIndex >= cards.length - 1) {
      setDone(true);
      updateQuestProgress(3);
      return;
    }
    setCurrentIndex(i => i + 1);
    setIsFlipped(false);
    setUserAnswer('');
    setAiResponse('');
    setAnswered(false);
    setIsCorrect(false);
  };

  if (done) return (
    <div className="max-w-md mx-auto text-center pt-10 pb-24 px-4 animate-in fade-in">
      <div className="glass-panel p-10">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black mb-2">Selesai!</h2>
        <p className="text-xl mb-4">Skor: <strong className="text-primary">{score}/{cards.length}</strong></p>
        <p className="text-4xl font-black text-primary mb-6">+{score * 100} Poin</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center gap-2 mx-auto">
          <RefreshCcw className="w-5 h-5"/> Main Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-4 pt-2 pb-24 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">🃏 Flashcards</h2>
        <span className="text-sm font-bold opacity-50">{currentIndex + 1} / {cards.length} • ⭐ {score * 100}</span>
      </div>

      <div className="relative w-full" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="w-full" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>

            {/* Front */}
            <div className="glass-panel p-8 rounded-3xl min-h-[200px] flex flex-col items-center justify-center text-center border border-primary/20"
              style={{ backfaceVisibility: 'hidden' }}>
              <span className="text-4xl mb-4">🤔</span>
              <h3 className="text-lg font-bold leading-relaxed">{currentCard.question}</h3>
            </div>

            {/* Back */}
            <div className="glass-panel p-8 rounded-3xl min-h-[200px] flex flex-col items-center justify-center text-center border-2 border-primary/50 bg-primary/5 absolute inset-0"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <span className={`text-4xl mb-3 ${isCorrect ? '✅' : '❌'}`}>{isCorrect ? '✅' : '❌'}</span>
              <h3 className="text-xl font-black text-primary mb-2">{currentCard.correctAnswer}</h3>
              {isLoadingAI ? (
                <p className="text-sm opacity-60 animate-pulse">Zitoria AI mengetik...</p>
              ) : (
                <p className="text-sm opacity-80 leading-relaxed">{aiResponse}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {!answered ? (
        <div className="space-y-3">
          <input value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="Ketik jawabanmu di sini..."
            className="w-full bg-surface/50 border border-glass-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
          <button onClick={handleCheck} disabled={!userAnswer.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition-all">
            <Send className="w-4 h-4"/> Cek Jawaban
          </button>
        </div>
      ) : (
        <button onClick={handleNext}
          className="w-full py-3 rounded-xl bg-on-background text-background font-bold hover:scale-105 transition-all shadow-lg">
          {currentIndex < cards.length - 1 ? 'Kartu Berikutnya →' : '🏁 Lihat Hasil'}
        </button>
      )}
    </div>
  );
}
