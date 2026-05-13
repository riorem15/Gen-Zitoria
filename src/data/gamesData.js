// Data untuk semua mini game Gen Zitoria

// ============================================================
// 1. MATCHING GAME — 5 pasang soal-jawaban per tema
// ============================================================
export const matchingQuestions = [
  {
    id: "match_praaksara",
    theme: "Masa Praaksara",
    pairs: [
      { id: 1, question: "Manusia raksasa tertua dari Jawa", answer: "Meganthropus Palaeojavanicus" },
      { id: 2, question: "Gaya hidup berpindah-pindah mengikuti makanan", answer: "Nomaden" },
      { id: 3, question: "Sampah dapur purba berupa tumpukan kulit kerang", answer: "Kjokkenmoddinger" },
      { id: 4, question: "Manusia kera berjalan tegak ditemukan Eugene Dubois", answer: "Pithecanthropus Erectus" },
      { id: 5, question: "Peralihan dari food gathering ke food producing", answer: "Revolusi Neolitik" },
    ]
  },
  {
    id: "match_hindu_buddha",
    theme: "Hindu-Buddha di Nusantara",
    pairs: [
      { id: 1, question: "Teori penyebaran Hindu oleh pedagang", answer: "Teori Waisya" },
      { id: 2, question: "Prasasti tertua di Indonesia dari Kutai", answer: "Prasasti Yupa" },
      { id: 3, question: "Kerajaan maritim terkuat abad 7-13 M di Sumatera", answer: "Sriwijaya" },
      { id: 4, question: "Sumpah menyatukan Nusantara oleh Gajah Mada", answer: "Sumpah Palapa" },
      { id: 5, question: "Teori orang Nusantara aktif belajar ke India", answer: "Teori Arus Balik" },
    ]
  },
  {
    id: "match_islam",
    theme: "Masuknya Islam ke Nusantara",
    pairs: [
      { id: 1, question: "Kesultanan Islam pertama di Aceh", answer: "Samudera Pasai" },
      { id: 2, question: "Wali yang menggunakan wayang untuk dakwah", answer: "Sunan Kalijaga" },
      { id: 3, question: "Kerajaan Islam pertama di Jawa", answer: "Kesultanan Demak" },
      { id: 4, question: "Media dakwah seni dan budaya Jawa", answer: "Wayang Kulit" },
      { id: 5, question: "Pimpinan Sarekat Islam yang karismatik", answer: "H.O.S. Tjokroaminoto" },
    ]
  },
  {
    id: "match_kolonial",
    theme: "Kolonialisme & Perlawanan",
    pairs: [
      { id: 1, question: "Perusahaan dagang Belanda yang menjajah", answer: "VOC" },
      { id: 2, question: "Kebijakan menanam paksa kopi dan tebu", answer: "Cultuurstelsel" },
      { id: 3, question: "Perang gerilya di Jawa Tengah 1825-1830", answer: "Perang Diponegoro" },
      { id: 4, question: "Taktik Belanda memecah belah pribumi", answer: "Devide et Impera" },
      { id: 5, question: "Jalan raya Anyer-Panarukan dibangun oleh", answer: "Daendels" },
    ]
  },
  {
    id: "match_pergerakan",
    theme: "Pergerakan Nasional",
    pairs: [
      { id: 1, question: "Organisasi modern pertama Indonesia 1908", answer: "Budi Utomo" },
      { id: 2, question: "Puncak persatuan pemuda seluruh nusantara 1928", answer: "Sumpah Pemuda" },
      { id: 3, question: "Organisasi yang pertama menuntut Indonesia Merdeka", answer: "Indische Partij" },
      { id: 4, question: "Program Belanda mendidik pribumi untuk pegawai", answer: "Politik Etis" },
      { id: 5, question: "Pasukan bentukan Jepang cikal bakal TNI", answer: "PETA" },
    ]
  },
  {
    id: "match_proklamasi",
    theme: "Proklamasi & Kemerdekaan",
    pairs: [
      { id: 1, question: "Tempat Soekarno-Hatta dibawa sebelum proklamasi", answer: "Rengasdengklok" },
      { id: 2, question: "Bendera merah putih dijahit oleh", answer: "Ibu Fatmawati" },
      { id: 3, question: "Perwira Jepang yang meminjamkan rumah untuk penyusunan naskah", answer: "Laksamana Maeda" },
      { id: 4, question: "Tanggal pembacaan proklamasi kemerdekaan", answer: "17 Agustus 1945" },
      { id: 5, question: "Kekosongan kekuasaan setelah Jepang kalah", answer: "Vacuum of Power" },
    ]
  },
];

// ============================================================
// 2. WORD BUILDER GAME — blok huruf untuk disusun
// ============================================================
export const wordBuildQuestions = [
  {
    id: "wb_1",
    theme: "Praaksara",
    question: "Zaman sebelum manusia mengenal tulisan disebut zaman...",
    answer: "PRAAKSARA",
    hint: "P_______A",
    shuffledLetters: ["A", "R", "P", "A", "A", "K", "S", "A", "R"],
  },
  {
    id: "wb_2",
    theme: "Praaksara",
    question: "Cara hidup berpindah-pindah mengikuti ketersediaan makanan disebut...",
    answer: "NOMADEN",
    hint: "N_____N",
    shuffledLetters: ["N", "O", "M", "A", "D", "E", "N"],
  },
  {
    id: "wb_3",
    theme: "Hindu-Buddha",
    question: "Kerajaan maritim besar di Sumatera yang menguasai jalur laut abad ke-7...",
    answer: "SRIWIJAYA",
    hint: "S_______A",
    shuffledLetters: ["S", "R", "I", "W", "I", "J", "A", "Y", "A"],
  },
  {
    id: "wb_4",
    theme: "Islam",
    question: "Kesultanan Islam pertama di Indonesia, terletak di Aceh...",
    answer: "SAMUDERAPASSAI",
    hint: "S__________I",
    shuffledLetters: ["S","A","M","U","D","E","R","A","P","A","S","S","A","I"],
  },
  {
    id: "wb_5",
    theme: "Kolonial",
    question: "Perusahaan dagang Belanda yang diberi hak oktroi untuk menjajah Nusantara...",
    answer: "VOC",
    hint: "V_C",
    shuffledLetters: ["V", "O", "C"],
  },
  {
    id: "wb_6",
    theme: "Kolonial",
    question: "Kebijakan Belanda yang memaksa petani menanam kopi dan tebu disebut...",
    answer: "CULTUURSTELSEL",
    hint: "C_____________L",
    shuffledLetters: ["C","U","L","T","U","U","R","S","T","E","L","S","E","L"],
  },
  {
    id: "wb_7",
    theme: "Pergerakan",
    question: "Ikrar persatuan pemuda Indonesia yang diucapkan tahun 1928...",
    answer: "SUMPAHPEMUDA",
    hint: "S__________A",
    shuffledLetters: ["S","U","M","P","A","H","P","E","M","U","D","A"],
  },
  {
    id: "wb_8",
    theme: "Kemerdekaan",
    question: "Pasukan bentukan Jepang yang menjadi cikal bakal TNI...",
    answer: "PETA",
    hint: "P__A",
    shuffledLetters: ["P", "E", "T", "A"],
  },
  {
    id: "wb_9",
    theme: "Orde Baru",
    question: "Rencana Pembangunan Lima Tahun yang dijalankan Soeharto...",
    answer: "REPELITA",
    hint: "R______A",
    shuffledLetters: ["R","E","P","E","L","I","T","A"],
  },
  {
    id: "wb_10",
    theme: "Reformasi",
    question: "Era keterbukaan yang dimulai setelah Soeharto mundur tahun 1998...",
    answer: "REFORMASI",
    hint: "R_______I",
    shuffledLetters: ["R","E","F","O","R","M","A","S","I"],
  },
];

// ============================================================
// 3. CHRONOLOGY GAME — urutkan narasi sejarah
// ============================================================
export const chronologyLevels = [
  {
    id: "chron_1",
    theme: "Dari Praaksara ke Kemerdekaan",
    instruction: "Urutkan peristiwa berikut dari yang PALING AWAL hingga PALING BARU!",
    events: [
      { id: "e1", text: "Manusia purba Pithecanthropus Erectus hidup di lembah Bengawan Solo", year: "± 1 Juta SM", order: 1 },
      { id: "e2", text: "Kerajaan Kutai berdiri, tertua di Indonesia dengan prasasti Yupa", year: "± 400 M", order: 2 },
      { id: "e3", text: "Kerajaan Sriwijaya menguasai jalur perdagangan maritim Asia", year: "± 650 M", order: 3 },
      { id: "e4", text: "Majapahit mencapai puncak kejayaan di bawah Gajah Mada", year: "± 1350 M", order: 4 },
      { id: "e5", text: "VOC (Belanda) mendirikan kekuasaan di Batavia", year: "1619 M", order: 5 },
      { id: "e6", text: "Proklamasi Kemerdekaan Indonesia oleh Soekarno-Hatta", year: "1945 M", order: 6 },
    ]
  },
  {
    id: "chron_2",
    theme: "Perlawanan & Pergerakan",
    instruction: "Urutkan peristiwa perlawanan dan pergerakan nasional dari PALING AWAL!",
    events: [
      { id: "e1", text: "Perang Padri di Minangkabau antara kaum ulama dan adat", year: "1821-1837", order: 1 },
      { id: "e2", text: "Perang Diponegoro berkecamuk di Jawa Tengah", year: "1825-1830", order: 2 },
      { id: "e3", text: "Perang Aceh, perlawanan paling lama melawan Belanda", year: "1873-1904", order: 3 },
      { id: "e4", text: "Budi Utomo didirikan sebagai organisasi modern pertama", year: "1908", order: 4 },
      { id: "e5", text: "Sumpah Pemuda menyatukan pemuda seluruh Nusantara", year: "1928", order: 5 },
      { id: "e6", text: "Jepang masuk Indonesia mengusir Belanda", year: "1942", order: 6 },
    ]
  },
  {
    id: "chron_3",
    theme: "Indonesia Pasca Kemerdekaan",
    instruction: "Urutkan peristiwa Indonesia merdeka dari PALING AWAL!",
    events: [
      { id: "e1", text: "Proklamasi Kemerdekaan 17 Agustus 1945", year: "1945", order: 1 },
      { id: "e2", text: "Era Demokrasi Parlementer dengan kabinet yang sering berganti", year: "1950-1959", order: 2 },
      { id: "e3", text: "Dekrit Presiden Soekarno memulai Demokrasi Terpimpin", year: "1959", order: 3 },
      { id: "e4", text: "Tragedi G30S/PKI mengguncang Indonesia", year: "1965", order: 4 },
      { id: "e5", text: "Soeharto memimpin Orde Baru, fokus pada pembangunan", year: "1966-1998", order: 5 },
      { id: "e6", text: "Reformasi dimulai setelah Soeharto mundur akibat krisis moneter", year: "1998", order: 6 },
    ]
  },
];
