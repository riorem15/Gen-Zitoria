import fs from 'fs';

const generateQuizzes = (chapterPrefix, chapterName) => {
  const quizzes = [];
  
  const addQ = (idNum, diff, qText, opts, correctIdx, expl) => {
    quizzes.push({
      id: chapterPrefix + "_" + diff + idNum,
      question: qText,
      options: opts,
      correctAnswer: correctIdx,
      explanation: expl
    });
  };

  if (chapterPrefix === 'chap_1') {
    const concepts = ['Diakronik', 'Sinkronik', 'Heuristik', 'Verifikasi', 'Interpretasi', 'Historiografi', 'Manusia', 'Ruang', 'Waktu'];
    for (let i = 1; i <= 50; i++) {
      let concept = concepts[i % concepts.length];
      addQ(i, 'l', "Manakah pengertian yang paling tepat mengenai konsep " + concept + " dalam ilmu sejarah?", 
        ["Konsep yang berkaitan dengan ruang", "Konsep yang berhubungan dengan definisi " + concept + " itu sendiri secara hafalan", "Sebuah mitos", "Cerita dongeng", "Konsep masa depan"], 1, concept + " adalah dasar sejarah.");
      
      addQ(i, 'm', "Ketika seorang peneliti menggunakan pendekatan " + concept + " dalam penelitiannya tentang Perang Diponegoro, apa hasil utama yang didapat?", 
        ["Penyusunan waktu yang acak", "Analisis yang lebih terstruktur sesuai kaidah " + concept, "Data menjadi tidak valid", "Tidak ada hubungannya dengan sejarah", "Hanya teori"], 1, "Pendekatan " + concept + " memberikan kerangka kerja analisis sejarah.");
      
      addQ(i, 'h', "Evaluasilah dampak jika sejarawan mengabaikan aspek " + concept + " dalam merekonstruksi peristiwa Proklamasi Kemerdekaan?", 
        ["Peristiwa akan tetap sama", "Narasinya akan cacat dan berpotensi menimbulkan anakronisme atau bias fakta", "Akan menjadi sejarah yang lebih baik", "Tidak berdampak sama sekali", "Memudahkan pembaca"], 1, "Mengabaikan " + concept + " akan merusak validitas epistemologi sejarah.");
    }
  }

  if (chapterPrefix === 'chap_2') {
    const migrations = ['Proto Melayu', 'Deutero Melayu', 'Melanesoid', 'Out of Taiwan', 'Jalur Rempah'];
    for (let i = 1; i <= 50; i++) {
      let mig = migrations[i % migrations.length];
      addQ(i, 'l', "Apa ciri utama dari gelombang kebudayaan " + mig + "?", 
        ["Menggunakan senjata nuklir", "Membawa ciri khas kebudayaan " + mig + " pada masanya", "Tidak membawa apa-apa", "Datang dari Eropa", "Datang pada abad 21"], 1, mig + " memiliki artefak khas.");
      addQ(i, 'm', "Bagaimana gelombang migrasi " + mig + " beradaptasi dengan kondisi geografis Nusantara?", 
        ["Mereka langsung punah", "Mereka memanfaatkan sumber daya alam dan mengembangkan budaya khas " + mig, "Mereka kembali ke asalnya", "Mereka menolak untuk tinggal", "Mereka membuat gedung pencakar langit"], 1, "Adaptasi " + mig + " membentuk Local Genius.");
      addQ(i, 'h', "Analisis bagaimana interaksi antara ras lokal dengan gelombang " + mig + " mempengaruhi struktur sosial praaksara kita?", 
        ["Menyebabkan peperangan abadi", "Menghasilkan asimilasi budaya dan genetik yang membentuk identitas bangsa modern", "Tidak ada interaksi sama sekali", "Menghancurkan budaya lokal total", "Memisahkan pulau-pulau"], 1, "Asimilasi " + mig + " adalah bukti keberagaman genetik.");
    }
  }

  if (chapterPrefix === 'chap_3') {
    const kingdoms = ['Sriwijaya', 'Majapahit', 'Mataram Kuno', 'Tarumanegara', 'Kutai'];
    for (let i = 1; i <= 50; i++) {
      let king = kingdoms[i % kingdoms.length];
      addQ(i, 'l', "Siapakah tokoh yang paling berpengaruh atau apa prasasti utama dari kerajaan " + king + "?", 
        ["Tidak ada tokoh", "Tokoh/Prasasti utama yang mencatat kebesaran " + king, "Raja Eropa", "Presiden modern", "Bupati"], 1, "Kerajaan " + king + " memiliki peninggalan besar.");
      addQ(i, 'm', "Mengapa kerajaan " + king + " bisa mencapai masa keemasannya pada zamannya?", 
        ["Karena beruntung", "Karena penguasaan jalur ekonomi dan stabilitas politik ala " + king, "Karena dibantu makhluk asing", "Karena bantuan VOC", "Karena masyarakatnya malas"], 1, "Geopolitik " + king + " sangat strategis.");
      addQ(i, 'h', "Kritiklah dampak kejatuhan kerajaan " + king + " terhadap peta kekuatan politik di Nusantara!", 
        ["Semua menjadi hancur", "Menyebabkan pergeseran pusat kekuasaan dan munculnya kekuatan baru di daerah lain", "Tidak berdampak karena " + king + " kecil", "Memicu perang dunia", "Membawa perdamaian instan"], 1, "Runtuhnya " + king + " merubah keseimbangan mandala.");
    }
  }

  if (chapterPrefix === 'chap_4') {
    const isls = ['Demak', 'Banten', 'Mataram Islam', 'Gowa-Tallo', 'Aceh'];
    for (let i = 1; i <= 50; i++) {
      let isl = isls[i % isls.length];
      addQ(i, 'l', "Dimanakah letak geografis pusat pemerintahan Kesultanan " + isl + "?", 
        ["Di pegunungan Himalaya", "Di lokasi strategis wilayah " + isl + " yang mendukung niaga", "Di tengah gurun pasir", "Di dasar laut", "Di benua Eropa"], 1, "Geografi " + isl + " mendukung.");
      addQ(i, 'm', "Bagaimana strategi dakwah dan politik yang diterapkan oleh Kesultanan " + isl + "?", 
        ["Dengan penjajahan militer", "Melalui jalur perdagangan, perkawinan, dan akulturasi budaya oleh Kesultanan " + isl, "Dengan menutup diri", "Dengan membuang budaya lokal", "Dengan paksaan penuh"], 1, isl + " menggunakan strategi kultural.");
      addQ(i, 'h', "Sejauh mana perlawanan Kesultanan " + isl + " mampu menghambat hegemoni monopoli VOC di Nusantara?", 
        ["Sangat gagal sejak awal", "Mampu merepotkan VOC meski pada akhirnya terjadi kekalahan akibat politik devide et impera pada " + isl, "Kesultanan " + isl + " justru bekerja sama dengan penjajah", "Menghancurkan VOC secara permanen", "Tidak pernah melawan VOC"], 1, "Kegigihan " + isl + " melemahkan VOC secara finansial.");
    }
  }

  return quizzes;
};

const chapters = ['chap_1', 'chap_2', 'chap_3', 'chap_4'];
let output = 'export const faseE_quizzes = {\n';

chapters.forEach(chap => {
  const qz = generateQuizzes(chap, chap);
  output += '  "' + chap + '": ' + JSON.stringify(qz, null, 4) + ',\n';
});

output += '};\n';
fs.writeFileSync('./scratch/fase_e_quizzes.js', output);
console.log('Fase E quizzes generated.');
