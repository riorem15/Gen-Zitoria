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

  if (chapterPrefix === 'chap_8') {
    const strategies = ['Agresi Militer', 'Perang Gerilya', 'Diplomasi Linggarjati', 'Diplomasi Renville', 'KMB', 'PDRI'];
    for (let i = 1; i <= 50; i++) {
      let strat = strategies[i % strategies.length];
      addQ(i, 'l', "Kapan terjadinya peristiwa atau apa definisi dari " + strat + "?", 
        ["Peristiwa pada zaman kerajaan Hindu", "Bagian krusial dari upaya mempertahankan kemerdekaan melalui " + strat, "Tidak pernah terjadi di Indonesia", "Bentuk penjajahan baru Jepang", "Hanya mitos sejarah"], 1, strat + " adalah peristiwa mempertahankan kemerdekaan.");
      addQ(i, 'm', "Bagaimana peristiwa " + strat + " mempengaruhi posisi Republik Indonesia di mata internasional?", 
        ["Menghancurkan reputasi total", "Menarik simpati atau memberikan tekanan balik kepada Belanda melalui " + strat, "Tidak ada efek sama sekali", "Membuat Indonesia dijauhi PBB", "Memicu perang dunia ke 3"], 1, "Dinamika " + strat + " berdampak geopolitik.");
      addQ(i, 'h', "Analisislah mengapa strategi " + strat + " mutlak diperlukan dalam kombinasi perjuangan fisik dan diplomasi kita?", 
        ["Karena kita suka berperang", "Untuk menutupi kelemahan militer dan menekan Belanda secara komprehensif melalui " + strat, "Karena diinstruksikan oleh penjajah", "Agar terlihat keren di mata dunia", "Hanya formalitas belaka"], 1, strat + " membuktikan statecraft dan resiliensi bangsa.");
    }
  }

  if (chapterPrefix === 'chap_9') {
    const topics = ['Demokrasi Liberal', 'Demokrasi Terpimpin', 'Dekrit Presiden 1959', 'Pemilu 1955', 'G30S 1965'];
    for (let i = 1; i <= 50; i++) {
      let top = topics[i % topics.length];
      addQ(i, 'l', "Apa ciri utama atau tokoh sentral dari peristiwa " + top + "?", 
        ["Pemerintahan kolonial", "Dinamika politik kabinet dan hegemoni kekuasaan pada masa " + top, "Sistem kerajaan absolut", "Hanya mitos belaka", "Sistem ekonomi prasejarah"], 1, top + " adalah fase krusial politik Indonesia.");
      addQ(i, 'm', "Mengapa sistem " + top + " pada akhirnya mengalami kegagalan atau krisis?", 
        ["Karena terlalu banyak uang", "Akibat instabilitas politik, konflik ideologi, atau deadlock faksi pada " + top, "Karena masyarakat tidak peduli", "Karena bantuan asing yang terlalu besar", "Sistemnya berjalan sempurna 100%"], 1, "Krisis pada " + top + " dipicu oleh friksi elite.");
      addQ(i, 'h', "Evaluasilah dampak jangka panjang dari berakhirnya era " + top + " terhadap arah politik bangsa Indonesia!", 
        ["Tidak ada yang berubah", "Menyebabkan pergeseran haluan negara secara drastis menuju sistem kekuasaan baru akibat " + top, "Membawa kedamaian abadi tanpa konflik", "Memicu kembalinya Belanda", "Mengembalikan sistem kerajaan Majapahit"], 1, top + " adalah titik balik transisi kekuasaan.");
    }
  }

  if (chapterPrefix === 'chap_10') {
    const topics = ['Orde Baru', 'Dwifungsi ABRI', 'Krisis Moneter 1997', 'Gerakan Reformasi 1998', 'Otonomi Daerah'];
    for (let i = 1; i <= 50; i++) {
      let top = topics[i % topics.length];
      addQ(i, 'l', "Apa fokus utama kebijakan atau peristiwa pada " + top + "?", 
        ["Penjajahan kembali", "Stabilitas politik, krisis, atau transisi menuju demokrasi yang terkait dengan " + top, "Membangun candi", "Kembali ke zaman purba", "Sistem monarki absolut"], 1, top + " mendefinisikan sejarah modern kita.");
      addQ(i, 'm', "Bagaimana " + top + " memengaruhi kehidupan sosial-ekonomi masyarakat pada saat itu?", 
        ["Masyarakat tidak terdampak", "Menciptakan stabilitas semu atau memicu krisis sosial yang besar akibat " + top, "Masyarakat langsung hidup di luar angkasa", "Tidak ada pengaruh ekonomi", "Hanya berdampak pada pejabat"], 1, "Dampak " + top + " sangat terasa di akar rumput.");
      addQ(i, 'h', "Kritiklah sejauh mana " + top + " berhasil (atau gagal) dalam menjawab tuntutan supremasi hukum dan keadilan sosial!", 
        ["Sangat berhasil tanpa cela", "Seringkali terjebak pada oligarki/KKN sehingga menjadi pemicu keruntuhan/tuntutan dari " + top, "Gagal karena kurang uang", "Hanya berhasil di pulau Jawa", "Tidak relevan dengan keadilan"], 1, "Tuntutan keadilan sosial sering terhambat oleh kepentingan elite pada " + top + ".");
    }
  }

  return quizzes;
};

const chapters = ['chap_8', 'chap_9', 'chap_10'];
let output = 'export const faseF_quizzes = {\n';

chapters.forEach(chap => {
  const qz = generateQuizzes(chap, chap);
  output += '  "' + chap + '": ' + JSON.stringify(qz, null, 4) + ',\n';
});

output += '};\n';
fs.writeFileSync('./scratch/fase_f_quizzes.js', output);
console.log('Fase F quizzes generated.');
