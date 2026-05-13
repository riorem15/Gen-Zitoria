import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { chronologyLevels } from '../../data/gamesData';
import { useStore } from '../../store/useStore';
import { RefreshCcw, CheckCircle2 } from 'lucide-react';

export default function ChronologyGame() {
  const { addGamePoints } = useStore();
  const [levelIndex, setLevelIndex] = useState(0);
  const level = chronologyLevels[levelIndex];
  const [items, setItems] = useState(() => [...level.events].sort(() => 0.5 - Math.random()));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleCheck = () => {
    const res = items.map((item, idx) => ({ ...item, correct: item.order === idx + 1 }));
    const correct = res.filter(r => r.correct).length;
    setResults(res);
    setChecked(true);
    setScore(s => s + correct);
    addGamePoints(correct * 30);
  };

  const handleNext = () => {
    if (levelIndex >= chronologyLevels.length - 1) { setDone(true); return; }
    const nextLevel = chronologyLevels[levelIndex + 1];
    setLevelIndex(i => i + 1);
    setItems([...nextLevel.events].sort(() => 0.5 - Math.random()));
    setChecked(false);
    setResults([]);
  };

  if (done) return (
    <div className="max-w-md mx-auto text-center pt-10 pb-24 px-4 animate-in fade-in">
      <div className="glass-panel p-10">
        <div className="text-6xl mb-4">⏱️</div>
        <h2 className="text-3xl font-black mb-2">Brilian!</h2>
        <p className="mb-2">Kamu benar <strong className="text-primary">{score}</strong> dari {chronologyLevels.reduce((a, l) => a + l.events.length, 0)} urutan</p>
        <p className="text-4xl font-black text-primary mb-6">+{score * 30} Poin</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold flex items-center gap-2 mx-auto">
          <RefreshCcw className="w-5 h-5"/> Main Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto pt-2 pb-24 px-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">⏱️ Kronologi</h2>
        <span className="text-sm font-bold opacity-50">Level {levelIndex + 1}/{chronologyLevels.length}</span>
      </div>

      <div className="glass-panel p-5 rounded-2xl">
        <h3 className="font-black text-primary mb-1">{level.theme}</h3>
        <p className="text-sm opacity-70">{level.instruction}</p>
        {!checked && <p className="text-xs mt-2 opacity-50 font-bold">💡 Geser kartu untuk mengurutkan</p>}
      </div>

      <Reorder.Group axis="y" values={items} onReorder={!checked ? setItems : () => {}}>
        {items.map((item, idx) => {
          const res = results.find(r => r.id === item.id);
          return (
            <Reorder.Item key={item.id} value={item}
              className={`glass-panel p-4 rounded-xl mb-2 border-2 cursor-grab active:cursor-grabbing transition-all ${
                checked
                  ? res?.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                  : 'border-glass-border hover:border-primary/40'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                  checked
                    ? res?.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    : 'bg-primary/20 text-primary'
                }`}>
                  {checked ? (res?.correct ? '✓' : item.order) : idx + 1}
                </div>
                <div>
                  <p className="font-bold text-sm leading-snug">{item.text}</p>
                  {checked && <p className="text-xs opacity-60 mt-0.5">{item.year}</p>}
                </div>
                {checked && res?.correct && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0"/>}
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {!checked ? (
        <button onClick={handleCheck} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg hover:shadow-xl transition-all">
          ✅ Cek Urutan
        </button>
      ) : (
        <button onClick={handleNext} className="w-full py-3 rounded-xl bg-on-background text-background font-bold hover:scale-105 transition-all shadow-lg">
          {levelIndex < chronologyLevels.length - 1 ? 'Level Berikutnya →' : '🏁 Lihat Hasil'}
        </button>
      )}
    </div>
  );
}
