import fs from 'fs';
import { faseE_materi } from './fase_e_materi.js';
import { faseE_quizzes } from './fase_e_quizzes.js';

// 1. Update historyContent.js
let contentRaw = fs.readFileSync('src/data/historyContent.js', 'utf8');

// We will use regex to find and replace contentByLevel for chapters 1, 2, 3, 4
// But a safer way is to just generate the entire historyContent.js. 
// Since we generated it just previously, let's just rewrite the whole file with the new Fase E content, 
// and keep Fase F Awal and Fase F as they were.

const newHistoryPhases = [
  {
    id: "fase_e",
    title: "Fase E: Indonesia Masa Praaksara hingga Kerajaan Islam",
    description: "Mempelajari akar sejarah, asal usul leluhur, masa praaksara, hingga kejayaan kerajaan Hindu-Buddha dan Islam di Nusantara.",
    chapters: faseE_materi.map(ch => ({
      id: ch.id,
      title: ch.title,
      summary: ch.summary,
      contentByLevel: ch.contentByLevel
    }))
  },
  {
    id: "fase_f_awal",
    title: "Fase F Awal: Kolonialisme & Pergerakan Nasional",
    description: "Menganalisis masa penjajahan bangsa Eropa, bangkitnya kesadaran nasional, hingga kependudukan Jepang.",
    chapters: [
      {
        id: "chap_5",
        title: "Kolonialisme & Perlawanan",
        summary: "Eksploitasi bangsa Barat (VOC hingga Hindia Belanda) dan perlawanan rakyat daerah.",
        contentByLevel: {
          0: `<h2>🛡️ Melawan Penjajah demi Harga Diri!</h2><p>Bangsa Eropa datang mencari rempah-rempah. VOC memonopoli dagang dan Belanda menerapkan Tanam Paksa. Pahlawan kita seperti Diponegoro dan Cut Nyak Dhien berjuang mengangkat senjata melawan mereka!</p>`,
          1: `<h2>⛓️ Mekanisme Eksploitasi Kolonial</h2><p>Kebijakan ekstraktif seperti Cultuurstelsel dan Kerja Rodi menghancurkan ekonomi lokal. Belanda menggunakan politik adu domba (Devide et Impera) untuk memecah belah kerajaan Nusantara.</p>`,
          2: `<h2>🔬 Ekonomi Politik Imperialisme Modern</h2><p>UU Agraria 1870 membuka pintu investasi swasta asing, mengubah Nusantara menjadi ekonomi perkebunan (Export-Oriented). Hal ini memicu protes sosial dan pemberontakan petani.</p>`,
          3: `<h2>🎓 Warisan Post-Kolonial dan Dekolonisasi</h2><p>Mengkaji struktur hukum, birokrasi, dan tata kota peninggalan Belanda, serta pentingnya dekolonisasi mental untuk lepas dari inferioritas kolonial yang masih tersisa.</p>`
        }
      },
      {
        id: "chap_6",
        title: "Pergerakan Nasional",
        summary: "Tumbuhnya kesadaran kebangsaan dan lahirnya organisasi-organisasi pergerakan.",
        contentByLevel: {
          0: `<h2>✊ Pemuda Bersatu untuk Merdeka!</h2><p>Perjuangan berubah dari angkat senjata menjadi menggunakan otak dan pena! Pemuda mendirikan Budi Utomo, Sarekat Islam, dan bersumpah dalam Sumpah Pemuda 1928 untuk bersatu menjadi bangsa Indonesia.</p>`,
          1: `<h2>📚 Budi Utomo hingga Sumpah Pemuda</h2><p>Dampak Politik Etis (Edukasi) melahirkan kaum intelektual. Lahir organisasi kedaerahan hingga nasional. Sumpah Pemuda menyatukan bahasa, bangsa, dan tanah air Indonesia.</p>`,
          2: `<h2>🔬 Ideologi Pergerakan Nasional</h2><p>Tiga aliran besar mewarnai pergerakan: Nasionalisme (PNI), Islamisme (SI), dan Komunisme (PKI). Mereka berjuang di Volksraad (parlemen) maupun secara non-kooperatif melawan Hindia Belanda.</p>`,
          3: `<h2>🎓 Konstruksi Identitas 'Indonesia'</h2><p>Konsep 'Indonesia' awalnya hanyalah istilah geografis yang kemudian direkayasa menjadi identitas politik kebangsaan (Imagined Communities) untuk melawan konstruksi kolonial Hindia Belanda.</p>`
        }
      },
      {
        id: "chap_7",
        title: "Pendudukan Jepang & Proklamasi",
        summary: "Masa singkat di bawah militerisme Jepang yang berujung pada momentum kemerdekaan 1945.",
        contentByLevel: {
          0: `<h2>🇯🇵 Datangnya Saudara Tua dan 🇮🇩 Kemerdekaan</h2><p>Jepang datang menjajah dengan kejam lewat Romusha. Tapi dari situ pemuda kita belajar militer. Saat Jepang kalah, Soekarno-Hatta memproklamasikan Kemerdekaan Indonesia pada 17 Agustus 1945!</p>`,
          1: `<h2>⚔️ Militerisasi Masyarakat dan Janji Kemerdekaan</h2><p>Jepang membentuk organisasi militer (PETA, Heiho) untuk perangnya. Golongan muda (Sjahrir, Chaerul Saleh) memaksa Soekarno lewat peristiwa Rengasdengklok agar segera memproklamasikan kemerdekaan secara mandiri.</p>`,
          2: `<h2>🔬 Dinamika Vacuum of Power</h2><p>Kekosongan kekuasaan pasca bom atom dimanfaatkan Indonesia. PPKI mengesahkan UUD 1945, memilih presiden, dan membentuk kelengkapan negara. Kemerdekaan adalah hasil perjuangan, bukan hadiah Jepang.</p>`,
          3: `<h2>🎓 Proklamasi sebagai Kontrak Sosial Baru</h2><p>Proklamasi menghapus tata hukum kolonial (konstitusi lama) dan melahirkan tata hukum nasional baru. Ini merupakan revolusi hukum dan konsensus tertinggi seluruh elemen bangsa.</p>`
        }
      }
    ]
  },
  {
    id: "fase_f",
    title: "Fase F: Revolusi, Demokrasi, hingga Reformasi",
    description: "Mempelajari dinamika mempertahankan kemerdekaan, era Demokrasi terpimpin, Orde Baru, hingga era Reformasi.",
    chapters: [
      {
        id: "chap_8",
        title: "Mempertahankan Kemerdekaan",
        summary: "Perjuangan fisik dan diplomasi dalam mempertahankan kemerdekaan dari Agresi Militer Belanda.",
        contentByLevel: {
          0: `<h2>🔥 Merdeka atau Mati!</h2><p>Belanda ingin menjajah lagi. Jenderal Sudirman memimpin perang gerilya di hutan. Para diplomat kita berjuang di PBB. Berkat keberanian rakyat, Belanda akhirnya menyerah pada 1949.</p>`,
          1: `<h2>🤝 Strategi Senjata dan Pena</h2><p>Perjuangan dilakukan dua jalur: Perang Fisik (Agresi Militer I dan II) dan Perundingan (Linggarjati, Renville, Roem-Royen, KMB). KMB 1949 memberikan pengakuan kedaulatan Indonesia secara penuh.</p>`,
          2: `<h2>🔬 Dinamika Internal Revolusi</h2><p>Di tengah ancaman Belanda, Indonesia menghadapi gejolak internal seperti pemberontakan PKI Madiun 1948 dan DI/TII. Ini ujian berat bagi kesatuan NKRI yang baru seumur jagung.</p>`,
          3: `<h2>🎓 Historiografi Revolusi Indonesia</h2><p>Revolusi nasional bukan sekadar perang kemerdekaan, tetapi juga revolusi sosial (runtuhnya aristokrasi lokal) dan panggung diplomasi internasional di awal Perang Dingin.</p>`
        }
      },
      {
        id: "chap_9",
        title: "Demokrasi Liberal & Terpimpin",
        summary: "Dinamika politik kabinet parlementer (Liberal) hingga pemusatan kekuasaan di era Terpimpin.",
        contentByLevel: {
          0: `<h2>⚖️ Mencari Bentuk Negara yang Pas</h2><p>Dulu kita mencoba sistem banyak partai tapi pemerintahan sering ganti. Soekarno lalu mengambil alih (Demokrasi Terpimpin) untuk menstabilkan negara, namun diakhiri oleh peristiwa G30S 1965.</p>`,
          1: `<h2>🏛️ Jatuh Bangun Kabinet Demokrasi Parlementer</h2><p>Ketidakstabilan politik (7 kabinet dalam 9 tahun) membuat pembangunan terhambat. Pemilu 1955 sukses, namun Konstituante gagal menyusun UUD, memicu keluarnya Dekrit Presiden 1959.</p>`,
          2: `<h2>🔬 Politik Mercusuar dan Konfrontasi</h2><p>Era Terpimpin diwarnai politik luar negeri agresif (Trikora melawan Belanda, Dwikora melawan Malaysia) dan proyek mercusuar (Monas) untuk menunjukkan kebesaran Indonesia di mata dunia (NEFO).</p>`,
          3: `<h2>🎓 Hegemoni Kekuasaan dan Tragedi 1965</h2><p>Pertarungan segitiga kekuasaan (Soekarno, Angkatan Darat, dan PKI) berujung pada krisis politik, penculikan jenderal (G30S), dan transisi kekuasaan ke tangan Jenderal Soeharto (Supersemar).</p>`
        }
      },
      {
        id: "chap_10",
        title: "Orde Baru & Era Reformasi",
        summary: "Pembangunan ekonomi di bawah Orde Baru hingga krisis moneter dan lahirnya Reformasi 1998.",
        contentByLevel: {
          0: `<h2>🏗️ Era Pembangunan dan Lahirnya Reformasi</h2><p>Presiden Soeharto berkuasa selama 32 tahun, membangun jalan dan sekolah. Namun karena krisis ekonomi dan korupsi, mahasiswa berdemo pada 1998 untuk menuntut keadilan (Reformasi).</p>`,
          1: `<h2>⚙️ Stabilitas Politik dan Pertumbuhan Ekonomi</h2><p>Orde Baru menstabilkan negara lewat penyederhanaan partai, Dwifungsi ABRI, dan rencana pembangunan lima tahun (Repelita). Namun, kebebasan berpendapat sangat dibatasi.</p>`,
          2: `<h2>📉 Krisis Moneter dan Jatuhnya Rezim</h2><p>Krisis finansial Asia 1997 memicu krisis multidimensi. Tuntutan reformasi dari mahasiswa dan tokoh masyarakat berhasil memaksa Soeharto lengser pada 21 Mei 1998.</p>`,
          3: `<h2>🎓 Transisi Demokrasi dan Tantangan Global</h2><p>Era Reformasi membawa kebebasan pers, pemilu langsung, amandemen UUD 1945, dan desentralisasi. Tantangannya adalah konsolidasi demokrasi dan pemberantasan KKN di era globalisasi.</p>`
        }
      }
    ]
  }
];

fs.writeFileSync('src/data/historyContent.js', 'export const historyPhases = ' + JSON.stringify(newHistoryPhases, null, 2) + ';');

// 2. Update historyQuizzes.js
let existingQuizzes = {};
if (fs.existsSync('src/data/historyQuizzes.js')) {
  // Read existing file and parse if possible. For simplicity, just append to it or rewrite completely.
  // We'll just read and try to extract the JSON.
  // Actually, since we're restructuring 10 chapters, let's start fresh or merge carefully.
}

let newQuizzes = Object.assign({}, faseE_quizzes);
// We will just export this for now. In the next steps we will add fase F.
let quizzesOutput = 'export const historyQuizzes = ' + JSON.stringify(newQuizzes, null, 2) + ';';
fs.writeFileSync('src/data/historyQuizzes.js', quizzesOutput);

console.log("Successfully patched historyContent.js and historyQuizzes.js with Fase E content.");
