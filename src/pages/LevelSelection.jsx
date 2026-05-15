import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Sparkles, Compass, GraduationCap, Crown } from 'lucide-react';

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
      icon: <Sparkles className="w-8 h-8" />,
      desc: "Baru ingin mengenal sejarah dengan cara yang asyik dan ringan.",
      gradient: "from-[#FAD961] to-[#F76B1C]",
      shadow: "shadow-orange-200",
      features: ["Fokus pada fakta menarik", "Bahasa santai & banyak emoji", "Kuis LOTS (Dasar)"]
    },
    {
      level: 1,
      title: "Penjelajah",
      icon: <Compass className="w-8 h-8" />,
      desc: "Ingin menelusuri alur waktu dan kronologi sejarah lebih dalam.",
      gradient: "from-[#85FFBD] to-[#FFFB7D]",
      shadow: "shadow-green-200",
      features: ["Fokus pada kronologi", "Analisis sebab-akibat ringan", "Campuran LOTS & MOTS"]
    },
    {
      level: 2,
      title: "Sejarawan Muda",
      icon: <GraduationCap className="w-8 h-8" />,
      desc: "Siap menganalisis konteks sosial, politik, dan ekonomi masa lalu.",
      gradient: "from-[#21D4FD] to-[#B721FF]",
      shadow: "shadow-blue-200",
      features: ["Analisis mendalam", "Konteks sosiopolitik", "Kuis MOTS & HOTS"]
    },
    {
      level: 3,
      title: "Master Sejarah",
      icon: <Crown className="w-8 h-8" />,
      desc: "Ingin mengkaji historiografi, filosofi, dan interpretasi kritis.",
      gradient: "from-[#00DBDE] to-[#FC00FF]",
      shadow: "shadow-purple-200",
      features: ["Kritik historiografi", "Perspektif multidimensi", "Kuis Murni HOTS"]
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Pilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Level Perjalananmu</span>
          </h1>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Zitoria akan menyesuaikan materi dan tantangan berdasarkan level yang kamu pilih. Tenang, kamu bisa berubah seiring waktu!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {levels.map((item, index) => (
            <motion.button
              key={item.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(item.level)}
              className={`group relative rounded-[2.5rem] p-8 text-left transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl overflow-hidden bg-white dark:bg-surface border-2 border-transparent hover:border-white/20`}
              style={{ minHeight: '400px' }}
            >
              {/* Gradient Header */}
              <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${item.gradient} opacity-90 group-hover:h-full transition-all duration-700`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  {item.icon}
                </div>
                
                <div className="mt-2 transition-colors duration-500 group-hover:text-white">
                  <div className="text-sm font-black uppercase tracking-widest opacity-60 mb-1">Level {item.level}</div>
                  <h3 className="text-3xl font-black mb-4">{item.title}</h3>
                  <p className="text-lg font-medium leading-relaxed mb-8 opacity-90">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-black/10 group-hover:border-white/20">
                  <ul className="space-y-3">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-bold opacity-80 group-hover:text-white transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
