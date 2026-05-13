import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { phaseEvaluations } from '../../data/evaluationData';
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';

const STAMP_E = (
  <svg viewBox="0 0 200 200" className="w-40 h-40">
    <circle cx="100" cy="100" r="90" fill="none" stroke="#dc2626" strokeWidth="6"/>
    <circle cx="100" cy="100" r="78" fill="none" stroke="#dc2626" strokeWidth="2"/>
    <text x="100" y="85" textAnchor="middle" fill="#dc2626" fontSize="16" fontWeight="bold" fontFamily="serif">FASE E</text>
    <text x="100" y="115" textAnchor="middle" fill="#dc2626" fontSize="28" fontWeight="900" fontFamily="serif">SELESAI</text>
    <text x="100" y="140" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="serif">GEN ZITORIA</text>
  </svg>
);

const STAMP_F = (
  <svg viewBox="0 0 200 200" className="w-40 h-40">
    <circle cx="100" cy="100" r="90" fill="none" stroke="#dc2626" strokeWidth="6"/>
    <circle cx="100" cy="100" r="78" fill="none" stroke="#dc2626" strokeWidth="2"/>
    <text x="100" y="85" textAnchor="middle" fill="#dc2626" fontSize="16" fontWeight="bold" fontFamily="serif">FASE F</text>
    <text x="100" y="115" textAnchor="middle" fill="#dc2626" fontSize="28" fontWeight="900" fontFamily="serif">SELESAI</text>
    <text x="100" y="140" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="serif">GEN ZITORIA</text>
  </svg>
);

function MatchingSection({ pairs, onAnswer }) {
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const shuffled = useState(() => [...pairs].sort(() => 0.5 - Math.random()))[0];

  const handleRight = (pair) => {
    if (!leftSel) return;
    if (pair.left === leftSel.left) {
      const nm = [...matched, pair.left];
      setMatched(nm);
      setLeftSel(null);
      if (nm.length === pairs.length) onAnswer(nm.length, pairs.length);
    } else {
      setWrong(pair.left);
      setTimeout(() => setWrong(null), 600);
      setLeftSel(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <p className="text-xs font-bold opacity-50 text-center">Istilah</p>
        {pairs.map(p => (
          <button key={p.left} onClick={() => !matched.includes(p.left) && setLeftSel(p)}
            className={`w-full p-3 rounded-xl border-2 text-left text-sm font-bold transition-all ${matched.includes(p.left) ? 'border-green-500 bg-green-500/10 text-green-600' : leftSel?.left === p.left ? 'border-primary bg-primary/10 text-primary' : 'border-glass-border bg-surface/50 hover:border-primary/50'}`}>
            {p.left}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold opacity-50 text-center">Keterangan</p>
        {shuffled.map(p => (
          <motion.button key={p.right} onClick={() => !matched.includes(p.left) && handleRight(p)}
            animate={wrong === p.left ? { x: [0, -6, 6, -6, 0] } : {}}
            className={`w-full p-3 rounded-xl border-2 text-left text-sm font-bold transition-all ${matched.includes(p.left) ? 'border-green-500 bg-green-500/10 text-green-600' : wrong === p.left ? 'border-red-500 bg-red-500/10 text-red-500' : leftSel ? 'border-blue-400/50 bg-blue-500/5 hover:border-blue-500 cursor-pointer' : 'border-glass-border bg-surface/50 opacity-50 cursor-not-allowed'}`}>
            {p.right}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function PhaseEvaluation({ phaseId }) {
  const navigate = useNavigate();
  const { addGamePoints, markPhaseComplete, completedPhases } = useStore();
  const evalData = phaseEvaluations[phaseId];

  const pgAndTf = evalData.questions.filter(q => q.type !== 'matching');
  const matchQ = evalData.questions.find(q => q.type === 'matching');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'matching' | 'result'

  const totalQ = pgAndTf.length + (matchQ ? matchQ.pairs.length : 0);
  const currentQ = pgAndTf[currentIndex];

  const handleSubmit = () => {
    if (selected === null || isAnswered) return;
    const ok = selected === currentQ.correctAnswer;
    setIsCorrect(ok);
    setIsAnswered(true);
    if (ok) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    if (currentIndex < pgAndTf.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      if (matchQ) setPhase('matching');
      else setPhase('result');
    }
  };

  const handleMatchDone = (got, total) => {
    setMatchScore(got);
    addGamePoints(got * 50);
    setPhase('result');
  };

  const finalCorrect = correctCount + matchScore;
  const finalScore = Math.round((finalCorrect / totalQ) * 100);
  const passed = finalScore >= evalData.passingScore;

  const getLabel = () => {
    if (finalScore >= evalData.excellentScore) return { text: 'TERBAIK', color: 'text-yellow-500' };
    if (finalScore >= evalData.goodScore) return { text: 'BAIK', color: 'text-green-500' };
    if (finalScore >= evalData.passingScore) return { text: 'CUKUP', color: 'text-blue-500' };
    return { text: 'PERLU BELAJAR LAGI', color: 'text-red-500' };
  };

  if (phase === 'result') {
    const label = getLabel();
    if (passed) markPhaseComplete(phaseId);
    const stamp = phaseId === 'fase_e' ? STAMP_E : STAMP_F;

    return (
      <div className="max-w-lg mx-auto text-center pt-6 pb-24 px-4 animate-in fade-in">
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none"/>
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
          <h2 className="text-3xl font-black mb-1">{evalData.title}</h2>
          <p className="text-5xl font-black my-4 text-primary">{finalScore}<span className="text-2xl">/100</span></p>
          <p className={`text-xl font-black mb-2 ${label.color}`}>{label.text}</p>
          <p className="text-sm opacity-60 mb-6">{finalCorrect} dari {totalQ} soal benar</p>

          {passed && (
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: -15 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6 w-fit opacity-90">
              {stamp}
            </motion.div>
          )}

          {!passed && (
            <p className="text-sm opacity-70 mb-6 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              Nilai minimal untuk lulus adalah <strong>{evalData.passingScore}</strong>. Pelajari kembali materinya!
            </p>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/evaluation')} className="px-8 py-3 rounded-xl bg-glass border border-glass-border font-bold hover:bg-white/10 transition-all">
              Kembali ke Evaluasi
            </button>
            {!passed && (
              <button onClick={() => { setCurrentIndex(0); setSelected(null); setIsAnswered(false); setCorrectCount(0); setMatchScore(0); setPhase('quiz'); }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4"/> Coba Lagi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'matching') {
    return (
      <div className="max-w-xl mx-auto pt-2 pb-24 px-4 space-y-4">
        <h3 className="font-black text-xl">🔗 Bagian Cocokkan</h3>
        <p className="text-sm opacity-60">Cocokkan istilah dengan keterangannya yang tepat!</p>
        <MatchingSection pairs={matchQ.pairs} onAnswer={handleMatchDone} />
      </div>
    );
  }

  const progress = Math.round((currentIndex / pgAndTf.length) * 100);

  return (
    <div className="max-w-2xl mx-auto pt-2 pb-24 px-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-black">{evalData.title}</h3>
          <p className="text-sm opacity-60">Soal {currentIndex + 1} dari {pgAndTf.length}</p>
        </div>
        <span className="font-bold text-primary">{correctCount} ✓</span>
      </div>

      <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progress}%` }}/>
      </div>

      <div className="glass-panel p-6">
        <span className={`text-xs font-bold px-2 py-1 rounded-full mb-3 inline-block ${currentQ.type === 'tf' ? 'bg-blue-500/20 text-blue-500' : 'bg-primary/20 text-primary'}`}>
          {currentQ.type === 'tf' ? 'Benar / Salah' : 'Pilihan Ganda'}
        </span>
        <h3 className="text-lg font-bold leading-relaxed mb-6">{currentQ.question}</h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let cls = 'border-glass-border bg-surface/50 hover:bg-glass text-on-surface';
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) cls = 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-bold ring-1 ring-green-500';
              else if (idx === selected) cls = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 opacity-70 ring-1 ring-red-500';
              else cls = 'border-glass-border opacity-40';
            } else if (idx === selected) cls = 'border-primary bg-primary/10 text-primary ring-2 ring-primary';
            return (
              <button key={idx} disabled={isAnswered} onClick={() => setSelected(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${cls}`}>
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0"/>}
                  {isAnswered && idx === selected && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-500 shrink-0"/>}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className={`mt-4 p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-500/10 border-green-500/40' : 'bg-red-500/10 border-red-500/40'}`}>
            <p className="text-sm font-bold">{isCorrect ? '✅ Tepat!' : '❌ Kurang Tepat'}</p>
            <p className="text-sm opacity-80 mt-1">{currentQ.explanation}</p>
          </motion.div>
        )}

        <div className="mt-5 flex justify-end">
          {!isAnswered ? (
            <button onClick={handleSubmit} disabled={selected === null}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold disabled:opacity-40 hover:bg-primary/90 transition-all">
              Kunci Jawaban
            </button>
          ) : (
            <button onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-on-background text-background font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
              {currentIndex < pgAndTf.length - 1 ? 'Lanjut' : matchQ ? 'Ke Bagian Cocokkan' : 'Lihat Hasil'}
              <ArrowRight className="w-4 h-4"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
