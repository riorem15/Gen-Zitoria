import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BookOpen, Flame, Medal, ArrowRight } from 'lucide-react';

const Tutorial = () => {
  const navigate = useNavigate();
  const { setHasSeenTutorial } = useStore();

  const handleFinishTutorial = () => {
    setHasSeenTutorial(true);
    navigate('/assessment'); // Pindah ke pemilihan level
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-secondary" />,
      title: "Materi Kronologis",
      desc: "Pelajari sejarah secara berurutan. Kuasai satu bab untuk membuka bab berikutnya. Baca penuh atau sekilas sebagai pratinjau."
    },
    {
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      title: "Sistem Streak & Level",
      desc: "Jawab 5 soal benar beruntun untuk memunculkan api Streak. Terus beruntun untuk naik ke level soal Menengah (MOTS) dan Sulit (HOTS)!"
    },
    {
      icon: <Medal className="w-8 h-8 text-yellow-500" />,
      title: "Leaderboard Global",
      desc: "Uji kecepatan dan ketepatanmu. Kumpulkan poin terbanyak dan raih posisi puncak di Leaderboard Gen Zitoria."
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
      
      <div className="glass-panel p-8 md:p-12 max-w-3xl w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-headline-lg font-bold mb-4">Selamat Datang di <span className="text-gen">Gen Zitoria</span></h1>
          <p className="text-body-lg opacity-80">Platform cerdas yang akan menyesuaikan cara belajarmu dengan kemampuanmu.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-glass-border hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-surface w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
              <p className="text-sm opacity-80 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleFinishTutorial}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            Mulai Perjalanan <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
