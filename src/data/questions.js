// Bank soal Zitoria - Dioptimalkan untuk PG dan True/False saja (Sesuai Permintaan)
// Level ZPD (1: Belum mandiri/C1-C2, 2: Bimbingan/C3-C4, 3: Mandiri/C5-C6)

export const questionBank = [
  // ======================== ZAMAN PRAAKSARA ========================
  // LEVEL 1 (C1 & C2)
  {
    id: "p1-l1-pg1",
    eraId: "praaksara",
    level: 1,
    type: "pg",
    question: "Zaman di mana manusia belum mengenal tulisan disebut sebagai zaman...",
    options: ["Sejarah", "Praaksara", "Prasejarah", "Megalitikum"],
    correctAnswer: "Praaksara",
    explanation: "Praaksara berasal dari kata pra (sebelum) dan aksara (tulisan). Istilah ini lebih tepat digunakan daripada 'prasejarah' karena sejarah kehidupan bumi sudah ada sebelum manusia mengenal tulisan."
  },
  {
    id: "p1-l1-tf1",
    eraId: "praaksara",
    level: 1,
    type: "tf",
    question: "Fosil manusia purba Meganthropus Paleojavanicus ditemukan di daerah Sangiran.",
    correctAnswer: "Benar",
    explanation: "M. Paleojavanicus memang ditemukan oleh Von Koenigswald di Sangiran (Jawa Tengah) pada tahun 1936-1941."
  },
  // LEVEL 2 (C3 & C4)
  {
    id: "p1-l2-pg1",
    eraId: "praaksara",
    level: 2,
    type: "pg",
    question: "Perhatikan alat-alat berikut: Kapak perimbas, Kapak genggam, Flakes. Alat-alat tersebut menunjukkan cara bertahan hidup manusia purba pada masa...",
    options: ["Bercocok tanam", "Perundagian", "Berburu dan meramu", "Megalitikum"],
    correctAnswer: "Berburu dan meramu",
    explanation: "Alat batu yang masih sangat kasar (belum diasah) seperti kapak genggam adalah ciri khas masa berburu dan meramu (Paleolitikum)."
  },
  {
    id: "p1-l2-tf1",
    eraId: "praaksara",
    level: 2,
    type: "tf",
    question: "Kjokkenmoddinger (sampah dapur kerang) membuktikan manusia purba di Sumatera sudah membangun peradaban kota (urban).",
    correctAnswer: "Salah",
    explanation: "Kjokkenmoddinger hanya menunjukkan mereka menetap sementara di pesisir pantai dan makan kerang, belum sampai membentuk peradaban kota/urban."
  },
  // LEVEL 3 (C5 & C6)
  {
    id: "p1-l3-pg1",
    eraId: "praaksara",
    level: 3,
    type: "pg",
    question: "Jika Anda membandingkan revolusi kebudayaan Neolitikum dengan Revolusi Industri abad 18, manakah persamaan paling mendasar yang mengubah jalannya peradaban?",
    options: [
      "Keduanya mengakhiri sistem barter dan menggantinya dengan uang logam",
      "Keduanya memicu perubahan radikal dalam cara produksi makanan/barang",
      "Keduanya disebabkan oleh peperangan antar benua",
      "Keduanya melahirkan sistem tulisan yang universal"
    ],
    correctAnswer: "Keduanya memicu perubahan radikal dalam cara produksi makanan/barang",
    explanation: "Neolitikum adalah titik balik dari sekadar mengumpulkan makanan (food gathering) menjadi memproduksi makanan (food producing), sama revolusionernya dengan peralihan tenaga manusia ke mesin saat Revolusi Industri."
  },

  // ======================== ZAMAN KUNO ========================
  // LEVEL 1
  {
    id: "p2-l1-pg1",
    eraId: "kuno",
    level: 1,
    type: "pg",
    question: "Peradaban yang lahir di lembah Sungai Tigris dan Eufrat dan menciptakan tulisan paku (Cuneiform) adalah...",
    options: ["Mesir Kuno", "Lembah Indus", "Mesopotamia", "Romawi Kuno"],
    correctAnswer: "Mesopotamia",
    explanation: "Mesopotamia (kini wilayah Irak) berada di antara Tigris dan Eufrat, merupakan salah satu peradaban tertua yang menciptakan sistem tulisan."
  },
  // LEVEL 2
  {
    id: "p2-l2-tf1",
    eraId: "kuno",
    level: 2,
    type: "tf",
    question: "Athena Kuno menggunakan sistem Demokrasi Perwakilan, mirip seperti sistem di Indonesia saat ini.",
    correctAnswer: "Salah",
    explanation: "Athena mempraktekkan Demokrasi Langsung (Direct Democracy), di mana semua warga yang berhak (pria dewasa merdeka) langsung ikut voting di majelis, bukan memilih wakil."
  },
  // LEVEL 3
  {
    id: "p2-l3-pg1",
    eraId: "kuno",
    level: 3,
    type: "pg",
    question: "Berdasarkan sejarah keruntuhannya, pelajaran terpenting apa yang bisa diambil dari jatuhnya Kekaisaran Romawi Barat pada 476 M bagi negara modern?",
    options: [
      "Kekuatan militer yang besar tidak berguna tanpa penemuan senjata api",
      "Korupsi internal, perpecahan politik, dan krisis ekonomi lebih mematikan daripada serangan militer murni dari luar",
      "Membangun tembok pertahanan yang panjang adalah satu-satunya cara bertahan",
      "Terlalu banyak fokus pada seni membuat sebuah negara menjadi lemah"
    ],
    correctAnswer: "Korupsi internal, perpecahan politik, dan krisis ekonomi lebih mematikan daripada serangan militer murni dari luar",
    explanation: "Romawi Barat runtuh bukan semata-mata karena invasi bangsa barbar, melainkan karena masalah internal yang kronis yang membuat sistem pertahanan mereka keropos dari dalam."
  },

  // ======================== ZAMAN PERTENGAHAN ========================
  {
    id: "p3-l1-tf1",
    eraId: "pertengahan",
    level: 1,
    type: "tf",
    question: "Sistem Feodalisme di Eropa Abad Pertengahan membuat kekuasaan raja menjadi sangat mutlak dan tidak bisa ditentang oleh tuan tanah.",
    correctAnswer: "Salah",
    explanation: "Justru sebaliknya. Pada masa Feodalisme, kekuasaan terpecah-pecah ke tangan para tuan tanah (Lords), sehingga kekuasaan raja sebenarnya lemah di daerah."
  },
  {
    id: "p3-l2-pg1",
    eraId: "pertengahan",
    level: 2,
    type: "pg",
    question: "Meskipun Perang Salib adalah konflik militer dan agama, dampak positifnya bagi Eropa dalam bidang ekonomi adalah...",
    options: [
      "Eropa berhasil menguasai seluruh cadangan minyak bumi",
      "Sistem pertanian berpindah ke metode hidroponik",
      "Terbukanya kembali jalur perdagangan produk Timur (seperti rempah dan sutra) ke Eropa",
      "Eropa berhenti menggunakan uang logam"
    ],
    correctAnswer: "Terbukanya kembali jalur perdagangan produk Timur (seperti rempah dan sutra) ke Eropa",
    explanation: "Interaksi selama Perang Salib secara tidak sengaja memperkenalkan orang Eropa pada kemewahan barang-barang dari Timur, menghidupkan kembali jaringan perdagangan."
  },

  // ======================== MODERN AWAL ========================
  {
    id: "p4-l1-pg1",
    eraId: "modern_awal",
    level: 1,
    type: "pg",
    question: "Gerakan kebudayaan 'Kelahiran Kembali' ilmu pengetahuan dan seni klasik Yunani-Romawi di Italia abad ke-14 disebut...",
    options: ["Reformasi Gereja", "Revolusi Industri", "Renaissance", "Pencerahan (Aufklarung)"],
    correctAnswer: "Renaissance",
    explanation: "Renaissance berarti kelahiran kembali (rebirth), fokus pada potensi manusia (Humanisme)."
  },
  {
    id: "p4-l2-tf1",
    eraId: "modern_awal",
    level: 2,
    type: "tf",
    question: "Jatuhnya Konstantinopel ke tangan Turki Utsmani (1453) merupakan salah satu pemicu utama bangsa Eropa melakukan penjelajahan samudera.",
    correctAnswer: "Benar",
    explanation: "Karena jalur darat tertutup/monopoli Turki Utsmani, harga rempah di Eropa melonjak tajam. Ini memaksa Spanyol dan Portugis mencari jalur laut baru ke Asia."
  },

  // ======================== MODERN & KONTEMPORER ========================
  {
    id: "p5-l1-pg1",
    eraId: "modern_kontemporer",
    level: 1,
    type: "pg",
    question: "Perubahan radikal metode produksi dari tenaga manusia/hewan menjadi tenaga mesin (diawali mesin uap) disebut...",
    options: ["Revolusi Agraria", "Revolusi Industri", "Revolusi Prancis", "Revolusi Digital"],
    correctAnswer: "Revolusi Industri",
    explanation: "Revolusi Industri dimulai di Inggris pada pertengahan abad 18, mengubah wajah ekonomi dunia dari agraris ke industri."
  },
  {
    id: "p5-l3-tf1",
    eraId: "modern_kontemporer",
    level: 3,
    type: "tf",
    question: "Perang Dingin disebut 'dingin' karena terjadi pertempuran fisik secara besar-besaran langsung antara pasukan militer Amerika Serikat dan Uni Soviet di Eropa yang bersalju.",
    correctAnswer: "Salah",
    explanation: "Disebut 'Dingin' justru karena tidak pernah ada bentrokan militer terbuka secara langsung antara AS dan Soviet, melainkan lewat proxy war (perang perwakilan), perlombaan senjata, dan spionase."
  }
];

export const getQuestions = (eraId, level, limit = 4) => {
  const filtered = questionBank.filter(q => q.eraId === eraId && q.level === level);
  return filtered.sort(() => 0.5 - Math.random()).slice(0, limit);
};
