import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const LevelSelection = () => {
  const navigate = useNavigate();
  const { setInitialLevel } = useStore();

  const handleSelect = (level) => {
    setInitialLevel(level);
    navigate('/');
  };

  const levels = [
    {
      level: 0,
      title: "Pemula",
      desc: "Saya tidak tahu apa-apa tentang sejarah",
      gradient: "from-green-400 to-green-50",
      textColor: "text-green-900"
    },
    {
      level: 1,
      title: "Penjelajah",
      desc: "Saya paham sedikit sejarah",
      gradient: "from-red-800 to-yellow-400",
      textColor: "text-white"
    },
    {
      level: 2,
      title: "Sejarawan Muda",
      desc: "Saya paham sejarah",
      gradient: "from-blue-600 to-orange-400",
      textColor: "text-white"
    },
    {
      level: 3,
      title: "Master Sejarah",
      desc: "Saya mendalami sejarah",
      gradient: "from-purple-700 to-pink-500",
      textColor: "text-white"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-headline-lg font-bold mb-4">Seberapa jauh kamu mengenal masa lalu?</h1>
          <p className="text-body-lg opacity-80">Pilih level awalmu untuk menyesuaikan perjalanan sejarahmu di Gen Zitoria.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {levels.map((item) => (
            <button
              key={item.level}
              onClick={() => handleSelect(item.level)}
              className={`relative group rounded-[2rem] p-8 text-left transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl overflow-hidden bg-gradient-to-br ${item.gradient} backdrop-blur-md`}
              style={{ minHeight: '300px' }}
            >
              {/* Glass overlay effect for bubble style */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className={`text-4xl font-bold mb-2 opacity-30 ${item.textColor}`}>Level {item.level}</div>
                  <h3 className={`text-2xl font-bold mb-4 ${item.textColor}`}>{item.title}</h3>
                </div>
                <p className={`text-lg font-medium leading-relaxed ${item.textColor}`}>"{item.desc}"</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
