import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchingQuestions } from '../../data/gamesData';
import { useStore } from '../../store/useStore';
import { RefreshCcw, ChevronRight } from 'lucide-react';

export default function MatchingGame() {
  const { addGamePoints } = useStore();
  const [themeIndex, setThemeIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const theme = matchingQuestions[themeIndex];
  const shuffledAnswers = [...theme.pairs].sort(() => 0.5 - Math.random());
  const [answers] = useState(() => [...theme.pairs].sort(() => 0.5 - Math.random()));

  const isMatchedLeft = (id) => matched.some(m => m.leftId === id);
  const isMatchedRight = (answerId) => matched.some(m => m.rightId === answerId);

  const handleRight = (pair) => {
    if (!selectedLeft) return;
    if (pair.id === selectedLeft.id) {
      const newMatched = [...matched, { leftId: selectedLeft.id, rightId: pair.id }];
      setMatched(newMatched);
      setSelectedLeft(null);
      setScore(s => s + 1);
      addGamePoints(50);
      if (newMatched.length === theme.pairs.length) {
        const pts = newMatched.length * 50;
        setTotalScore(t => t + pts);
        setTimeout(() => {
          if (themeIndex < matchingQuestions.length - 1) {
            setThemeIndex(i => i + 1);
            setMatched([]);
            setSelectedLeft(null);
            setScore(0);
          } else setDone(true);
        }, 800);
      }
    } else {
      setWrong(pair.id);
      setTimeout(() => setWrong(null), 800);
      setSelectedLeft(null);
    }
  };

  if (done) return (
    <div className="max-w-md mx-auto text-center pt-10 pb-24 px-4 animate-in fade-in">
      <div className="glass-panel p-10">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-black mb-2">Selesai!</h2>
        <p className="text-4xl font-black text-primary mb-6">+{totalScore} Poin</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold flex items-center gap-2 mx-auto">
          <RefreshCcw className="w-5 h-5"/> Main Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pt-2 pb-24 px-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">🔗 Cocokkan Jawaban</h2>
        <span className="text-sm font-bold opacity-50">Tema {themeIndex + 1}/{matchingQuestions.length}</span>
      </div>

      <div className="glass-panel p-4">
        <h3 className="font-black text-center text-primary mb-1">{theme.theme}</h3>
        <p className="text-xs text-center opacity-60">Klik soal di kiri, lalu klik jawaban yang cocok di kanan</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left - Questions */}
        <div className="space-y-2">
          <p className="text-xs font-bold opacity-50 text-center uppercase">Soal</p>
          {theme.pairs.map(pair => (
            <motion.button key={pair.id} onClick={() => !isMatchedLeft(pair.id) && setSelectedLeft(pair)}
              whileTap={{ scale: 0.97 }}
              className={`w-full p-3 rounded-xl border-2 text-left text-sm font-bold transition-all ${
                isMatchedLeft(pair.id) ? 'border-green-500 bg-green-500/10 text-green-600 opacity-70' :
                selectedLeft?.id === pair.id ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary' :
                'border-glass-border bg-surface/50 hover:border-primary/50'
              }`}>
              {pair.question}
            </motion.button>
          ))}
        </div>

        {/* Right - Answers */}
        <div className="space-y-2">
          <p className="text-xs font-bold opacity-50 text-center uppercase">Jawaban</p>
          {answers.map(pair => (
            <AnimatePresence key={pair.id}>
              <motion.button onClick={() => !isMatchedRight(pair.id) && handleRight(pair)}
                whileTap={{ scale: 0.97 }}
                animate={wrong === pair.id ? { x: [0, -8, 8, -8, 0] } : {}}
                className={`w-full p-3 rounded-xl border-2 text-left text-sm font-bold transition-all ${
                  isMatchedRight(pair.id) ? 'border-green-500 bg-green-500/10 text-green-600 opacity-70' :
                  wrong === pair.id ? 'border-red-500 bg-red-500/10 text-red-500' :
                  selectedLeft ? 'border-blue-400/50 bg-blue-500/5 hover:border-blue-500 hover:bg-blue-500/10 cursor-pointer' :
                  'border-glass-border bg-surface/50 opacity-50 cursor-not-allowed'
                }`}>
                {pair.answer}
              </motion.button>
            </AnimatePresence>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {theme.pairs.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < matched.length ? 'bg-green-500 scale-110' : 'bg-glass-border'}`}/>
        ))}
      </div>
    </div>
  );
}
