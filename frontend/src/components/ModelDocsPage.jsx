import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowLeft, Brain, Layers, ScanLine, BarChart3, AlertTriangle, Sparkles, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   METRICS DATA
   ═══════════════════════════════════════════════════════════ */
const metrics = [
  { label: 'Global Accuracy', value: '91.55%', desc: 'Persentase piksel yang diprediksi dengan benar dari seluruh citra uji', icon: '🎯' },
  { label: 'F1-Score', value: '93.02%', desc: 'Harmonic mean dari Precision dan Recall, mengukur keseimbangan deteksi', icon: '⚖️' },
  { label: 'Mean IoU', value: '86.95%', desc: 'Intersection over Union rata-rata antara prediksi dan ground truth', icon: '📐' },
  { label: 'Loss Function', value: 'BCE', desc: 'Binary Cross Entropy — fungsi kerugian untuk klasifikasi biner per piksel', icon: '📉' },
];

const pipelineSteps = [
  {
    step: '01',
    title: 'Input Validation (Satpam AI)',
    subtitle: 'OpenAI CLIP (ViT-B/32)',
    desc: 'Sebelum diproses lebih lanjut, citra divalidasi oleh CLIP secara Zero-Shot Classification. Model membandingkan probabilitas gambar antara prompt "terumbu karang" dan "bukan terumbu karang". Jika gambar tidak relevan, proses otomatis ditolak.',
    color: 'from-indigo-500 to-purple-600',
    tech: ['Hugging Face Transformers', 'CLIPModel', 'Zero-Shot', 'Cosine Similarity'],
  },
  {
    step: '02',
    title: 'Background Removal',
    subtitle: 'U²-Net (Rembg)',
    desc: 'Memisahkan objek terumbu karang dari latar belakang air laut menggunakan arsitektur U²-Net (U-square Net) dengan teknik alpha matting. Model salient object detection ini mengisolasi area karang agar inferensi segmentasi tidak terkontaminasi oleh noise lingkungan.',
    color: 'from-cyan-500 to-blue-600',
    tech: ['Rembg', 'U²-Net', 'ONNX Runtime', 'Alpha Matting'],
  },
  {
    step: '03',
    title: 'Image Preprocessing',
    subtitle: 'Normalisasi & Transformasi',
    desc: 'Citra di-resize ke 256×256 piksel, dinormalisasi (0.0–1.0), dikonversi ke PyTorch Tensor dengan format CHW (Channel×Height×Width), lalu ditambahkan dimensi batch untuk input model.',
    color: 'from-emerald-500 to-teal-600',
    tech: ['OpenCV', 'Albumentations', 'NumPy', 'PyTorch Tensor'],
  },
  {
    step: '04',
    title: 'Semantic Segmentation',
    subtitle: 'U-Net + EfficientNet-B3',
    desc: 'Backbone EfficientNet-B3 (pre-trained ImageNet, 18.4M parameter) mengekstrak fitur spasial multi-skala. Decoder U-Net dengan skip connections menggabungkan fitur low-level (tekstur, edge) dan high-level (semantik) untuk menghasilkan binary mask per piksel.',
    color: 'from-[var(--color-gold)] to-amber-600',
    tech: ['PyTorch', 'SMP Library', 'EfficientNet-B3', 'Sigmoid Activation'],
  },
  {
    step: '05',
    title: 'Post-Processing',
    subtitle: 'Overlay & Metrik',
    desc: 'Probabilitas piksel di-threshold (default 0.5, adjustable). Mask berwarna ditempel di atas citra asli dengan alpha blending 50%. Sistem menghitung rasio kerusakan dan mengklasifikasikan kondisi karang (Sangat Baik → Kritis).',
    color: 'from-rose-500 to-red-600',
    tech: ['Thresholding', 'Alpha Blending', 'Damage Ratio', 'Condition Label'],
  },
];

const trainingConfig = [
  { param: 'Dataset', value: 'Roboflow (citra bawah laut)' },
  { param: 'Augmentasi', value: 'HorizontalFlip, VerticalFlip, RandomBrightnessContrast, GaussNoise, ShiftScaleRotate' },
  { param: 'Loss Function', value: 'Binary Cross Entropy (BCE)' },
  { param: 'Optimizer', value: 'Adam (lr = 1e-4)' },
  { param: 'Input Size', value: '256 × 256 piksel' },
  { param: 'Batch Size', value: '16' },
  { param: 'Epochs', value: '~50 dengan Early Stopping' },
  { param: 'Pre-trained', value: 'ImageNet weights (Transfer Learning)' },
];

const limitations = [
  {
    title: 'Kegagalan Background Removal pada Cluttered Image',
    desc: 'Algoritma salience terkadang menghapus struktur karang utama jika latar belakang perairan terlalu ramai (banyak ikan/terumbu tumpang tindih). Gambar ideal adalah close-up/macro.',
  },
  {
    title: 'Out of Distribution (OOD) — Spektrum Akuarium',
    desc: 'Pengujian pada foto akuarium dengan sorotan lampu Actinic Blue/Purple menyebabkan bias deteksi hingga 70%. Model butuh retraining tambahan karena dataset primer 100% menggunakan spektrum cahaya matahari alami.',
  },
  {
    title: 'Inferensi CPU (Server Gratis)',
    desc: 'HuggingFace Spaces gratis menggunakan CPU. Proses inferensi memerlukan waktu 10–20 detik per gambar. Untuk performa real-time, diperlukan server GPU.',
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION: HERO
   ═══════════════════════════════════════════════════════════ */
const DocsHero = () => {
  const ref = useRef(null);

  useGSAP(() => {
    const els = ref.current.querySelectorAll('.reveal');
    gsap.fromTo(els, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <p className="reveal text-[var(--color-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-bold">
          Dokumentasi Teknis
        </p>
        <h1 className="reveal font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 uppercase tracking-tight">
          Arsitektur <br />
          <span className="text-gradient-gold">Model AI</span>
        </h1>
        <p className="reveal text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Dokumentasi lengkap mengenai arsitektur U-Net, backbone EfficientNet-B3,
          pipeline preprocessing, metrik evaluasi, dan batasan sistem CoralLens.
        </p>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION: ARCHITECTURE OVERVIEW
   ═══════════════════════════════════════════════════════════ */
const ArchitectureSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.reveal-up'), { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">Arsitektur Utama</p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-12 uppercase tracking-tight">
        U-Net + EfficientNet-B3
      </h2>

      <div className="reveal-up grid md:grid-cols-2 gap-8">
        {/* Encoder */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-[var(--color-gold)]/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Layers size={20} className="text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Encoder</h3>
          </div>
          <h4 className="text-[var(--color-gold)] font-semibold mb-3">EfficientNet-B3 (Pre-trained ImageNet)</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> 18.4M parameter dengan efisiensi komputasi tinggi</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Compound Scaling — resolusi, kedalaman, dan lebar jaringan diskalakan secara proporsional</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Mengekstraksi fitur hierarki multi-skala (edges → tekstur → pola → semantik)</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Transfer Learning dari ImageNet (1.2 juta gambar, 1000 kelas)</li>
          </ul>
        </div>

        {/* Decoder */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-[var(--color-gold)]/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ScanLine size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Decoder</h3>
          </div>
          <h4 className="text-[var(--color-gold)] font-semibold mb-3">U-Net Decoder with Skip Connections</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Transposed convolutions untuk upsampling resolusi bertahap</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Skip connections menggabungkan fitur low-level (encoder) dan high-level (decoder)</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Output: Binary mask 1 channel (setiap piksel → sehat atau rusak)</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> Aktivasi akhir: Sigmoid (probabilitas 0.0 – 1.0 per piksel)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION: PIPELINE
   ═══════════════════════════════════════════════════════════ */
const PipelineSection = () => {
  const ref = useRef(null);
  const [expandedStep, setExpandedStep] = useState(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.pipeline-card'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="flex mb-6"><div className="gold-line" /></div>
      <p className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">Pipeline Inferensi</p>
      <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 uppercase tracking-tight">
        Alur Prediksi
      </h2>
      <p className="text-gray-400 text-sm md:text-base max-w-2xl mb-14 leading-relaxed">
        Setiap citra yang diunggah melewati 4 tahap pemrosesan sebelum menghasilkan peta segmentasi dan metrik kerusakan.
      </p>

      <div className="space-y-4">
        {pipelineSteps.map((item) => (
          <div
            key={item.step}
            className="pipeline-card bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
          >
            <button
              onClick={() => setExpandedStep(expandedStep === item.step ? null : item.step)}
              className="w-full flex items-center gap-6 p-6 md:p-8 text-left cursor-pointer"
            >
              <span className={`text-3xl md:text-4xl font-serif font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                {item.step}
              </span>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg md:text-xl">{item.title}</h3>
                <p className="text-[var(--color-gold)] text-xs tracking-widest uppercase mt-1">{item.subtitle}</p>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform duration-300 ${expandedStep === item.step ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedStep === item.step && (
              <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/5 pt-6">
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tech.map((t) => (
                    <span key={t} className="bg-white/5 border border-white/10 text-[var(--color-gold)] text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION: METRICS
   ═══════════════════════════════════════════════════════════ */
const MetricsSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.metric-card'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="flex mb-6"><div className="gold-line" /></div>
      <p className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">Evaluasi Model</p>
      <h2 className="font-serif text-3xl md:text-5xl text-white mb-14 uppercase tracking-tight">
        Performa & Metrik
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:border-[var(--color-gold)]/30 transition-all duration-500 group">
            <span className="text-3xl mb-4 block">{m.icon}</span>
            <p className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold mb-2">{m.value}</p>
            <p className="text-white text-xs md:text-sm font-bold uppercase tracking-wider mb-3">{m.label}</p>
            <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Training Config */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
          <Sparkles size={18} className="text-[var(--color-gold)]" />
          Konfigurasi Training
        </h3>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          {trainingConfig.map((item) => (
            <div key={item.param} className="flex justify-between items-start py-3 border-b border-white/5">
              <span className="text-[var(--color-gold)] text-xs tracking-widest uppercase font-semibold">{item.param}</span>
              <span className="text-gray-300 text-sm text-right max-w-[60%]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION: THRESHOLD
   ═══════════════════════════════════════════════════════════ */
const ThresholdSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.reveal-up'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  const thresholdLevels = [
    { value: '100%', label: 'Sangat Ketat', desc: 'AI bertindak perfeksionis, hanya meloloskan piksel pucat ekstrem. Persentase kerusakan turun drastis.', bar: 'w-[15%]', color: 'bg-emerald-500' },
    { value: '50%', label: 'Default (Optimal)', desc: 'Sweet-spot ekuilibrium dengan F1-Score tertinggi. Diset sebagai default sistem.', bar: 'w-[50%]', color: 'bg-[var(--color-gold)]' },
    { value: '0%', label: 'Sangat Longgar', desc: 'AI meloloskan semua kecurigaan piksel, memprediksi kerusakan menjadi maksimal.', bar: 'w-full', color: 'bg-red-500' },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">Dynamic Thresholding</p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-6 uppercase tracking-tight">
        Kontrol Sensitivitas
      </h2>
      <p className="reveal-up text-gray-400 text-sm md:text-base max-w-2xl mb-14 leading-relaxed">
        Prediksi mask piksel menggunakan fungsi aktivasi <strong className="text-white">Sigmoid</strong>. Threshold mengontrol seberapa "curiga" AI terhadap piksel yang berpotensi rusak.
      </p>

      <div className="reveal-up space-y-6">
        {thresholdLevels.map((t) => (
          <div key={t.value} className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-serif font-bold text-white">{t.value}</span>
                <span className="text-[var(--color-gold)] text-[10px] tracking-widest uppercase font-semibold">{t.label}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{t.desc}</p>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${t.bar} ${t.color} transition-all duration-700`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION: LIMITATIONS
   ═══════════════════════════════════════════════════════════ */
const LimitationsSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.limit-card'), { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="flex mb-6"><div className="gold-line" /></div>
      <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <AlertTriangle size={14} /> Batasan Sistem
      </p>
      <h2 className="font-serif text-3xl md:text-5xl text-white mb-14 uppercase tracking-tight">
        Known Limitations
      </h2>

      <div className="space-y-4">
        {limitations.map((item, i) => (
          <div key={i} className="limit-card border-l-2 border-red-500/50 bg-white/[0.02] rounded-r-xl p-6 md:p-8">
            <h3 className="text-white font-bold text-base md:text-lg mb-2">{i + 1}. {item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
const ModelDocsPage = ({ onBack }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-ocean-950)] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-5 flex items-center justify-between bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-all cursor-pointer">
          <ArrowLeft size={16} />
          <span className="hidden md:inline">Kembali ke Beranda</span>
        </button>
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="opacity-80">
            <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
            <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" opacity="0.3" />
          </svg>
          <span className="font-serif text-sm tracking-widest text-gradient-gold uppercase">CoralLens</span>
        </div>
      </nav>

      {/* Sections */}
      <DocsHero />
      <ArchitectureSection />
      <PipelineSection />
      <MetricsSection />
      <ThresholdSection />
      <LimitationsSection />

      {/* Footer */}
      <footer className="py-16 px-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-xs tracking-widest uppercase">
          CoralLens AI — Dokumentasi Model Kecerdasan Buatan
        </p>
      </footer>
    </div>
  );
};

export default ModelDocsPage;
