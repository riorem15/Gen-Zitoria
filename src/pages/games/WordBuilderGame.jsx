import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wordBuildQuestions } from '../../data/gamesData';
import { useStore } from '../../store/useStore';
import { RefreshCcw, Delete } from 'lucide-react';

export default function WordBuilderGame() {
  const { addGamePoints } = useStore();
  const [qIndex, setQIndex] = useState(0);
  const [built, setBuilt] = useState([]);
  const [used, setUsed] = useState([]);
  const [status, setStatus] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = wordBuildQuestions[qIndex];
  const shuffled = useState(() => [...q.shuffledLetters].map((l, i) => ({ l, i })))[0];

  const handleLetter = (letter, idx) => {
    if (used.includes(idx) || status) return;
    setBuilt(b => [...b, { letter, idx }]);
    setUsed(u => [...u, idx]);
  };

  const handleDelete = () => {
    if (!built.length || status) return;
    const last = built[built.length - 1];
    setBuilt(b => b.slice(0, -1));
    setUsed(u => u.filter(i => i !== last.idx));
  };

  const handleCheck = () => {
    const answer = built.map(b => b.letter).join('');
    if (answer === q.answer) {
      setStatus('correct');
      setScore(s => s + 1);
      addGamePoints(75);
      setTimeout(() => {
        if (qIndex >= wordBuildQuestions.length - 1) { setDone(true); return; }
        setQIndex(i => i + 1);
        setBuilt([]); setUsed([]); setStatus(null);
      }, 1200);
    } else {
      setStatus('wrong');
      setTimeout(() => { setBuilt([]); setUsed([]); setStatus(null); }, 1000);
    }
  };

  if (done) return (
    <div className="max-w-md mx-auto text-center pt-10 pb-24 px-4 animate-in fade-in">
      <div className="glass-panel p-10">
        <div className="text-6xl mb-4">🔤</div>
        <h2 className="text-3xl font-black mb-2">Keren!</h2>
        <p className="mb-2">Kamu berhasil menyusun <strong className="text-primary">{score}/{wordBuildQuestions.length}</strong> kata</p>
        <p className="text-4xl font-black text-primary mb-6">+{score * 75} Poin</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold flex items-center gap-2 mx-auto">
          <RefreshCcw className="w-5 h-5"/> Main Lagi
        </button>
      </div>
    </div>
  );

  const bgColor = status === 'correct' ? 'border-green-500 bg-green-500/10' : status === 'wrong' ? 'border-red-500 bg-red-500/10' : 'border-glass-border';

  return (
    <div className="max-w-md mx-auto pt-2 pb-24 px-4 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">🔤 Susun Kata</h2>
        <span className="text-sm font-bold opacity-50">{qIndex + 1}/{wordBuildQuestions.length} • ⭐ {score * 75}</span>
      </div>

      <div className={`glass-panel p-5 rounded-2xl border-2 transition-all duration-300 ${bgColor}`}>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{q.theme}</span>
        <p className="font-bold text-base mt-2 leading-relaxed">{q.question}</p>
        <p className="text-sm opacity-50 mt-1 font-mono tracking-widest">{q.hint}</p>
      </div>

      {/* Answer display */}
      <div className="flex flex-wrap gap-2 min-h-[52px] p-3 bg-surface/50 rounded-2xl border-2 border-glass-border items-center">
        <AnimatePresence>
          {built.map((b, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md ${
                status === 'correct' ? 'bg-green-500' : status === 'wrong' ? 'bg-red-500' : 'bg-primary'
              }`}>
              {b.letter}
            </motion.div>
          ))}
        </AnimatePresence>
        {built.length === 0 && <span className="text-sm opacity-40 font-bold">Pilih huruf di bawah...</span>}
      </div>

      {/* Letter blocks */}
      <div className="flex flex-wrap gap-2 justify-center">
        {shuffled.map(({ l, i }) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }}
            onClick={() => handleLetter(l, i)}
            disabled={used.includes(i) || !!status}
            className={`w-11 h-11 rounded-xl font-black text-sm shadow-md border-2 transition-all ${
              used.includes(i)
                ? 'opacity-20 border-glass-border bg-surface/30 cursor-not-allowed'
                : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary cursor-pointer'
            }`}>
            {l}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={handleDelete} disabled={!built.length || !!status}
          className="flex-1 py-3 rounded-xl border-2 border-glass-border font-bold flex items-center justify-center gap-2 hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-30">
          <Delete className="w-4 h-4"/> Hapus
        </button>
        <button onClick={handleCheck} disabled={built.length === 0 || !!status}
          className="flex-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg disabled:opacity-40 hover:shadow-xl transition-all">
          {status === 'correct' ? '✅ Benar!' : status === 'wrong' ? '❌ Coba Lagi' : 'Cek Jawaban'}
        </button>
      </div>
    </div>
  );
}
