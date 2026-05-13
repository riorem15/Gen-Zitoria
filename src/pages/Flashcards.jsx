import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ThumbsUp, ThumbsDown, Layers } from 'lucide-react';
import { questionBank } from '../data/questions';
import { useStore } from '../store/useStore';

// Filter only PG questions outside component for stable reference
const pgQuestions = questionBank.filter(q => q.type === 'pg' && Array.isArray(q.options));

export default function Flashcards() {
  const { updateQuestProgress } = useStore();
  const [cards, setCards] = useState(() => [...pgQuestions].sort(() => 0.5 - Math.random()).slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  const currentCard = cards[currentIndex];

  const handleNext = (knewIt) => {
    if (knewIt) setScore(score + 1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 150);
  };

  const resetGame = () => {
    setCards(() => [...pgQuestions].sort(() => 0.5 - Math.random()).slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setIsFlipped(false);
  };

  if (currentIndex >= cards.length) {
    updateQuestProgress(3); // Trigger quest completion when flashcards are done
    return (
      <div className="max-w-md mx-auto space-y-6 pt-10 pb-20 text-center animate-in fade-in">
        <h2 className="text-4xl font-black text-gen mb-4">Latihan Selesai!</h2>
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        <p className="text-xl mb-8">Skor Daya Ingatmu: <strong className="text-primary">{score}/{cards.length}</strong></p>
        <button 
          onClick={resetGame}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <RefreshCcw className="w-5 h-5" /> Main Lagi
        </button>
      </div>
    );
  }

  const correctAnswerText = currentCard.correctAnswer;

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4 md:pt-10 pb-20 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black mb-2 flex items-center justify-center gap-2">
          <Layers className="text-primary" />
          <span className="text-gen">Flash</span>cards
        </h2>
        <p className="opacity-70 text-sm">Uji ingatan cepatmu. Ketuk kartu untuk melihat jawaban.</p>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm font-bold opacity-50 px-2">
        <span>Kartu {currentIndex + 1} dari {cards.length}</span>
        <span>Skor: {score}</span>
      </div>

      <div className="relative w-full aspect-[3/4] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, rotateY: 0 }}
            animate={{ opacity: 1, x: 0, rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full h-full relative preserve-3d cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center backface-hidden shadow-xl border border-primary/20 hover:border-primary/50 transition-colors">
              <span className="text-5xl mb-6 opacity-80 group-hover:scale-110 transition-transform">🤔</span>
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-on-surface">{currentCard.question}</h3>
              <p className="absolute bottom-6 text-xs font-bold uppercase tracking-widest opacity-40">Ketuk untuk membalik</p>
            </div>

            {/* Back of card */}
            <div 
              className="absolute w-full h-full glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center backface-hidden shadow-xl border-2 border-primary/50 bg-primary/5"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-5xl mb-6 opacity-80">💡</span>
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-primary drop-shadow-sm">{correctAnswerText}</h3>
              <p className="absolute bottom-6 text-xs font-bold uppercase tracking-widest opacity-40">Tentukan Pilihanmu</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons visible only when flipped */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center gap-4 mt-8"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(false); }}
              className="flex-1 py-4 bg-surface rounded-2xl border border-error/30 text-error font-bold flex flex-col items-center gap-2 hover:bg-error/10 hover:border-error transition-all shadow-sm"
            >
              <ThumbsDown className="w-6 h-6" /> Lupa
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(true); }}
              className="flex-1 py-4 bg-surface rounded-2xl border border-success/30 text-green-500 font-bold flex flex-col items-center gap-2 hover:bg-success/10 hover:border-success transition-all shadow-sm"
            >
              <ThumbsUp className="w-6 h-6" /> Ingat
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
