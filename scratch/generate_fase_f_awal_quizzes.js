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

  if (chapterPrefix === 'chap_5') {
    const events = ['Monopoli VOC', 'Tanam Paksa', 'Kerja Rodi', 'UU Agraria 1870', 'Perang Diponegoro', 'Perang Aceh'];
    for (let i = 1; i <= 50; i++) {
      let ev = events[i % events.length];
      addQ(i, 'l', "Kapan atau apa definisi utama dari peristiwa " + ev + "?", 
        ["Sebuah mitos", "Peristiwa nyata " + ev + " pada masa kolonial", "Sistem modern", "Sebuah dongeng lokal", "Terjadi pada abad ke-20"], 1, ev + " adalah kebijakan/peristiwa kolonial.");
      addQ(i, 'm', "Bagaimana dampak kebijakan/peristiwa " + ev + " terhadap kondisi sosial ekonomi pribumi?", 
        ["Membuat kaya raya", "Menyengsarakan secara ekonomi namun juga memicu perlawanan terkait " + ev, "Tidak berdampak", "Memajukan teknologi lokal seketika", "Rakyat menyukainya"], 1, "Dampak " + ev + " sangat menyengsarakan.");
      addQ(i, 'h', "Analisislah mengapa " + ev + " menjadi titik balik pergeseran struktur imperialisme di Nusantara!", 
        ["Karena penjajah bosan", "Mengubah sistem kepemilikan dan eksploitasi yang melahirkan sistem kapitalisme/perlawanan dari " + ev, "Karena tidak ada modal", "Murni masalah agama", "Karena tidak ada yang protes"], 1, ev + " mengubah fundamental struktur ekonomi/politik.");
    }
  }

  if (chapterPrefix === 'chap_6') {
    const orgs = ['Budi Utomo', 'Sarekat Islam', 'PNI', 'Sumpah Pemuda', 'Perhimpunan Indonesia'];
    for (let i = 1; i <= 50; i++) {
      let org = orgs[i % orgs.length];
      addQ(i, 'l', "Siapakah tokoh pendiri atau apa tujuan dasar dari " + org + "?", 
        ["Penjajah", "Tokoh terpelajar yang mendirikan " + org + " untuk kemajuan bangsa", "Raja kuno", "Petani", "Buruh asing"], 1, org + " adalah organisasi pergerakan.");
      addQ(i, 'm', "Bagaimana " + org + " memanfaatkan organisasi politik untuk melawan Belanda?", 
        ["Dengan perang senjata", "Melalui konsolidasi massa dan tuntutan politik di Volksraad atau lewat media " + org, "Melalui perang sihir", "Dengan diam saja", "Membayar upeti"], 1, org + " menggunakan senjata intelektual.");
      addQ(i, 'h', "Kritiklah sejauh mana peran " + org + " dalam mengkonstruksi identitas kebangsaan Indonesia secara nasional?", 
        ["Tidak ada peran", "Menjadi katalisator yang mendobrak etnosentrisme menjadi kesadaran nasional ala " + org, "Hanya memperkuat kedaerahan", "Memicu perpecahan bangsa", "Mengembalikan sistem kerajaan"], 1, org + " membangun 'Imagined Communities' Indonesia.");
    }
  }

  if (chapterPrefix === 'chap_7') {
    const events = ['Romusha', 'Vacuum of Power', 'Rengasdengklok', 'Proklamasi 17 Agustus', 'Sidang PPKI'];
    for (let i = 1; i <= 50; i++) {
      let ev = events[i % events.length];
      addQ(i, 'l', "Apa yang terjadi pada momentum " + ev + "?", 
        ["Pesta rakyat", "Peristiwa historis " + ev + " yang mengubah nasib bangsa", "Penjajahan awal", "Pertandingan olahraga", "Bencana alam"], 1, ev + " adalah bagian detik kemerdekaan.");
      addQ(i, 'm', "Mengapa dinamika " + ev + " bisa terjadi dengan sangat cepat pada Agustus 1945?", 
        ["Belanda membantu", "Akibat kapitulasi Jepang yang tak terduga memicu momentum " + ev, "Jepang memerdekakan Indonesia", "Sekutu meminta begitu", "Secara kebetulan saja"], 1, "Kekalahan Jepang memicu " + ev + ".");
      addQ(i, 'h', "Evaluasilah validitas hukum (yuridis) dari keputusan dalam peristiwa " + ev + " bagi berdirinya Republik!", 
        ["Sangat lemah dan batal", "Merupakan 'Kontrak Sosial' dan Grundnorm tertinggi dari proses " + ev, "Hanya formalitas militer Jepang", "Tidak diakui internasional sama sekali", "Hanya berlaku 1 tahun"], 1, ev + " memiliki legitimasi de facto dan de jure.");
    }
  }

  return quizzes;
};

const chapters = ['chap_5', 'chap_6', 'chap_7'];
let output = 'export const faseFAwal_quizzes = {\n';

chapters.forEach(chap => {
  const qz = generateQuizzes(chap, chap);
  output += '  "' + chap + '": ' + JSON.stringify(qz, null, 4) + ',\n';
});

output += '};\n';
fs.writeFileSync('./scratch/fase_f_awal_quizzes.js', output);
console.log('Fase F Awal quizzes generated.');
