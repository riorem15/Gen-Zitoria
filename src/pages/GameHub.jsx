import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const games = [
  { id: 'flashcards', path: '/games/flashcards', title: 'Flashcards', desc: 'Uji memori cepatmu! Ketik jawaban → kartu balik → dapat respons AI', icon: '🃏', color: 'from-violet-500 to-purple-600', badge: 'Memori' },
  { id: 'matching', path: '/games/matching', title: 'Cocokkan Jawaban', desc: 'Pasangkan soal dengan jawabannya yang tepat! 5 soal per tema.', icon: '🔗', color: 'from-blue-500 to-cyan-600', badge: 'Logika' },
  { id: 'wordbuilder', path: '/games/wordbuilder', title: 'Susun Kata', desc: 'Susun blok huruf acak menjadi kata kunci sejarah yang tepat!', icon: '🔤', color: 'from-emerald-500 to-green-600', badge: 'Kosakata' },
  { id: 'chronology', path: '/games/chronology', title: 'Kronologi', desc: 'Urutkan peristiwa sejarah dari yang paling awal hingga terbaru!', icon: '⏱️', color: 'from-orange-500 to-amber-600', badge: 'Urutan' },
];

export default function GameHub() {
  const navigate = useNavigate();
  const { gamePoints } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-2 pb-24 px-4 animate-in fade-in duration-500">
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2">
            🎮 <span className="text-gen">Play</span> <span className="text-zitoria">Game Histori</span>
          </h2>
          <p className="opacity-70">Belajar sejarah lewat permainan seru dan menantang!</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-xl">
            <span className="text-2xl">⭐</span>
            <span className="font-black text-primary text-xl">{gamePoints}</span>
            <span className="text-sm font-bold opacity-60">Poin Game</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(game.path)}
            className="glass-panel p-6 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}/>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{game.icon}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${game.color} text-white shadow-md`}>
                  {game.badge}
                </span>
              </div>
              <h3 className="text-xl font-black mb-2">{game.title}</h3>
              <p className="text-sm opacity-70 mb-4">{game.desc}</p>
              <button className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${game.color} text-white font-bold shadow-md group-hover:shadow-lg transition-shadow`}>
                Mulai Main →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
