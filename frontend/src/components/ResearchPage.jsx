import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowLeft, BookOpen, FlaskConical, Target, TrendingUp, Microscope, Globe, FileText, CheckCircle2, Library, Activity } from 'lucide-react';

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
   PROBLEM STATEMENT SECTION
   ═══════════════════════════════════════════════════════════ */
const ProblemStatementSection = () => {
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
        <Globe size={14} /> Latar Belakang Masalah
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-12 uppercase tracking-tight">
        Krisis Ekosistem Laut & Tantangan Pemantauan
      </h2>

      <div className="reveal-up grid md:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-red-500/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-red-400 rotate-180" />
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Pemutihan Massal Karang</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Perubahan iklim global dan peningkatan suhu permukaan laut telah memicu peristiwa pemutihan karang (coral bleaching) skala besar. Jika tidak segera dipantau dan ditangani, kerusakan ini dapat menyebabkan runtuhnya keanekaragaman hayati ekosistem terumbu karang yang berdampak langsung pada perikanan dan pariwisata.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Target size={20} className="text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Keterbatasan Pemantauan Manual</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Metode tradisional pemantauan kesehatan karang melibatkan penyelam yang mengambil foto dan menganalisisnya secara manual. Proses ini tidak hanya memakan waktu dan biaya, tetapi juga rentan terhadap subjektivitas observer. Dibutuhkan alat analisis kuantitatif yang cepat, otomatis, dan akurat.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   METHODOLOGY SECTION
   ═══════════════════════════════════════════════════════════ */
const MethodologySection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.reveal-up'), { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  const methods = [
    { title: 'Pengumpulan Data', desc: 'Dataset citra bawah laut primer diperoleh dari repositori Roboflow, yang mencakup variasi spesies karang sehat, mengalami pemutihan, dan terjangkit penyakit.' },
    { title: 'Anotasi & Pre-processing', desc: 'Anotasi mask biner dilakukan untuk memisahkan kelas sehat dan rusak. Citra diperkuat (augmented) secara geometri dan warna untuk meningkatkan ketahanan model terhadap kondisi air keruh.' },
    { title: 'Pemilihan Arsitektur', desc: 'U-Net dipilih karena kemampuannya mempertahankan informasi spasial detail resolusi tinggi, sangat penting untuk mendeteksi tekstur halus penyakit karang. EfficientNet digunakan sebagai encoder untuk efisiensi ekstraksi fitur.' },
    { title: 'Validasi Object (CLIP)', desc: 'Menghindari false-positive dari citra lingkungan non-karang menggunakan zero-shot classification OpenAI CLIP sebelum citra diproses oleh model U-Net.' }
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <FlaskConical size={14} /> Metodologi Penelitian
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-12 uppercase tracking-tight">
        Desain & Pendekatan Riset
      </h2>

      <div className="reveal-up bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
        <div className="space-y-6 relative z-10">
          {methods.map((item, i) => (
            <div key={i} className="flex items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                0{i + 1}
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed text-justify">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   LITERATURE REVIEW SECTION
   ═══════════════════════════════════════════════════════════ */
const LiteratureReviewSection = () => {
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
        <Library size={14} /> Kajian Pustaka
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-12 uppercase tracking-tight">
        Evolusi Pemantauan Karang
      </h2>

      <div className="reveal-up space-y-6">
        <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-2xl hover:bg-white/[0.04] transition-all">
          <h4 className="text-[var(--color-gold)] font-bold mb-3 uppercase tracking-wide text-sm">Metode Konvensional (Line Intercept Transect)</h4>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Secara historis, ekologi terumbu karang mengandalkan observasi manual in-situ. Ahli biologi laut menggunakan meteran (transect) di bawah air dan mencatat kondisi karang. Metode ini sangat lambat, dibatasi oleh tabung oksigen (SCUBA), dan menghasilkan bias pengamatan antar penyelam (observer bias).
          </p>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-2xl hover:bg-white/[0.04] transition-all">
          <h4 className="text-[var(--color-gold)] font-bold mb-3 uppercase tracking-wide text-sm">Computer Vision Klasik (Thresholding Warna)</h4>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Awal mula digitalisasi menggunakan pemrosesan piksel berdasarkan ruang warna (HSV/RGB). Namun, atenuasi cahaya di bawah air (hilangnya spektrum merah di kedalaman) menyebabkan algoritma klasik sering gagal membedakan karang putih akibat bleaching dengan pasir putih atau pantulan cahaya matahari.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-2xl hover:border-emerald-500/20 transition-all">
          <h4 className="text-emerald-400 font-bold mb-3 uppercase tracking-wide text-sm">Semantic Segmentation (U-Net)</h4>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Berbeda dengan image classification yang hanya melabeli seluruh gambar, Semantic Segmentation memprediksi kelas pada tingkat piksel (pixel-wise). U-Net terbukti sangat tangguh karena arsitektur encoder-decoder dengan skip-connection mampu mempertahankan detail batas tepi karang (edge retention) meskipun dalam citra beresolusi rendah atau kabur.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   ECOLOGICAL ANALYSIS SECTION
   ═══════════════════════════════════════════════════════════ */
const EcologicalAnalysisSection = () => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current.querySelectorAll('.reveal-up'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="reveal-up flex mb-6"><div className="gold-line" /></div>
      <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
        <Activity size={14} /> Analisis Ekologis
      </p>
      <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white mb-6 uppercase tracking-tight">
        Studi Kasus & Dampak Praktis
      </h2>
      <p className="reveal-up text-gray-400 text-sm md:text-base max-w-3xl mb-12 leading-relaxed">
        Dari sekadar metrik Machine Learning (IoU 86.95%) menjadi data ekologis yang dapat ditindaklanjuti (actionable data) oleh pengambil kebijakan (policymakers).
      </p>

      <div className="reveal-up grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-2xl p-8 hover:shadow-lg hover:shadow-red-500/10 transition-all">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-3">
            <TrendingUp size={20} className="text-red-400" /> Deteksi Dini Epizootik
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed text-justify mb-4">
            Penyakit mematikan seperti <em className="text-gray-300">Stony Coral Tissue Loss Disease (SCTLD)</em> atau <em className="text-gray-300">White Syndrome</em> sering menyebar dengan cepat layaknya epizootik. 
          </p>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Sistem CoralLens mampu mendeteksi margin putih lesi pada jaringan karang lebih presisi daripada mata manusia, memungkinkan isolasi koloni terinfeksi secara lebih dini sebelum menular ke ekosistem sekitarnya.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-8 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400" /> Kuantifikasi Laju Pemulihan
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed text-justify mb-4">
            Pasca kejadian El Niño atau pemutihan massal, otoritas konservasi sering kali menanam transplantasi karang (<em className="text-gray-300">coral nursery</em>).
          </p>
          <p className="text-gray-400 text-sm leading-relaxed text-justify">
            Penggunaan kontrol ambang batas dinamis pada aplikasi ini memberikan kemampuan bagi peneliti untuk memantau laju pertumbuhan persentase luasan piksel sehat (<em className="text-gray-300">recovery rate</em>) dari bulan ke bulan tanpa merusak struktur karang.
          </p>
        </div>
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
      <ProblemStatementSection />
      <LiteratureReviewSection />
      <MethodologySection />
      <EcologicalAnalysisSection />

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
