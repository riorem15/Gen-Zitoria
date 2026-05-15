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
      else handleShowResult();
    }
  };


  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const finalCorrect = correctCount + matchScore;
  const finalScore = Math.round((finalCorrect / totalQ) * 100);
  const passed = finalScore >= evalData.passingScore;

  const getPerformanceFeedback = () => {
    if (finalScore >= 95) {
      return `Luar biasa! Kamu sudah menguasai materi ini di atas 98% pengguna Zitora lainnya. Pengetahuanmu tentang ${phaseId === 'fase_e' ? 'Praaksara hingga Islam' : 'Kolonialisme hingga Modern'} sangat mendalam!`;
    }
    if (finalScore >= 85) {
      return `Bagus sekali! Kamu berada di kelompok 15% pengguna teratas. Sedikit lagi menuju sempurna, kamu hanya perlu mempertajam detail pada beberapa bagian.`;
    }
    if (finalScore >= 70) {
      return `Selamat, kamu Lulus! Kamu sudah melampaui ambang batas. Namun, kami menyarankan kamu mengulas kembali bagian yang salah untuk benar-benar menguasai fase ini sebelum lanjut ke fase berikutnya.`;
    }
    return `Kamu belum berhasil mencapai ambang batas kelulusan. Jangan menyerah! Nilaimu saat ini berada di bawah rata-rata pengguna. Fokuslah pada materi yang belum kamu kuasai dan coba lagi.`;
  };

  const handleShowResult = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setPhase('result');
    }, 2500);
  };

  const handleMatchDone = (got, total) => {
    setMatchScore(got);
    addGamePoints(got * 50);
    handleShowResult();
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center bg-primary/5">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg"
          >
            AI ANALYZING
          </motion.div>
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-black">Menganalisis Performa...</h3>
          <p className="text-sm opacity-60 max-w-xs mx-auto">Algoritma Zitora sedang memproses jawabanmu untuk memberikan feedback yang akurat.</p>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const label = (finalScore >= evalData.excellentScore) ? { text: 'TERBAIK', color: 'text-yellow-500' } :
                  (finalScore >= evalData.goodScore) ? { text: 'BAIK', color: 'text-green-500' } :
                  (finalScore >= evalData.passingScore) ? { text: 'CUKUP', color: 'text-blue-500' } :
                  { text: 'PERLU BELAJAR LAGI', color: 'text-red-500' };

    if (passed) markPhaseComplete(phaseId);
    const stamp = phaseId === 'fase_e' ? STAMP_E : STAMP_F;

    return (
      <div className="max-w-lg mx-auto text-center pt-6 pb-24 px-4 animate-in fade-in">
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none"/>
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
          <h2 className="text-3xl font-black mb-1">{evalData.title}</h2>
          
          <div className="my-6">
            <p className="text-5xl font-black text-primary">{finalScore}<span className="text-2xl">/100</span></p>
            <p className={`text-xl font-black mt-2 ${label.color}`}>{label.text}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"/>
              <span className="text-[10px] font-black tracking-widest opacity-50 uppercase">Analisis Performa</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{getPerformanceFeedback()}</p>
          </div>

          <p className="text-xs opacity-50 mb-6">{finalCorrect} dari {totalQ} soal dijawab dengan benar</p>

          {passed && (
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: -15 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mx-auto mb-8 w-fit opacity-90 drop-shadow-2xl">
              {stamp}
            </motion.div>
          )}

          {!passed && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-left">
              <p className="text-xs font-bold text-red-500 mb-1">AMBANG BATAS BELUM TERCAPAI</p>
              <p className="text-xs opacity-70">
                Kamu memerlukan minimal skor <strong>{evalData.passingScore}</strong> untuk membuka fase berikutnya. Silakan ulas materi kembali.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 relative z-10">
            <button onClick={() => navigate('/evaluation')} className="px-8 py-3 rounded-xl bg-glass border border-glass-border font-bold hover:bg-white/10 transition-all text-sm">
              Kembali ke Menu Evaluasi
            </button>
            {!passed && (
              <button onClick={() => { setCurrentIndex(0); setSelected(null); setIsAnswered(false); setCorrectCount(0); setMatchScore(0); setPhase('quiz'); }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20">
                <RotateCcw className="w-4 h-4"/> Coba Ujian Lagi
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
