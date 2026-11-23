import { DefusalModule, GameSettings } from '../types/game';

export const DEFAULT_SETTINGS: GameSettings = {
  totalTimeSeconds: 600, // 10 menit
  maxStrikes: 3,
  penaltyPerStrikeSeconds: 45, // -45 detik tiap salah
};

export const getFreshModules = (): DefusalModule[] => JSON.parse(JSON.stringify(INITIAL_MODULES));

export const INITIAL_MODULES: DefusalModule[] = [
  {
    id: 'mod-1',
    title: 'MODUL 01: KABEL IMPUTASI DATA',
    category: 'Data Preprocessing',
    type: 'cut-wire',
    description: 'Kolom "Pendapatan_Bulanan" memiliki 18% missing values dan distribusinya SANGAT skewed ke kanan (ada outlier milyarder). Potong KABEL METODE IMPUTASI yang paling tahan terhadap distorsi outlier!',
    isDefused: false,
    penaltySeconds: 45,
    wires: [
      {
        id: 'w-red',
        color: 'red',
        label: "fillna(df['Pendapatan'].mean())",
        isCorrect: false,
        explanation: 'SALAH! Nilai Mean sangat sensitif terhadap outlier ekstrem, sehingga akan mendongkrak rata-rata secara tidak realistis!'
      },
      {
        id: 'w-blue',
        color: 'blue',
        label: "fillna(df['Pendapatan'].median())",
        isCorrect: true,
        explanation: 'BENAR! Median adalah ukuran tendensi sentral yang robust (kebal) terhadap skewness dan outlier ekstrem.'
      },
      {
        id: 'w-yellow',
        color: 'yellow',
        label: "df.dropna(subset=['Pendapatan'])",
        isCorrect: false,
        explanation: 'SALAH! Membuang 18% baris data berharga akan menyebabkan kehilangan informasi signifikan dan potensi bias sampel!'
      },
      {
        id: 'w-green',
        color: 'green',
        label: "fillna(0)",
        isCorrect: false,
        explanation: 'SALAH! Mengisi 0 akan menciptakan puncak data palsu di angka 0 dan merusak model regresi/korelasi!'
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'MODUL 02: RADAR KORELASI & MULTIKOLINEARITAS',
    category: 'EDA',
    type: 'tactical-choice',
    description: 'Pada tahap Exploratory Data Analysis (EDA), heatmap menunjukkan fitur "Panjang_Meter" dan "Panjang_Centimeter" memiliki korelasi Pearson r = 1.00. Apa dampak fatal jika kedua fitur ini tetap dimasukkan ke model Linear Regression?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-a',
        text: 'Terjadi Multikolinearitas sempurna; matriks invers (XᵀX) singular sehingga estimasi koefisien menjadi tidak stabil/tak terhingga.',
        isCorrect: true,
        explanation: 'TEPAT! Multikolinearitas sempurna membuat koefisien regresi tidak dapat ditentukan secara unik dan variansi koefisien meledak.'
      },
      {
        id: 'opt-b',
        text: 'Model akan otomatis mengalami Underfitting karena dataset dianggap terlalu sedikit.',
        isCorrect: false,
        explanation: 'SALAH! Multikolinearitas tidak menyebabkan underfitting, melainkan instabilitas bobot/koefisien fitur.'
      },
      {
        id: 'opt-c',
        text: 'Akurasi model langsung menjadi 0% dan komputasi berhenti seketika.',
        isCorrect: false,
        explanation: 'SALAH! Model tetap bisa berjalan namun interpretasi bobot menjadi kacau dan prediksi tidak reliabel.'
      },
      {
        id: 'opt-d',
        text: 'Gradient descent akan melompat ke local minimum dalam 1 iterasi.',
        isCorrect: false,
        explanation: 'SALAH! Fitur redundan justru menciptakan kontur lembah elips tajam yang memperlambat konvergensi.'
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'MODUL 03: KEYPAD DETONATOR CONFUSION MATRIX',
    category: 'Model Evaluation',
    type: 'confusion-matrix',
    description: 'Sistem pertahanan udara mendeteksi ancaman drone: True Positive (TP) = 80, False Positive (FP) = 20, False Negative (FN) = 10, True Negative (TN) = 90. Masukkan nilai PRECISION model (dalam persentase bulat, contoh: 80 untuk 80%) ke keypad bom!',
    isDefused: false,
    penaltySeconds: 45,
    matrixData: {
      tp: 80,
      fp: 20,
      fn: 10,
      tn: 90,
      targetMetric: 'precision',
      targetMetricLabel: 'PRECISION',
      correctAnswer: 80,
      tolerance: 0,
      hint: 'Rumus Precision = TP / (TP + FP). Dari semua yang diprediksi positif, berapa persen yang benar-benar positif?'
    }
  },
  {
    id: 'mod-4',
    title: 'MODUL 04: TERMINAL PATCH DATA LEAKAGE',
    category: 'Data Preprocessing',
    type: 'terminal-fix',
    description: 'Sistem mendeteksi bug kritis berupa DATA LEAKAGE pada proses Feature Scaling data uji coba (test set). Pilih baris kode pengganti yang aman!',
    isDefused: false,
    penaltySeconds: 45,
    terminalData: {
      context: 'Pipeline StandardScaler pada data Train dan Test:',
      brokenCode: `scaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\n# [ERROR HAZARD] Membocorkan parameter mean/std test set!\nX_test_scaled = scaler.fit_transform(X_test)`,
      options: [
        {
          id: 'tf-1',
          codeSnippet: 'X_test_scaled = scaler.transform(X_test)',
          isCorrect: true,
          explanation: 'BENAR! Data test hanya boleh di-transform menggunakan mean & standar deviasi yang sudah dihitung dari data train!'
        },
        {
          id: 'tf-2',
          codeSnippet: 'X_test_scaled = scaler.fit(X_test).transform(X_train)',
          isCorrect: false,
          explanation: 'SALAH! Menggunakan fit pada X_test tetap membocorkan data test dan malah merusak X_train!'
        },
        {
          id: 'tf-3',
          codeSnippet: 'X_test_scaled = MinMaxScaler().fit_transform(X_test)',
          isCorrect: false,
          explanation: 'SALAH! Mengganti scaler jenis lain dan tetap melakukan fit pada test set tetap menimbulkan data leakage!'
        },
        {
          id: 'tf-4',
          codeSnippet: 'X_test_scaled = scaler.fit_transform(pd.concat([X_train, X_test]))',
          isCorrect: false,
          explanation: 'SALAH BESAR! Menggabungkan train dan test sebelum fit adalah contoh terburuk dari data leakage!'
        }
      ]
    }
  },
  {
    id: 'mod-5',
    title: 'MODUL 05: KABEL ENCODING HIGH CARDINALITY',
    category: 'Feature Engineering',
    type: 'cut-wire',
    description: 'Fitur "Kecamatan_Pelanggan" memiliki 200 kategori unik tanpa urutan hierarki. Jika memakai One-Hot Encoding biasa, dataset meledak menjadi 200 kolom kosong (curse of dimensionality). Potong kabel metode penanganan yang paling efisien!',
    isDefused: false,
    penaltySeconds: 45,
    wires: [
      {
        id: 'w2-red',
        color: 'red',
        label: 'Label Encoding (0 sampai 199)',
        isCorrect: false,
        explanation: 'SALAH! Memberikan angka 0-199 pada data nominal menciptakan hubungan urutan palsu (kecamatan 199 dianggap lebih tinggi dari 0) bagi model linier/neural net!'
      },
      {
        id: 'w2-yellow',
        color: 'yellow',
        label: 'Target Encoding / Frequency Encoding / Hashing Trick',
        isCorrect: true,
        explanation: 'BENAR! Target Encoding atau Frequency Encoding mereduksi dimensi tinggi menjadi representasi numerik ringkas tanpa ledakan jumlah kolom!'
      },
      {
        id: 'w2-purple',
        color: 'purple',
        label: 'StandardScaler langsung ke teks kategori',
        isCorrect: false,
        explanation: 'SALAH! StandardScaler hanya menerima input data angka kontinu, tidak bisa memproses data string kategorikal!'
      },
      {
        id: 'w2-cyan',
        color: 'cyan',
        label: 'Hapus kolom kecamatan tanpa pertimbangan',
        isCorrect: false,
        explanation: 'SALAH! Lokasi geografis seringkali merupakan sinyal prediksi yang sangat kuat, membuangnya begitu saja merugikan performa model!'
      }
    ]
  },
  {
    id: 'mod-6',
    title: 'MODUL 06: DIAL KALIBRASI OVERFITTING TREE',
    category: 'Model Training',
    type: 'tuning-dial',
    description: 'Decision Tree mengalami OVERFITTING ekstrem: Train Accuracy = 99.8%, namun Test Accuracy hanya 58.4%! Knob `max_depth` saat ini disetel pada nilai 45 (pohon terlalu dalam menghafal noise). Putar dial ke rentang kedalaman optimal (6 hingga 12) untuk melakukan pruning!',
    isDefused: false,
    penaltySeconds: 45,
    dialData: {
      parameterName: 'max_depth',
      description: 'Kedalaman maksimum percabangan pohon keputusan (Pruning Control)',
      scenario: 'Train Acc: 99.8% | Test Acc: 58.4% (Overfitting Detonator Active)',
      min: 1,
      max: 45,
      step: 1,
      unit: 'levels',
      currentValue: 45,
      targetRange: [6, 12],
      correctFeedback: 'TEPAT! Membatasi max_depth antara 6-12 menyederhanakan pohon keputusan, mengurangi varians, dan meningkatkan generalisasi pada data uji!',
      wrongFeedback: 'SALAH! Kedalaman tersebut belum optimal untuk menyeimbangkan bias-variance tradeoff pada kasus ini.'
    }
  },
  {
    id: 'mod-7',
    title: 'MODUL 07: URUTAN URGEN PIPELINE MACHINE LEARNING',
    category: 'Data Preprocessing',
    type: 'pipeline-sequence',
    description: 'Sistem pertahanan terganggu karena komponen Machine Learning pipeline teracak. Susun 5 tahap ini dari URUTAN PERTAMA hingga TERAKHIR agar alur eksekusi bebas dari data leakage!',
    isDefused: false,
    penaltySeconds: 45,
    pipelineSteps: [
      { id: 'step-1', name: '1. Train / Test Data Split', order: 1 },
      { id: 'step-2', name: '2. Missing Value Imputation (Fit train, transform test)', order: 2 },
      { id: 'step-3', name: '3. Feature Scaling & Encoding', order: 3 },
      { id: 'step-4', name: '4. Model Training (Fit Classifier)', order: 4 },
      { id: 'step-5', name: '5. Model Evaluation pada Test Set', order: 5 },
    ]
  },
  {
    id: 'mod-8',
    title: 'MODUL 08: OPTIMASI METRIK KRITIS DETEKSI BOM',
    category: 'Model Evaluation',
    type: 'tactical-choice',
    description: 'Dalam sistem deteksi terorisme / bom atau diagnosis kanker stadium lanjut, skenario kesalahan mana yang PALING MEMATIKAN (paling dihindari), dan metrik evaluasi apa yang wajib dimaksimalkan?',
    isDefused: false,
    penaltySeconds: 45,
    tacticalOptions: [
      {
        id: 'opt-recall',
        text: 'False Negative (Bom lolos tidak terdeteksi); Wajib maksimalkan RECALL (Sensitivitas).',
        isCorrect: true,
        explanation: 'TEPAT! Lebih baik terjadi False Alarm (False Positive) daripada bom lolos (False Negative). Recall = TP / (TP + FN) harus setinggi mungkin!'
      },
      {
        id: 'opt-prec',
        text: 'False Positive (Alarm palsu); Wajib maksimalkan PRECISION saja.',
        isCorrect: false,
        explanation: 'SALAH! Memaksimalkan precision bisa membuat sistem terlalu konservatif dan membiarkan banyak bom berbahaya lolos!'
      },
      {
        id: 'opt-acc',
        text: 'True Negative; Wajib maksimalkan Overall Accuracy tanpa melihat distribusi kelas.',
        isCorrect: false,
        explanation: 'SALAH! Jika 99% data adalah non-bom, model bodoh yang menebak selalu non-bom punya akurasi 99% tapi mematikan semua orang!'
      },
      {
        id: 'opt-mse',
        text: 'Mean Squared Error (MSE) harus diturunkan ke nilai negatif.',
        isCorrect: false,
        explanation: 'SALAH! MSE tidak pernah bernilai negatif dan ini adalah problem klasifikasi, bukan regresi!'
      }
    ]
  }
];
