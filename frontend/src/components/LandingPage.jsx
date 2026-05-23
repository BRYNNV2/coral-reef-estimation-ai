import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   FLOATING PARTICLES  (subtle underwater feel)
   ═══════════════════════════════════════════════════════════ */
const Particles = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const particles = containerRef.current.querySelectorAll('.particle');
    particles.forEach((p) => {
      const size = gsap.utils.random(2, 6);
      const x = gsap.utils.random(0, 100);

      gsap.set(p, {
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-5%',
        background: `rgba(201, 169, 110, ${gsap.utils.random(0.1, 0.35)})`,
      });

      gsap.to(p, {
        y: `-${gsap.utils.random(600, 1200)}`,
        x: gsap.utils.random(-80, 80),
        opacity: gsap.utils.random(0.2, 0.6),
        duration: gsap.utils.random(8, 18),
        repeat: -1,
        delay: gsap.utils.random(0, 8),
        ease: 'none',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(25)].map((_, i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className={`navbar fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-5 flex items-center justify-between ${
        scrolled ? 'scrolled' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Logo Icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-80">
          <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
          <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" opacity="0.3" />
          <path d="M10 18 Q16 10 22 18" stroke="#c9a96e" strokeWidth="1" fill="none" />
        </svg>
        <span className="font-serif text-lg tracking-widest text-gradient-gold uppercase">
          Pusaka Pulau
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm tracking-wider text-gray-400">
        <a href="#about" className="hover:text-[var(--color-gold)] transition-colors duration-300">
          Tentang
        </a>
        <a href="#features" className="hover:text-[var(--color-gold)] transition-colors duration-300">
          Fitur
        </a>
        <a href="#detection" className="hover:text-[var(--color-gold)] transition-colors duration-300">
          Deteksi
        </a>
      </div>
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — Full-screen with parallax background
   ═══════════════════════════════════════════════════════════ */
const HeroSection = ({ onStartDetection }) => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Parallax effect on background image
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Hero content entrance animation
    const tl = gsap.timeline({ delay: 0.6 });

    tl.from('.hero-line', {
      width: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    })
      .from(
        '.hero-subtitle',
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6'
      )
      .from(
        '.hero-title-line',
        {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .from(
        '.hero-desc',
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.4'
      )
      .from(
        '.hero-cta',
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      .from(
        '.hero-scroll-hint',
        {
          opacity: 0,
          duration: 0.6,
        },
        '-=0.2'
      );
  }, { scope: sectionRef });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with parallax */}
      <div
        ref={bgRef}
        className="hero-parallax absolute inset-0 -top-[10%] -bottom-[10%]"
      >
        <img
          src="/hero-bg.png"
          alt="Coral Reef Underwater"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 hero-overlay-b" />
        <div className="absolute inset-0 hero-overlay-r" />
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Decorative Line */}
        <div className="flex justify-center mb-8">
          <div className="hero-line gold-line" />
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-[var(--color-gold)] font-sans text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
          Artificial Intelligence · Marine Conservation
        </p>

        {/* Main Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] mb-8">
          <span className="hero-title-line block text-white">Coral Reef</span>
          <span className="hero-title-line block text-gradient-gold italic">Estimator</span>
        </h1>

        {/* Description */}
        <p className="hero-desc font-sans text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
          Menganalisis kondisi terumbu karang menggunakan teknologi Deep Learning
          untuk mendukung konservasi ekosistem laut Indonesia.
        </p>

        {/* CTA */}
        <div className="hero-cta">
          <button 
            onClick={onStartDetection}
            className="cta-btn text-[var(--color-ocean-950)] font-semibold text-sm tracking-wider uppercase px-10 py-4 rounded-full cursor-pointer"
          >
            Mulai Deteksi
          </button>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--color-gold)]/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION — elegant intro
   ═══════════════════════════════════════════════════════════ */
const AboutSection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const els = sectionRef.current.querySelectorAll('.reveal-up');
    els.forEach((el) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="reveal-up flex justify-center mb-6">
          <div className="gold-line" />
        </div>
        <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-6 font-sans">
          Tentang Proyek
        </p>
        <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white leading-snug mb-8">
          Memahami Kesehatan <br />
          <span className="italic text-gradient-gold">Terumbu Karang</span>
        </h2>
        <p className="reveal-up text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Proyek <strong className="text-white font-medium">Pusaka Pulau</strong> memanfaatkan
          arsitektur <strong className="text-white font-medium">U-Net</strong> dengan backbone
          <strong className="text-white font-medium"> EfficientNet-B3</strong> yang telah dilatih
          pada ribuan citra bawah laut untuk mendeteksi dan memvisualisasikan area kerusakan
          terumbu karang secara otomatis. Sistem ini menghitung rasio piksel kerusakan
          dan menghasilkan peta segmentasi berwarna untuk analisis lebih lanjut.
        </p>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   FEATURES SECTION — 3 staggered cards
   ═══════════════════════════════════════════════════════════ */
const features = [
  {
    number: '01',
    title: 'Segmentasi Semantik',
    desc: 'Mengidentifikasi area kerusakan karang pada level piksel menggunakan model U-Net yang dilatih dengan dataset COCO segmentation dari Roboflow.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" />
        <rect x="22" y="4" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <rect x="4" y="22" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <rect x="22" y="22" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Analisis Kuantitatif',
    desc: 'Menghitung persentase area rusak vs sehat secara real-time dengan metrik evaluasi lengkap: Accuracy, F1-Score, IoU, Precision, dan Recall.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <polyline points="4,32 12,22 20,26 28,14 36,8" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="22" r="2" fill="#c9a96e" opacity="0.6" />
        <circle cx="20" cy="26" r="2" fill="#c9a96e" opacity="0.6" />
        <circle cx="28" cy="14" r="2" fill="#c9a96e" opacity="0.6" />
        <circle cx="36" cy="8" r="2" fill="#c9a96e" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Visualisasi Overlay',
    desc: 'Menghasilkan peta overlay berwarna yang menampilkan area kerusakan secara visual di atas citra asli, memudahkan interpretasi oleh peneliti dan konservasionis.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="16" cy="20" r="12" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <circle cx="24" cy="20" r="12" stroke="#c9a96e" strokeWidth="1.5" />
        <path d="M20 11 A12 12 0 0 1 20 29 A12 12 0 0 1 20 11" fill="#c9a96e" opacity="0.15" />
      </svg>
    ),
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Section header
    const headers = sectionRef.current.querySelectorAll('.reveal-up');
    headers.forEach((el) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Cards staggered
    const cards = sectionRef.current.querySelectorAll('.feature-card');
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 md:py-36 px-6"
    >
      {/* Top separator */}
      <div className="max-w-6xl mx-auto mb-20 flex justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="reveal-up flex justify-center mb-6">
            <div className="gold-line" />
          </div>
          <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-6 font-sans">
            Keunggulan AI
          </p>
          <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white">
            Teknologi yang <span className="italic text-gradient-gold">Kami Gunakan</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((f) => (
            <div
              key={f.number}
              className="feature-card glass-card rounded-2xl p-8 md:p-10 opacity-0 translate-y-[60px] flex flex-col"
            >
              {/* Number */}
              <span className="font-serif text-5xl block mb-4" style={{ color: 'rgba(201, 169, 110, 0.15)' }}>
                {f.number}
              </span>
              {/* Icon */}
              <div className="mb-6">{f.icon}</div>
              {/* Title */}
              <h3 className="font-serif text-xl md:text-2xl text-white mb-4">
                {f.title}
              </h3>
              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   DETECTION CTA SECTION
   ═══════════════════════════════════════════════════════════ */
const DetectionSection = ({ onStartDetection }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const els = sectionRef.current.querySelectorAll('.reveal-up');
    els.forEach((el, i) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      id="detection"
      ref={sectionRef}
      className="relative py-28 md:py-36 px-6"
    >
      {/* Top separator */}
      <div className="max-w-6xl mx-auto mb-20 flex justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left — Text Content */}
          <div className="flex-1 w-full">
            <div className="reveal-up flex mb-6">
              <div className="gold-line" />
            </div>
            <p className="reveal-up text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-6 font-sans">
              Mulai Sekarang
            </p>
            <h2 className="reveal-up font-serif text-3xl md:text-5xl text-white leading-snug mb-8">
              Unggah Citra, <br />
              <span className="italic text-gradient-gold">Dapatkan Analisis</span>
            </h2>
            <p className="reveal-up text-gray-400 text-base leading-relaxed mb-10">
              Cukup unggah foto terumbu karang melalui sistem kami. AI akan
              secara otomatis menganalisis, membuat peta segmentasi, dan memberikan
              laporan persentase kondisi karang dalam hitungan detik.
            </p>
            <div className="reveal-up">
              <button
                className="cta-btn text-[var(--color-ocean-950)] font-semibold text-sm tracking-wider uppercase px-10 py-4 rounded-full cursor-pointer"
                onClick={onStartDetection}
              >
                Mulai Deteksi →
              </button>
            </div>
          </div>

          {/* Right — Demo Image */}
          <div className="reveal-up flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden border border-gold-10 shadow-2xl shadow-black/40">
              <img
                src="/detection-demo.png"
                alt="Coral Reef AI Detection Demo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 detection-overlay-t" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
const Footer = () => (
  <footer className="border-t border-white/5 py-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-serif text-sm tracking-widest text-gradient-gold uppercase">
        Pusaka Pulau
      </span>
      <p className="text-gray-500 text-xs tracking-wider">
        &copy; 2026 Coral Reef Condition Estimation &middot; Pengolahan Citra Digital
      </p>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE (Main Component)
   ═══════════════════════════════════════════════════════════ */
const LandingPage = ({ onStartDetection }) => {
  // ── Lenis Smooth Scroll ──
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-ocean-950)]">
      <Particles />
      <Navbar />
      <HeroSection onStartDetection={onStartDetection} />
      <AboutSection />
      <FeaturesSection />
      <DetectionSection onStartDetection={onStartDetection} />
      <Footer />
    </div>
  );
};

export default LandingPage;
