import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowLeft, BookOpen, FlaskConical, Target, TrendingUp, Cpu, Database, Microscope } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
const ResearchHero = () => {
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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-gold)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <p className="reveal text-[var(--color-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-bold flex items-center justify-center gap-2">
          <BookOpen size={14} /> Research Documentation
        </p>
        <h1 className="reveal font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 uppercase tracking-tight">
          Sistem Estimasi <br />
          <span className="text-gradient-gold">Kondisi Terumbu Karang</span>
        </h1>
        <p className="reveal text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Dokumentasi riset lengkap mengenai pendekatan segmentasi semantik berbasis AI 
          untuk pemantauan dan estimasi kondisi ekosistem terumbu karang.
        </p>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   ABSTRACT SECTION
   ═══════════════════════════════════════════════════════════ */
const AbstractSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.reveal-up'), { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <Microscope size={14} /> Abstrak
      </p>
      <div className="reveal-up bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-[var(--color-gold)]/20 transition-all duration-500">
        <p className="text-gray-300 text-sm md:text-base leading-[1.9] text-justify">
          Sistem <strong className="text-white">CoralLens</strong> merupakan <em>web-based application</em> yang 
          dirancang untuk melakukan <strong className="text-[var(--color-gold)]">segmentasi semantik</strong> pada 
          citra terumbu karang. Tujuan utamanya adalah mengekstraksi metrik persentase area kerusakan 
          (pemutihan/penyakit) dibandingkan dengan area karang sehat, guna mendukung upaya restorasi dan 
          pemantauan ekosistem laut oleh Dinas Kelautan maupun NGO. Sistem ini mengkombinasikan arsitektur 
          <strong className="text-white"> U-Net</strong> dengan backbone <strong className="text-white">EfficientNet-B3</strong> yang 
          telah di-<em>pre-train</em> pada dataset ImageNet, kemudian di-<em>fine-tune</em> secara spesifik 
          untuk domain citra bawah laut terumbu karang.
        </p>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   ARCHITECTURE SECTION
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
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <Cpu size={14} /> Arsitektur Model
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-12 uppercase tracking-tight">
        U-Net + EfficientNet-B3
      </h2>

      <div className="reveal-up grid md:grid-cols-2 gap-6">
        {/* Framework & Network */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FlaskConical size={20} className="text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Stack Teknologi</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> <strong className="text-white">Framework:</strong> PyTorch (FastAPI Backend)</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> <strong className="text-white">Network:</strong> Semantic Segmentation U-Net</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> <strong className="text-white">Backbone:</strong> EfficientNet-B3 (Feature Extractor)</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> <strong className="text-white">Preprocessing:</strong> Rembg U²-Net (Alpha Matting)</li>
            <li className="flex gap-2"><span className="text-[var(--color-gold)]">▸</span> <strong className="text-white">Input Validation:</strong> CLIP Zero-Shot Classification</li>
          </ul>
        </div>

        {/* Evaluation Metrics */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Evaluasi Metrik AI</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex justify-between items-center py-2 border-b border-white/5">
              <span>Global Accuracy</span>
              <span className="text-white font-mono font-bold text-lg">91.55%</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-white/5">
              <span>F1-Score (Equilibrium)</span>
              <span className="text-white font-mono font-bold text-lg">93.02%</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-white/5">
              <span>Mean IoU</span>
              <span className="text-white font-mono font-bold text-lg">86.95%</span>
            </li>
            <li className="flex justify-between items-center py-2">
              <span>Loss Function</span>
              <span className="text-white font-mono font-bold">BCE</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   DATASET SECTION
   ═══════════════════════════════════════════════════════════ */
const DatasetSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.reveal-up'), { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  const trainingConfig = [
    { param: 'Sumber Dataset', value: 'Roboflow (Citra Bawah Laut)' },
    { param: 'Augmentasi', value: 'HorizontalFlip, VerticalFlip, RandomBrightnessContrast, GaussNoise, ShiftScaleRotate' },
    { param: 'Loss Function', value: 'Binary Cross Entropy (BCE)' },
    { param: 'Optimizer', value: 'Adam (lr = 1e-4)' },
    { param: 'Input Size', value: '256 × 256 piksel' },
    { param: 'Batch Size', value: '16' },
    { param: 'Epochs', value: '~50 dengan Early Stopping' },
    { param: 'Pre-trained', value: 'ImageNet weights (Transfer Learning)' },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <Database size={14} /> Dataset & Training
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-12 uppercase tracking-tight">
        Konfigurasi Pelatihan
      </h2>

      <div className="reveal-up bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-1">
          {trainingConfig.map((item) => (
            <div key={item.param} className="flex justify-between items-start py-4 border-b border-white/5">
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
   THRESHOLD EXPERIMENT SECTION
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
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <Target size={14} /> Eksperimen & Optimasi
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-6 uppercase tracking-tight">
        Threshold Control
      </h2>
      <p className="reveal-up text-gray-400 text-sm md:text-base max-w-2xl mb-14 leading-relaxed">
        Prediksi mask piksel menggunakan fungsi aktivasi <strong className="text-white">Sigmoid</strong>. 
        Threshold mengontrol seberapa "curiga" AI terhadap piksel yang berpotensi rusak.
      </p>

      <div className="reveal-up space-y-5">
        {thresholdLevels.map((t) => (
          <div key={t.value} className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-2xl font-serif font-bold text-white">{t.value}</span>
              <span className="text-[var(--color-gold)] text-[10px] tracking-widest uppercase font-semibold">{t.label}</span>
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
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
const ResearchPage = ({ onBack }) => {
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
      <ResearchHero />
      <AbstractSection />
      <ArchitectureSection />
      <DatasetSection />
      <ThresholdSection />

      {/* Footer */}
      <footer className="py-16 px-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-xs tracking-widest uppercase">
          CoralLens AI — Research Documentation
        </p>
      </footer>
    </div>
  );
};

export default ResearchPage;
