// Data soal Evaluasi per Fase — 30 soal (PG + Benar/Salah + Cocokkan)
// Fase E: chap_1 s/d chap_5 | Fase F: chap_6 s/d chap_14

export const phaseEvaluations = {
  fase_e: {
    id: "fase_e",
    title: "Evaluasi Akhir Fase E",
    description: "Ujian komprehensif meliputi Praaksara, Hindu-Buddha, dan Masuknya Islam",
    totalQuestions: 30,
    passingScore: 70,
    goodScore: 85,
    excellentScore: 95,
    questions: [
      // === PG (15 soal) ===
      { id: "fe_pg_1", type: "pg", question: "Kata 'Sejarah' dalam bahasa Indonesia berasal dari bahasa Arab yang berarti...", options: ["Pohon", "Sungai", "Batu", "Waktu"], correctAnswer: 0, explanation: "Syajarotun artinya pohon, melambangkan silsilah yang bercabang." },
      { id: "fe_pg_2", type: "pg", question: "Manusia purba bertubuh raksasa yang ditemukan di Sangiran bernama...", options: ["Homo Sapiens", "Pithecanthropus Erectus", "Meganthropus Palaeojavanicus", "Homo Wajakensis"], correctAnswer: 2, explanation: "Mega = besar, Anthropus = manusia, ditemukan von Koenigswald." },
      { id: "fe_pg_3", type: "pg", question: "Peralihan dari food gathering ke food producing disebut...", options: ["Revolusi Industri", "Revolusi Neolitik", "Revolusi Agraria", "Revolusi Budaya"], correctAnswer: 1, explanation: "Revolusi Neolitik adalah titik balik terbesar dalam peradaban manusia." },
      { id: "fe_pg_4", type: "pg", question: "Prasasti tertua di Indonesia yang menggunakan bahasa Sansekerta adalah...", options: ["Prasasti Canggal", "Prasasti Kedukan Bukit", "Prasasti Yupa", "Prasasti Tugu"], correctAnswer: 2, explanation: "Prasasti Yupa dari Kerajaan Kutai, abad ke-4 M." },
      { id: "fe_pg_5", type: "pg", question: "Kerajaan maritim yang menguasai jalur perdagangan laut Asia abad 7-13 M adalah...", options: ["Majapahit", "Mataram Kuno", "Sriwijaya", "Kediri"], correctAnswer: 2, explanation: "Sriwijaya di Palembang mengendalikan Selat Malaka." },
      { id: "fe_pg_6", type: "pg", question: "Sumpah Palapa diucapkan oleh...", options: ["Hayam Wuruk", "Ken Arok", "Gajah Mada", "Raden Wijaya"], correctAnswer: 2, explanation: "Gajah Mada bersumpah menyatukan Nusantara di bawah Majapahit." },
      { id: "fe_pg_7", type: "pg", question: "Teori yang menyatakan penyebaran Hindu dibawa oleh pedagang adalah...", options: ["Teori Brahmana", "Teori Ksatria", "Teori Waisya", "Teori Arus Balik"], correctAnswer: 2, explanation: "N.J. Krom mencetuskan Teori Waisya (pedagang)." },
      { id: "fe_pg_8", type: "pg", question: "Kesultanan Islam pertama di Nusantara terletak di...", options: ["Jawa Tengah", "Maluku", "Kalimantan", "Aceh"], correctAnswer: 3, explanation: "Samudera Pasai di Aceh adalah kesultanan Islam pertama, abad 13 M." },
      { id: "fe_pg_9", type: "pg", question: "Sunan yang menggunakan wayang kulit sebagai media dakwah adalah...", options: ["Sunan Ampel", "Sunan Bonang", "Sunan Giri", "Sunan Kalijaga"], correctAnswer: 3, explanation: "Sunan Kalijaga memodifikasi wayang dengan nilai-nilai Islam." },
      { id: "fe_pg_10", type: "pg", question: "Kjokkenmoddinger adalah bukti manusia purba...", options: ["Membuat senjata api", "Suka makan kerang dan menetap di pesisir", "Mengenal sistem tulisan", "Bercocok tanam di ladang"], correctAnswer: 1, explanation: "Kjokkenmoddinger = tumpukan sampah dapur berupa kulit kerang." },
      { id: "fe_pg_11", type: "pg", question: "Cara berpikir sejarah yang memanjang dalam waktu disebut...", options: ["Sinkronis", "Diakronis", "Sosiologis", "Kronologis"], correctAnswer: 1, explanation: "Diakronis = menelaah peristiwa dari waktu ke waktu secara urut." },
      { id: "fe_pg_12", type: "pg", question: "Masa ketika manusia purba mulai menetap dalam gua disebut...", options: ["Nomaden", "Sedenter", "Perundagian", "Neolitikum"], correctAnswer: 1, explanation: "Sedenter artinya menetap, lawan dari nomaden." },
      { id: "fe_pg_13", type: "pg", question: "Nekara adalah benda perunggu berbentuk gendang yang digunakan untuk...", options: ["Memasak makanan", "Memanggil hujan dalam ritual", "Menggiling biji-bijian", "Membuat perhiasan"], correctAnswer: 1, explanation: "Nekara dari Masa Perundagian digunakan dalam upacara ritual." },
      { id: "fe_pg_14", type: "pg", question: "Agama Islam masuk ke Nusantara melalui jalur yang PALING dominan adalah...", options: ["Invasi militer", "Perdagangan dan perkawinan", "Penaklukan kerajaan", "Ekspedisi laut bersenjata"], correctAnswer: 1, explanation: "Islamisasi Indonesia berlangsung damai melalui perdagangan dan pernikahan." },
      { id: "fe_pg_15", type: "pg", question: "Istilah 'Undagi' pada Masa Perundagian merujuk pada...", options: ["Petani padi", "Ahli/tukang yang membuat barang logam", "Pemimpin suku", "Pendeta ritual"], correctAnswer: 1, explanation: "Undagi = ahli/pengrajin, menandakan masyarakat sudah punya spesialisasi pekerjaan." },
      // === BENAR/SALAH (10 soal) ===
      { id: "fe_tf_1", type: "tf", question: "Pithecanthropus Erectus ditemukan oleh Eugene Dubois di Trinil, Jawa Timur.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Eugene Dubois menemukan Pithecanthropus Erectus di Trinil tahun 1891." },
      { id: "fe_tf_2", type: "tf", question: "Sriwijaya terletak di pulau Jawa dan merupakan kerajaan berbasis agraris.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Sriwijaya di Sumatera (Palembang) dan berbasis maritim/perdagangan." },
      { id: "fe_tf_3", type: "tf", question: "Sumpah Palapa diucapkan oleh Hayam Wuruk untuk menyatukan Nusantara.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Sumpah Palapa diucapkan oleh Gajah Mada (Mahapatih), bukan Hayam Wuruk (raja)." },
      { id: "fe_tf_4", type: "tf", question: "Proses masuknya Islam ke Indonesia berlangsung secara damai tanpa invasi militer.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Berbeda dengan banyak wilayah lain, Islam menyebar di Nusantara secara damai." },
      { id: "fe_tf_5", type: "tf", question: "Kjokkenmoddinger membuktikan manusia purba sudah membangun kota besar.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Kjokkenmoddinger hanya membuktikan mereka menetap sementara di pesisir." },
      { id: "fe_tf_6", type: "tf", question: "Cara berpikir sinkronis adalah cara berpikir yang meluas dalam ruang pada satu waktu tertentu.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Sinkronis = membahas suatu masa secara mendalam dari berbagai aspek." },
      { id: "fe_tf_7", type: "tf", question: "Teori Arus Balik menyatakan bahwa orang India yang aktif datang ke Nusantara.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Teori Arus Balik (F.D.K. Bosch) justru menyatakan orang Nusantara yang aktif belajar ke India." },
      { id: "fe_tf_8", type: "tf", question: "Wayang Kulit digunakan Sunan Kalijaga sebagai media dakwah Islam di Jawa.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Sunan Kalijaga memodifikasi cerita wayang dengan nilai-nilai Islam." },
      { id: "fe_tf_9", type: "tf", question: "Masa Perundagian ditandai dengan kemampuan manusia membuat alat dari logam.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Perundagian = era logam, dari kata Undagi (ahli/tukang)." },
      { id: "fe_tf_10", type: "tf", question: "Kerajaan Majapahit terletak di Kalimantan dan berdiri pada abad ke-14 M.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Majapahit terletak di Jawa Timur (Trowulan), berdiri abad ke-13 M (1293)." },
      // === COCOKKAN (5 pasang) ===
      { id: "fe_match_1", type: "matching",
        pairs: [
          { left: "Prasasti Yupa", right: "Kerajaan Kutai" },
          { left: "Gajah Mada", right: "Sumpah Palapa" },
          { left: "Eugene Dubois", right: "Pithecanthropus Erectus" },
          { left: "Samudera Pasai", right: "Kesultanan Islam pertama" },
          { left: "Cultuurstelsel", right: "Tanam Paksa Belanda" },
        ]
      },
    ]
  },
  fase_f: {
    id: "fase_f",
    title: "Evaluasi Akhir Fase F",
    description: "Ujian komprehensif meliputi Kolonialisme, Pergerakan Nasional, hingga Reformasi",
    totalQuestions: 30,
    passingScore: 70,
    goodScore: 85,
    excellentScore: 95,
    questions: [
      // === PG (15 soal) ===
      { id: "ff_pg_1", type: "pg", question: "VOC bangkrut pada tahun 1799 karena...", options: ["Kalah perang dengan Inggris", "Korupsi internal yang parah", "Kehabisan armada kapal", "Dilarang oleh Ratu Belanda"], correctAnswer: 1, explanation: "VOC runtuh akibat korupsi masif yang menggerogoti keuangannya dari dalam." },
      { id: "ff_pg_2", type: "pg", question: "Perang Diponegoro berlangsung dari tahun...", options: ["1800-1810", "1815-1820", "1825-1830", "1835-1840"], correctAnswer: 2, explanation: "Perang Diponegoro 1825-1830, menguras kas Belanda hampir habis." },
      { id: "ff_pg_3", type: "pg", question: "Taktik Belanda memecah belah kekuatan pribumi disebut...", options: ["Cultuurstelsel", "Devide et Impera", "Politik Etis", "Hak Oktroi"], correctAnswer: 1, explanation: "Devide et Impera = pecah belah dan kuasai, senjata ampuh Belanda." },
      { id: "ff_pg_4", type: "pg", question: "Organisasi modern pertama Indonesia yang didirikan tahun 1908 adalah...", options: ["Sarekat Islam", "Indische Partij", "Budi Utomo", "PKI"], correctAnswer: 2, explanation: "Budi Utomo didirikan 20 Mei 1908 oleh dr. Wahidin Sudirohusodo." },
      { id: "ff_pg_5", type: "pg", question: "Sumpah Pemuda diikrarkan pada tahun...", options: ["1920", "1925", "1928", "1930"], correctAnswer: 2, explanation: "Sumpah Pemuda 28 Oktober 1928 menyatukan pemuda Nusantara." },
      { id: "ff_pg_6", type: "pg", question: "Jepang masuk ke Indonesia pada tahun 1942 dengan slogan...", options: ["Asia untuk Asia Timur Raya", "Nipon Cahaya Asia", "Bebaskan Nusantara", "Saudara Tua Asia"], correctAnswer: 1, explanation: "Propaganda 'Nipon Cahaya Asia' untuk menarik simpati rakyat." },
      { id: "ff_pg_7", type: "pg", question: "Pasukan bentukan Jepang yang menjadi cikal bakal TNI adalah...", options: ["Heiho", "Seinendan", "PETA", "Keibodan"], correctAnswer: 2, explanation: "PETA (Pembela Tanah Air) melahirkan perwira seperti Jenderal Sudirman." },
      { id: "ff_pg_8", type: "pg", question: "Pada 17 Agustus 1945, bendera merah putih dijahit oleh...", options: ["Ibu Inggit Garnasih", "Ibu Fatmawati", "Cut Nyak Dien", "Raden Ajeng Kartini"], correctAnswer: 1, explanation: "Ibu Fatmawati menjahit bendera merah putih yang dikibarkan saat proklamasi." },
      { id: "ff_pg_9", type: "pg", question: "Sistem pemerintahan Indonesia 1950-1959 menggunakan...", options: ["Demokrasi Terpimpin", "Demokrasi Pancasila", "Demokrasi Parlementer", "Demokrasi Liberal Penuh"], correctAnswer: 2, explanation: "Era Demokrasi Parlementer ditandai kabinet yang sering berganti." },
      { id: "ff_pg_10", type: "pg", question: "Dekrit Presiden Soekarno 5 Juli 1959 mengakhiri era...", options: ["Orde Baru", "Demokrasi Parlementer", "Reformasi", "Pendudukan Jepang"], correctAnswer: 1, explanation: "Soekarno membubarkan konstituante dan kembali ke UUD 1945." },
      { id: "ff_pg_11", type: "pg", question: "G30S/PKI terjadi pada malam...", options: ["17 Agustus 1965", "30 September 1965", "1 Oktober 1966", "21 Mei 1965"], correctAnswer: 1, explanation: "Malam 30 September 1965 terjadi penculikan dan pembunuhan 6 jenderal." },
      { id: "ff_pg_12", type: "pg", question: "Program pembangunan lima tahunan Soeharto bernama...", options: ["Repelita", "Pelita", "Pembangunan Lima Tahun", "Rencana Nasional"], correctAnswer: 0, explanation: "Repelita = Rencana Pembangunan Lima Tahun, berhasil swasembada beras." },
      { id: "ff_pg_13", type: "pg", question: "Krisis moneter 1997 menyebabkan kurs rupiah jatuh dari Rp 2.500 menjadi...", options: ["Rp 5.000", "Rp 8.000", "Rp 16.000", "Rp 25.000"], correctAnswer: 2, explanation: "Krismon 1997 melumpuhkan ekonomi Indonesia, rupiah jatuh ke Rp 16.000/dolar." },
      { id: "ff_pg_14", type: "pg", question: "Soeharto mundur dari jabatan presiden pada tanggal...", options: ["17 Agustus 1997", "21 Mei 1998", "1 Juni 1998", "10 November 1998"], correctAnswer: 1, explanation: "21 Mei 1998, Soeharto mengundurkan diri setelah 32 tahun berkuasa." },
      { id: "ff_pg_15", type: "pg", question: "Empat mahasiswa Trisakti yang gugur pada Mei 1998 menjadi simbol...", options: ["Perjuangan Orde Baru", "Gerakan Reformasi", "Demonstrasi Anti-Islam", "Pemberontakan PKI"], correctAnswer: 1, explanation: "Tragedi Trisakti memicu kerusuhan dan mempercepat jatuhnya Soeharto." },
      // === BENAR/SALAH (10 soal) ===
      { id: "ff_tf_1", type: "tf", question: "VOC adalah perusahaan dagang pertama yang menerbitkan saham di dunia.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. VOC adalah perusahaan saham pertama dalam sejarah dunia." },
      { id: "ff_tf_2", type: "tf", question: "Perang Aceh adalah perang terpendek melawan Belanda di Indonesia.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Perang Aceh (1873-1904) justru TERPANJANG dan paling berdarah." },
      { id: "ff_tf_3", type: "tf", question: "Budi Utomo adalah organisasi yang pertama kali menuntut kemerdekaan Indonesia.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Indische Partij yang pertama menuntut Indonesia Merdeka secara terang-terangan." },
      { id: "ff_tf_4", type: "tf", question: "Jepang menjajah Indonesia selama 3,5 tahun (1942-1945).", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Meski singkat, penjajahan Jepang sangat brutal dengan sistem Romusha." },
      { id: "ff_tf_5", type: "tf", question: "Proklamasi Kemerdekaan Indonesia dibacakan di Rengasdengklok.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Proklamasi dibacakan di Jl. Pegangsaan Timur No.56, Jakarta." },
      { id: "ff_tf_6", type: "tf", question: "Era Demokrasi Terpimpin ditandai dengan sering bergantinya kabinet.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Kabinet sering berganti terjadi di era Demokrasi Parlementer (1950-1959)." },
      { id: "ff_tf_7", type: "tf", question: "Soeharto berhasil mencapai swasembada beras di era Orde Baru.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Swasembada beras adalah prestasi nyata Orde Baru di bidang pangan." },
      { id: "ff_tf_8", type: "tf", question: "Era Reformasi dimulai setelah Soeharto mundur pada tahun 1998.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Reformasi 1998 membuka era kebebasan pers dan demokrasi yang lebih terbuka." },
      { id: "ff_tf_9", type: "tf", question: "Politik Etis Belanda bertujuan meningkatkan kesejahteraan rakyat pribumi.", options: ["Benar", "Salah"], correctAnswer: 1, explanation: "Salah. Tujuan sebenarnya mencetak pegawai murah untuk kepentingan Belanda, meski ada dampak positifnya." },
      { id: "ff_tf_10", type: "tf", question: "Romusha adalah sistem kerja paksa yang diterapkan Jepang pada masa pendudukan.", options: ["Benar", "Salah"], correctAnswer: 0, explanation: "Benar. Ratusan ribu pria dipaksa menjadi Romusha dan banyak yang tidak kembali." },
      // === COCOKKAN (5 pasang) ===
      { id: "ff_match_1", type: "matching",
        pairs: [
          { left: "Daendels", right: "Jalan Raya Pos Anyer-Panarukan" },
          { left: "Pangeran Diponegoro", right: "Perang Gerilya 1825-1830" },
          { left: "H.O.S. Tjokroaminoto", right: "Pemimpin Sarekat Islam" },
          { left: "Soeharto", right: "Orde Baru & Repelita" },
          { left: "Proklamasi", right: "17 Agustus 1945" },
        ]
      },
    ]
  }
};
