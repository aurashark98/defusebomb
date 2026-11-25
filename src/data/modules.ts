import { DefusalModule, GameSettings } from '../types/game';

export const DEFAULT_SETTINGS: GameSettings = {
  totalTimeSeconds: 1200, // 20 menit
  maxStrikes: 3,
  penaltyPerStrikeSeconds: 45, // -45 detik tiap salah
};

export const getFreshModules = (): DefusalModule[] => JSON.parse(JSON.stringify(INITIAL_MODULES));

export const INITIAL_MODULES: DefusalModule[] = [
  // ── 01. SOAL 1: Sensor Citra Medis (Pencahayaan Berbeda)
  {
    id: 'mod-1',
    title: 'MODUL 01: SENSOR CITRA MEDIS MATA',
    category: 'Model Evaluation',
    type: 'tactical-choice',
    description: 'Sebuah AI digunakan untuk mendeteksi penyakit melalui foto mata. Namun, hasil deteksinya sering salah ketika foto diambil dengan pencahayaan berbeda. Apa kemungkinan penyebab utamanya?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-1a',
        text: 'A. AI tidak memiliki kemampuan mengenali gambar.',
        isCorrect: false,
        explanation: 'SALAH! AI computer vision mampu mengenali gambar, namun sangat bergantung pada data pelatihannya.'
      },
      {
        id: 'opt-1b',
        text: 'B. Data pelatihan kurang bervariasi sehingga AI kesulitan mengenali kondisi baru.',
        isCorrect: true,
        explanation: 'BENAR! Kurangnya variasi augmentasi data (pencahayaan, sudut, kontras) membuat model gagal melakukan generalisasi pada kondisi baru.'
      },
      {
        id: 'opt-1c',
        text: 'C. AI hanya dapat digunakan untuk kebutuhan kesehatan tertentu.',
        isCorrect: false,
        explanation: 'SALAH! AI dapat diterapkan pada berbagai cabang medis selama data pelatihannya memadai.'
      },
      {
        id: 'opt-1d',
        text: 'D. Sistem AI membutuhkan koneksi internet yang lebih cepat.',
        isCorrect: false,
        explanation: 'SALAH! Kecepatan internet tidak mempengaruhi akurasi inferensi model AI yang sudah terpasang.'
      }
    ]
  },

  // ── 02. SOAL 2: Bias Data Rekrutmen
  {
    id: 'mod-2',
    title: 'MODUL 02: KABEL BIAS DATA REKRUTMEN',
    category: 'Data Preprocessing',
    type: 'cut-wire',
    description: 'Sebuah perusahaan melatih AI menggunakan 10.000 data pelamar kerja, namun 90% data berasal dari laki-laki sehingga AI cenderung memilih pelamar laki-laki. Potong KABEL MASALAH UTAMA kasus ini!',
    isDefused: false,
    penaltySeconds: 45,
    wires: [
      {
        id: 'w-red',
        color: 'red',
        label: 'A. Overfitting (data terlalu banyak)',
        isCorrect: false,
        explanation: 'SALAH! 10.000 data bukanlah penyebab overfitting, masalahnya ada pada proporsi demografis data.'
      },
      {
        id: 'w-blue',
        color: 'blue',
        label: 'B. Algoritma gagal membaca teks CV',
        isCorrect: false,
        explanation: 'SALAH! Algoritma membaca CV dengan baik, namun pola yang dipelajarinya bias gender.'
      },
      {
        id: 'w-yellow',
        color: 'yellow',
        label: 'C. Bias data (keputusan tidak adil)',
        isCorrect: true,
        explanation: 'BENAR! Data historis yang tidak seimbang (90% pria) menyebabkan algoritma menganggap gender pria sebagai fitur prediktif unggul.'
      },
      {
        id: 'w-green',
        color: 'green',
        label: 'D. Kegagalan sistem tanpa internet',
        isCorrect: false,
        explanation: 'SALAH! Masalah keadilan model tidak berkaitan dengan konektivitas jaringan.'
      }
    ]
  },

  // ── 03. SOAL 3: Rekognisi Pola vs Pemahaman Manusia
  {
    id: 'mod-3',
    title: 'MODUL 03: POLA VS PEMAHAMAN MANUSIA',
    category: 'Model Training',
    type: 'tactical-choice',
    description: 'Mengapa AI tidak bisa langsung dianggap memahami suatu objek seperti manusia ketika mengenali gambar kucing?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-3a',
        text: 'A. AI hanya dapat menyimpan gambar tanpa mengolahnya.',
        isCorrect: false,
        explanation: 'SALAH! AI memproses matriks piksel dan mengekstrak fitur matematis, bukan sekadar menyimpan.'
      },
      {
        id: 'opt-3b',
        text: 'B. AI mengenali pola berdasarkan data latih, bukan memahami konsep objek seperti manusia.',
        isCorrect: true,
        explanation: 'TEPAT! AI bekerja berbasis korelasi statistik piksel (garis, tekstur, warna), bukan kesadaran konseptual atau semantik objek.'
      },
      {
        id: 'opt-3c',
        text: 'C. AI tidak dapat membedakan bentuk dan warna.',
        isCorrect: false,
        explanation: 'SALAH! Komputer mengenali channel warna RGB dan gradien tepi bentuk dengan sangat akurat.'
      },
      {
        id: 'opt-3d',
        text: 'D. AI selalu membutuhkan manusia untuk identifikasi setiap gambar.',
        isCorrect: false,
        explanation: 'SALAH! Setelah dilatih, model AI mampu melakukan inferensi mandiri tanpa campur tangan manusia tiap saat.'
      }
    ]
  },

  // ── 04. SOAL 4: Pengujian Model pada Data Baru
  {
    id: 'mod-4',
    title: 'MODUL 04: PROTOKOL EVALUASI MODEL',
    category: 'Model Evaluation',
    type: 'tactical-choice',
    description: 'Dalam proses pengembangan AI, sebuah model sudah selesai dilatih. Namun model belum pernah dicoba menggunakan data baru. Tahapan apa yang seharusnya dilakukan selanjutnya?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-4a',
        text: 'A. Mengumpulkan data kembali dari awal.',
        isCorrect: false,
        explanation: 'SALAH! Tidak perlu mengulang dari awal jika model sudah dilatih dengan benar.'
      },
      {
        id: 'opt-4b',
        text: 'B. Langsung menggunakan model dalam dunia nyata.',
        isCorrect: false,
        explanation: 'BAHAYA! Menerapkan model tanpa validasi berisiko menimbulkan kegagalan fatal pada lingkungan produksi.'
      },
      {
        id: 'opt-4c',
        text: 'C. Melakukan pengujian (testing) untuk mengetahui akurasi & generalisasi model.',
        isCorrect: true,
        explanation: 'BENAR! Tahap Evaluasi / Testing dengan data uji (unseen test set) wajib dilakukan untuk memvalidasi performa nyata model.'
      },
      {
        id: 'opt-4d',
        text: 'D. Menghapus model dan menggantinya dengan algoritma lain.',
        isCorrect: false,
        explanation: 'SALAH! Kita belum tahu performa model tersebut sebelum diuji, jadi jangan langsung dihapus.'
      }
    ]
  },

  // ── 05. SOAL 5: Kucing Hitam vs Kucing Putih (Diversifikasi Data)
  {
    id: 'mod-5',
    title: 'MODUL 05: KABEL DIVERSIFIKASI DATASET',
    category: 'Data Preprocessing',
    type: 'cut-wire',
    description: 'Sebuah AI hanya dilatih gambar kucing putih. Ketika diberi gambar kucing hitam, AI mengidentifikasinya sebagai anjing. Potong KABEL SOLUSI PALING TEPAT!',
    isDefused: false,
    penaltySeconds: 45,
    wires: [
      {
        id: 'w-red',
        color: 'red',
        label: 'A. Menambah jumlah kucing putih',
        isCorrect: false,
        explanation: 'SALAH! Ini justru akan semakin memperparah bias model terhadap kucing berwarna putih saja.'
      },
      {
        id: 'w-blue',
        color: 'blue',
        label: 'B. Mengurangi data pelatihan',
        isCorrect: false,
        explanation: 'SALAH! Mengurangi data latih tidak menyelesaikan masalah representasi warna.'
      },
      {
        id: 'w-green',
        color: 'green',
        label: 'C. Menambah data kucing variasi warna & kondisi',
        isCorrect: true,
        explanation: 'BENAR! Menambahkan dataset dengan variasi warna (hitam, belang, oranye) dan kondisi pencahayaan akan memperluas generalisasi fitur kucing.'
      },
      {
        id: 'w-yellow',
        color: 'yellow',
        label: 'D. Mengganti semua data jadi anjing',
        isCorrect: false,
        explanation: 'SALAH! Ini akan merusak klasifikasi kucing dan mengubah tujuan model secara keliru.'
      }
    ]
  },

  // ── 06. SOAL 6: Deep Blue & AlphaGo (Evolusi Kompleksitas AI)
  {
    id: 'mod-6',
    title: 'MODUL 06: EVOLUSI KOMPLEKSITAS AI',
    category: 'Model Training',
    type: 'tactical-choice',
    description: 'Deep Blue berhasil mengalahkan juara catur pada 1997, sedangkan AlphaGo mengalahkan juara Go pada 2016. Hal ini menunjukkan bahwa ...',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-6a',
        text: 'A. AI hanya dapat digunakan untuk permainan strategi papan.',
        isCorrect: false,
        explanation: 'SALAH! Game adalah benchmark pengujian; teknologi intinya diterapkan di berbagai bidang luas.'
      },
      {
        id: 'opt-6b',
        text: 'B. Kemampuan AI berkembang dalam menyelesaikan permasalahan yang semakin kompleks.',
        isCorrect: true,
        explanation: 'BENAR! Dari pencarian pohon berbasis aturan (Deep Blue) ke pembelajaran mendalam & Reinforcement Learning intuitif (AlphaGo).'
      },
      {
        id: 'opt-6c',
        text: 'C. Semua permainan dapat diselesaikan AI tanpa proses pelatihan.',
        isCorrect: false,
        explanation: 'SALAH! AlphaGo membutuhkan jutaan kali self-play dan pelatihan data intensif.'
      },
      {
        id: 'opt-6d',
        text: 'D. AI sudah memiliki kecerdasan yang sama persis dengan manusia.',
        isCorrect: false,
        explanation: 'SALAH! AlphaGo adalah Narrow AI (spesifik satu domain), bukan Artificial General Intelligence (AGI).'
      }
    ]
  },

  // ── 07. SOAL 7: Label Noise Cleanup (Terminal CRT)
  {
    id: 'mod-7',
    title: 'MODUL 07: TERMINAL LABEL DATA CORRECTION',
    category: 'Data Preprocessing',
    type: 'terminal-fix',
    description: 'Pengembang menemukan AI sering salah prediksi karena beberapa foto dalam dataset diberi label yang keliru (label noise). Pilih instruksi terminal yang tepat!',
    isDefused: false,
    penaltySeconds: 45,
    terminalData: {
      context: 'CRITICAL ERROR: Ground Truth Annotation Mismatch Detected in Training Dataset',
      brokenCode: `for img in dataset:\n    if detect_mislabeled(img):\n        # [ANOMALI] Anotasi label bertentangan dengan ground truth objek!\n        ignore_and_train_anyway(img)`,
      options: [
        {
          id: 'tf-1',
          codeSnippet: 'A. Memperbesar kapasitas penyimpanan dataset.',
          isCorrect: false,
          explanation: 'SALAH! Menambah kapasitas hard disk tidak memperbaiki kualitas atau kebenaran data.'
        },
        {
          id: 'tf-2',
          codeSnippet: 'B. Menghapus seluruh sistem AI.',
          isCorrect: false,
          explanation: 'SALAH! Masalah ada pada data anotasi, bukan pada arsitektur sistem secara keseluruhan.'
        },
        {
          id: 'tf-3',
          codeSnippet: 'C. Memperbaiki label data agar sesuai dengan objek sebenarnya (Ground Truth).',
          isCorrect: true,
          explanation: 'BENAR! Membersihkan label noise (relabelling / data curation) adalah langkah paling esensial agar model mempelajari pola yang benar.'
        },
        {
          id: 'tf-4',
          codeSnippet: 'D. Menambahkan lebih banyak data tanpa memeriksa kualitasnya.',
          isCorrect: false,
          explanation: 'SALAH! Prinsip "Garbage In, Garbage Out": menambah data kotor hanya akan memperburuk performa model.'
        }
      ]
    }
  },

  // ── 08. SOAL 8: Google Maps & Pola Data
  {
    id: 'mod-8',
    title: 'MODUL 08: PREDIKSI DINAMIS GOOGLE MAPS',
    category: 'Model Evaluation',
    type: 'tactical-choice',
    description: 'Google Maps mampu memprediksi kemacetan dan estimasi waktu tiba (ETA). Kemampuan tersebut merupakan contoh penerapan AI yang memanfaatkan ...',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-8a',
        text: 'A. Pola data historis & real-time untuk memprediksi kondisi perjalanan.',
        isCorrect: true,
        explanation: 'TEPAT! AI menggabungkan pola pergerakan GPS pengguna secara real-time dengan tren data historis hari/jam serupa.'
      },
      {
        id: 'opt-8b',
        text: 'B. Perintah manual dari seluruh pengguna jalan.',
        isCorrect: false,
        explanation: 'SALAH! Pengguna tidak menginput perintah manual kemacetan secara terus-menerus; data diserap otomatis dari sensor GPS.'
      },
      {
        id: 'opt-8c',
        text: 'C. Data statis yang tidak pernah berubah.',
        isCorrect: false,
        explanation: 'SALAH! Kemacetan bersifat dinamis dan fluktuatif setiap detiknya.'
      },
      {
        id: 'opt-8d',
        text: 'D. Sistem yang hanya menghitung jarak lurus antarwilayah.',
        isCorrect: false,
        explanation: 'SALAH! Perhitungan jarak statis tidak bisa memprediksi kemacetan atau waktu tempuh dinamis.'
      }
    ]
  },

  // ── 09. SOAL 9: Urutan Proses Teachable Machine (Tactical Choice)
  {
    id: 'mod-9',
    title: 'MODUL 09: ALUR PROSES TEACHABLE MACHINE',
    category: 'Model Training',
    type: 'tactical-choice',
    description: 'Seorang siswa ingin membuat AI yang dapat membedakan gerakan tangan kanan dan kiri menggunakan Teachable Machine. Urutan proses yang paling tepat adalah ...',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-9a',
        text: 'A. Menguji model, menggunakan model, mengumpulkan data, lalu melatih model.',
        isCorrect: false,
        explanation: 'SALAH! Pengujian dan deployment tidak bisa dilakukan sebelum data dikumpulkan dan model dilatih.'
      },
      {
        id: 'opt-9b',
        text: 'B. Mengumpulkan gambar gerakan, melatih model, menguji hasilnya, lalu menggunakan model.',
        isCorrect: true,
        explanation: 'BENAR! Tahapan pipeline AI: 1. Kumpulkan data gambar -> 2. Latih model -> 3. Uji hasilnya -> 4. Gunakan (export/deploy) model.'
      },
      {
        id: 'opt-9c',
        text: 'C. Melatih model, mengumpulkan gambar, menggunakan model, lalu menguji hasilnya.',
        isCorrect: false,
        explanation: 'SALAH! Pelatihan model memerlukan data di awal, tidak mungkin melatih tanpa sampel data.'
      },
      {
        id: 'opt-9d',
        text: 'D. Menggunakan model, menguji hasilnya, lalu mengumpulkan data.',
        isCorrect: false,
        explanation: 'SALAH! Alur terbalik, data harus dikumpulkan pertama kali sebelum melatih atau menguji.'
      }
    ]
  },

  // ── 10. SOAL 10: Sistem Rekomendasi E-Commerce
  {
    id: 'mod-10',
    title: 'MODUL 10: SISTEM REKOMENDASI PRODUK',
    category: 'EDA',
    type: 'tactical-choice',
    description: 'Sebuah perusahaan mengumpulkan data pencarian, riwayat pembelian, dan produk yang dilihat pengguna. Mengapa data tersebut sangat penting bagi AI?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-10a',
        text: 'A. Agar AI dapat menentukan produk yang wajib dibeli oleh pengguna.',
        isCorrect: false,
        explanation: 'SALAH! AI pemberi rekomendasi tidak memaksakan pembelian, hanya memberikan opsi yang relevan.'
      },
      {
        id: 'opt-10b',
        text: 'B. Menemukan pola preferensi pengguna dan memberikan rekomendasi yang relevan.',
        isCorrect: true,
        explanation: 'BENAR! Collaborative filtering & content-based filtering menggunakan riwayat interaksi untuk memahami minat spesifik pengguna.'
      },
      {
        id: 'opt-10c',
        text: 'C. Agar AI dapat menggantikan seluruh proses transaksi perbankan.',
        isCorrect: false,
        explanation: 'SALAH! Transaksi keuangan ditangani oleh payment gateway, bukan algoritma rekomendasi belanja.'
      },
      {
        id: 'opt-10d',
        text: 'D. Agar AI dapat mengetahui seluruh informasi pribadi rahasia pengguna.',
        isCorrect: false,
        explanation: 'SALAH! Pengumpulan data bertujuan memetakan preferensi produk, bukan menyalahgunakan privasi.'
      }
    ]
  },

  // ── 11. SOAL 11: Hubungan Kualitas Data dan Performa AI
  {
    id: 'mod-11',
    title: 'MODUL 11: KABEL KUALITAS VS PERFORMA DATA',
    category: 'Data Preprocessing',
    type: 'cut-wire',
    description: 'Manakah pernyataan yang paling tepat mengenai hubungan antara kualitas data dan performa AI? Potong KABEL PERNYATAAN YANG BENAR!',
    isDefused: false,
    penaltySeconds: 45,
    wires: [
      {
        id: 'w-red',
        color: 'red',
        label: 'A. Model canggih selalu akurat meski data buruk',
        isCorrect: false,
        explanation: 'SALAH! Algoritma secanggih apa pun akan gagal jika dilatih dengan data yang buruk (Garbage In, Garbage Out).'
      },
      {
        id: 'w-yellow',
        color: 'yellow',
        label: 'B. Jumlah data satu-satunya penentu akurasi',
        isCorrect: false,
        explanation: 'SALAH! Miliaran data jika isinya bias atau berantakan tidak akan menghasilkan model yang andal.'
      },
      {
        id: 'w-green',
        color: 'green',
        label: 'C. Kualitas, variasi & ketepatan label tentukan performa AI',
        isCorrect: true,
        explanation: 'BENAR! Data-Centric AI membuktikan bahwa data yang bersih, representatif, bervariasi, dan berlabel presisi adalah kunci utama kecerdasan AI.'
      },
      {
        id: 'w-blue',
        color: 'blue',
        label: 'D. Data latih tidak perlu proses pemeriksaan',
        isCorrect: false,
        explanation: 'SALAH! Data preparation dan validasi adalah 80% porsi pekerjaan penting dalam machine learning.'
      }
    ]
  },

  // ── 12. SOAL 12: Human-in-the-Loop Medis
  {
    id: 'mod-12',
    title: 'MODUL 12: HUMAN-IN-THE-LOOP KESEHATAN',
    category: 'Model Evaluation',
    type: 'tactical-choice',
    description: 'Di masa depan, dokter menggunakan AI untuk menganalisis hasil pemeriksaan pasien. Mengapa dokter tetap diperlukan meskipun AI dapat melakukan analisis?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-12a',
        text: 'A. Karena AI sama sekali tidak dapat memproses data kesehatan.',
        isCorrect: false,
        explanation: 'SALAH! AI sangat piawai memproses data medis seperti X-ray, MRI, dan CT-scan.'
      },
      {
        id: 'opt-12b',
        text: 'B. Keputusan akhir tetap membutuhkan pertimbangan, empati, dan tanggung jawab hukum manusia.',
        isCorrect: true,
        explanation: 'MUTLAK BENAR! AI berperan sebagai pendukung keputusan (decision support), namun tanggung jawab etis, medis, empati, dan diagnosa klinis holistik tetap berada di tangan dokter.'
      },
      {
        id: 'opt-12c',
        text: 'C. Karena AI hanya dapat digunakan untuk mengolah data nonmedis.',
        isCorrect: false,
        explanation: 'SALAH! Aplikasi AI di bidang bioinformatika dan kedokteran sangat pesat berkembang.'
      },
      {
        id: 'opt-12d',
        text: 'D. Karena seluruh hasil analisis AI pasti salah.',
        isCorrect: false,
        explanation: 'SALAH! Analisis AI sering kali memiliki akurasi sangat tinggi dalam mendeteksi anomali mikroskopis.'
      }
    ]
  }
];
