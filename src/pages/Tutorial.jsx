import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BookOpen, Flame, Medal, ArrowRight, Camera, Mail, MapPin, Gamepad2, Sparkles, Target, Compass, GraduationCap, Crown } from 'lucide-react';

const Tutorial = () => {
  const navigate = useNavigate();
  const { setHasSeenTutorial } = useStore();

  const handleFinishTutorial = () => {
    setHasSeenTutorial(true);
    navigate('/assessment'); 
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
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-green-500" />,
      title: "Game Hub Interaktif",
      desc: "Belajar sejarah tak lagi membosankan! Uji ingatanmu dengan Flashcards, susun kata di Word Builder, dan urutkan peristiwa."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "AI Mentor & Analisis",
      desc: "Dapatkan umpan balik instan dan analisis pembelajaran dari Kecerdasan Buatan yang siap memandu pemahamanmu secara personal."
    },
    {
      icon: <Target className="w-8 h-8 text-rose-500" />,
      title: "Misi Harian & Lencana",
      desc: "Selesaikan misi harian untuk mendapatkan poin dan kumpulkan lencana eksklusif. Jadikan setiap belajarmu penuh pencapaian!"
    }
  ];

  const levels = [
    {
      level: 0,
      title: "Pemula",
      icon: <Sparkles className="w-6 h-6" />,
      desc: "Baru ingin mengenal sejarah dengan cara asyik.",
      gradient: "from-[#FAD961] to-[#F76B1C]",
      features: ["Fokus fakta menarik", "Bahasa santai & emoji", "Kuis LOTS (Dasar)"]
    },
    {
      level: 1,
      title: "Penjelajah",
      icon: <Compass className="w-6 h-6" />,
      desc: "Ingin menelusuri alur waktu dan kronologi.",
      gradient: "from-[#85FFBD] to-[#FFFB7D]",
      features: ["Fokus pada kronologi", "Sebab-akibat ringan", "Campuran LOTS & MOTS"]
    },
    {
      level: 2,
      title: "Sejarawan",
      icon: <GraduationCap className="w-6 h-6" />,
      desc: "Siap menganalisis konteks sosial dan politik.",
      gradient: "from-[#21D4FD] to-[#B721FF]",
      features: ["Analisis mendalam", "Konteks sosiopolitik", "Kuis MOTS & HOTS"]
    },
    {
      level: 3,
      title: "Master",
      icon: <Crown className="w-6 h-6" />,
      desc: "Mengkaji historiografi dan interpretasi kritis.",
      gradient: "from-[#00DBDE] to-[#FC00FF]",
      features: ["Kritik historiografi", "Perspektif multi", "Kuis Murni HOTS"]
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
      
      {/* Modal Container */}
      <div className="bg-surface/90 backdrop-blur-xl max-w-5xl w-full relative z-10 rounded-3xl shadow-glass border border-glass-border overflow-hidden flex flex-col">
        
        {/* Main Content Area */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Selamat Datang di <span className="text-primary">Gen Zitoria</span></h1>
            
            {/* Expanded Professional Explanation & Problem Analysis */}
            <div className="max-w-4xl mx-auto space-y-6 text-base md:text-lg opacity-90 bg-background/50 p-8 rounded-3xl border border-glass-border shadow-sm text-left">
              <p className="leading-relaxed">
                <strong>Gen Zitoria</strong> adalah platform inovatif yang dirancang khusus untuk merevolusi cara generasi Z mempelajari sejarah. 
                Kami menyadari bahwa masalah utama pendidikan dan pembelajaran sejarah saat ini seringkali terjebak pada metode konvensional—sekadar menghafal angka tahun, lokasi, dan nama tokoh tanpa pemahaman makna (LOTS/<em>Lower Order Thinking Skills</em>). 
                Hal ini membuat sejarah terasa statis, membosankan, dan mematikan rasa ingin tahu kritis para siswa.
              </p>
              <p className="leading-relaxed">
                Untuk memecahkan masalah tersebut, Gen Zitoria hadir mengintegrasikan kecerdasan buatan dengan pendekatan <strong>Zone of Proximal Development (ZPD)</strong> dan <strong>Taksonomi Bloom</strong>. 
                Kelebihan utama web ini adalah kemampuannya beradaptasi! Kami tidak hanya sekadar menyajikan materi, tetapi <strong>menyesuaikan tingkat kesulitan</strong> dan gaya belajar sesuai dengan kecepatan penyerapanmu. 
                Kamu akan dibimbing perlahan dari sekadar mengingat fakta dasar hingga mampu menganalisis, mengevaluasi, dan memahami sejarah sebagai narasi hidup (HOTS/<em>Higher Order Thinking Skills</em>).
              </p>
              <div className="inline-block bg-primary/10 text-primary px-8 py-3 rounded-2xl border border-primary/20 font-bold mt-4 shadow-sm text-center w-full md:w-auto">
                ✨ Keunggulan Gen Zitoria: Adaptif, Cerdas, Interaktif, dan Dilengkapi Gamifikasi Menyenangkan.
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-center mb-8">Fitur Unggulan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-background/30 p-6 rounded-2xl border border-glass-border hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="bg-surface w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-5">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feat.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level Showcase */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">4 Tingkatan Level Belajar</h2>
              <p className="opacity-70">Materi dan tantangan akan disesuaikan dengan kemampuanmu.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {levels.map((item, index) => (
                <div key={index} className="group relative rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden bg-background/50 border border-glass-border">
                  {/* Gradient Header Indicator */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${item.gradient}`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full mt-2">
                    <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} shadow-md`}>
                      {item.icon}
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Level {item.level}</div>
                      <h3 className="text-xl font-black mb-2">{item.title}</h3>
                      <p className="text-xs font-medium leading-relaxed opacity-80">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-glass-border/50">
                      <ul className="space-y-2">
                        {item.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs font-bold opacity-70">
                            <div className="w-1 h-1 rounded-full bg-primary shrink-0 mt-1.5"></div>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={handleFinishTutorial}
              className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Mulai Perjalanan <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Purple Footnote / Footer */}
        <div className="bg-[#581c87] text-white text-sm py-4 px-4 md:px-8 border-t-4 border-[#7e22ce] mt-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center md:text-left flex-wrap">
            <span className="font-bold tracking-wide">Gen Zitoria: Platform Sejarah Adaptif</span>
            
            <span className="hidden md:inline text-purple-300 opacity-50">|</span>
            
            <a href="https://instagram.com/Riorem15" target="_blank" rel="noreferrer" className="hover:text-purple-200 flex items-center gap-1.5 transition-colors">
              <Camera className="w-4 h-4" /> @Riorem15
            </a>
            
            <span className="hidden md:inline text-purple-300 opacity-50">|</span>
            
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> 2288230033@untirta.ac.id
            </span>
            
            <span className="hidden md:inline text-purple-300 opacity-50">|</span>
            
            <button 
              onClick={() => window.open('https://maps.google.com/?q=FKIP+UNTIRTA+CIWARU', '_blank')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors font-medium border border-white/10"
            >
              <MapPin className="w-4 h-4" /> Kunjungi Alamat: FKIP UNTIRTA CIWARU
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tutorial;
