import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Menu, X } from 'lucide-react';

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
const Navbar = ({ onExploreGallery }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`navbar fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-5 flex items-center justify-between transition-colors duration-500 transform-gpu border-none ${scrolled ? 'bg-[#0a0a0a] shadow-xl' : 'bg-transparent'
          }`}
      >
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-100">
            <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
            <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" opacity="0.3" />
            <path d="M10 18 Q16 10 22 18" stroke="#c9a96e" strokeWidth="1" fill="none" />
          </svg>
          <span className="font-serif text-lg tracking-widest text-gradient-gold uppercase font-semibold">
            CoralLens
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wider text-white">
          <a href="#about" className="hover:text-[var(--color-gold)] transition-colors duration-300">
            Tentang
          </a>
          <a href="#features" className="hover:text-[var(--color-gold)] transition-colors duration-300">
            Fitur
          </a>
          <a href="#detection" className="hover:text-[var(--color-gold)] transition-colors duration-300">
            Deteksi
          </a>
          <button onClick={onExploreGallery} className="hover:text-[var(--color-gold)] transition-colors duration-300 uppercase">
            Galeri
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[var(--color-gold)] p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu Fullscreen Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden text-white transition-all">
          <button
            className="absolute top-6 right-6 text-[var(--color-gold)] p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={32} />
          </button>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif tracking-widest hover:text-[var(--color-gold)] transition-colors">Tentang</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif tracking-widest hover:text-[var(--color-gold)] transition-colors">Fitur</a>
          <a href="#detection" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif tracking-widest hover:text-[var(--color-gold)] transition-colors">Deteksi</a>
          <button
            onClick={() => { setMobileMenuOpen(false); onExploreGallery(); }}
            className="text-2xl font-serif tracking-widest text-[var(--color-gold)] uppercase mt-4 border border-gold-20 px-8 py-3 rounded-full bg-gold-5"
          >
            Masuk Galeri
          </button>
        </div>
      )}
    </>
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
      {/* Background Video with parallax */}
      <div
        ref={bgRef}
        className="hero-parallax absolute inset-0 -top-[10%] -bottom-[10%]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-bg.png"
          className="w-full h-full object-cover"
        >
          <source src="/Section 1 Terumbu karang.mp4" type="video/mp4" />
        </video>
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
          Precision Underwater Monitoring
        </p>

        {/* Main Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] mb-8">
          <span className="hero-title-line block text-white">CoralLens</span>
        </h1>

        {/* Description */}
        <p className="hero-desc font-sans text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
          Menganalisis kondisi terumbu karang menggunakan teknologi Deep Learning
          untuk mendukung konservasi ekosistem laut.
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
   GALLERY SECTION — Infinite Marquee of Corals
   ═══════════════════════════════════════════════════════════ */
const row1Images = [
  "Acropora (Branching Coral).png",
  "Acropora Hyacinthus (Table Coral).png",
  "ChatGPT Image 23 Mei 2026, 21.37.40 (1).png",
  "ChatGPT Image 23 Mei 2026, 21.37.43 (7).png",
  "ChatGPT Image 23 Mei 2026, 21.37.43 (8).png"
];

const row2Images = [
  "ChatGPT Image 23 Mei 2026, 21.37.43 (9).png",
  "Diploria (Brain Coral  Massive).png",
  "Fungia (Mushroom Coral).png",
  "Seriatopora (Birdnest Coral).png",
  "Turbinaria (Foliose Coral  Vase).png"
];

const GallerySection = ({ onExploreGallery }) => {
  return (
    <section id="gallery" className="relative py-24 md:py-32 bg-[var(--color-ocean-950)] overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16 relative z-20">
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide uppercase">
          A Unique <span className="italic text-gradient-gold">Experience</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mt-6">
          Jelajahi keanekaragaman dan keindahan terumbu karang melalui koleksi citra visual bawah laut kami.
        </p>
      </div>

      {/* Row 1: Moves Left */}
      <div className="marquee-container mb-6">
        <div className="marquee-content marquee-left">
          {[...row1Images, ...row1Images].map((img, idx) => (
            <div key={`r1-${idx}`} className="gallery-card">
              <img src={`/corals/${img}`} alt={`Coral Reef ${idx}`} />
            </div>
          ))}
        </div>
        {/* Duplicate for seamless loop if needed, but flex-shrink: 0 and 100% width usually handles it with duplication inside */}
        <div className="marquee-content marquee-left" aria-hidden="true">
          {[...row1Images, ...row1Images].map((img, idx) => (
            <div key={`r1-dup-${idx}`} className="gallery-card">
              <img src={`/corals/${img}`} alt={`Coral Reef ${idx}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Moves Right */}
      <div className="marquee-container">
        <div className="marquee-content marquee-right">
          {[...row2Images, ...row2Images].map((img, idx) => (
            <div key={`r2-${idx}`} className="gallery-card">
              <img src={`/corals/${img}`} alt={`Coral Reef ${idx}`} />
            </div>
          ))}
        </div>
        <div className="marquee-content marquee-right" aria-hidden="true">
          {[...row2Images, ...row2Images].map((img, idx) => (
            <div key={`r2-dup-${idx}`} className="gallery-card">
              <img src={`/corals/${img}`} alt={`Coral Reef ${idx}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Center Floating Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mt-16">
        <button
          onClick={onExploreGallery}
          className="glass-card px-8 py-4 pointer-events-auto cursor-pointer border border-gold-20 hover:border-gold-50 hover:bg-[var(--color-gold)]/10 transition-all rounded-sm uppercase tracking-[0.3em] text-[var(--color-gold)] font-sans text-xs"
        >
          Explore Gallery
        </button>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION — Split Layout with Tilted Card
   ═══════════════════════════════════════════════════════════ */
const initialDiseaseCards = [
  {
    id: 1,
    title: "Coral Bleaching",
    type: "Kritis",
    species: "Stres Lingkungan",
    image: "/corals/Diploria (Brain Coral  Massive).png",
    symptoms: "Karang berubah putih/pucat karena kehilangan zooxanthellae. Ini bukan penyakit infeksi, tapi stres akibat suhu tinggi, polusi, atau cahaya berlebih.",
    impact: "Karang kehilangan sumber nutrisi utamanya, rentan mati kelaparan, dan sangat rawan terhadap penyakit infeksi sekunder."
  },
  {
    id: 2,
    title: "Black Band Disease",
    type: "Infeksi",
    species: "Pita Hitam",
    image: "/corals/Acropora (Branching Coral).png",
    symptoms: "Ada pita/lapisan hitam yang bergerak di permukaan karang, jaringan karang mati di belakangnya.",
    impact: "Menghancurkan jaringan karang dengan cepat. Wabah ini sangat agresif dan sering memburuk saat perairan menghangat."
  },
  {
    id: 3,
    title: "White Band Disease",
    type: "Infeksi",
    species: "Pita Putih",
    image: "/corals/Acropora Hyacinthus (Table Coral).png",
    symptoms: "Muncul garis/pita putih pada karang bercabang, jaringan karang mengelupas dan menyisakan rangka putih.",
    impact: "Menyebabkan kematian jaringan yang luas, khususnya merusak struktur habitat karang bercabang."
  }
];

const AboutSection = () => {
  const [cards, setCards] = useState(initialDiseaseCards);
  const [activeDisease, setActiveDisease] = useState(null);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const handleCardClick = (clickedId) => {
    setCards(prevCards => {
      const index = prevCards.findIndex(c => c.id === clickedId);

      // Jika yang ditekan adalah kartu yang sudah di paling depan
      if (index === 0) {
        setActiveDisease(prevCards[0]);
        return prevCards;
      }

      // Jika kartu di belakang, bawa ke depan
      const newCards = [...prevCards];
      const clickedCard = newCards.splice(index, 1)[0];
      newCards.unshift(clickedCard);
      return newCards;
    });
  };

  useGSAP(() => {
    // Reveal text
    const els = sectionRef.current.querySelectorAll('.reveal-up');
    els.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
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
        }
      );
    });

    // Animate Card (entrance)
    gsap.fromTo(cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, // Natural base position
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* Left Side: Text */}
        <div className="flex-1 w-full text-left relative z-20">
          <div className="reveal-up flex mb-6">
            <div className="gold-line" />
          </div>
          <p className="reveal-up text-[var(--color-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-sans font-bold bg-[var(--color-gold)]/10 inline-block px-4 py-2 rounded-sm">
            Tentang Proyek
          </p>
          <h2 className="reveal-up font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-8 uppercase tracking-tighter">
            Memahami <br />
            Kesehatan <br />
            <span className="text-gradient-gold block mt-2">Terumbu Karang</span>
          </h2>
          <p className="reveal-up text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
            Sistem <strong className="text-white font-medium">CoralLens</strong> memanfaatkan
            arsitektur <strong className="text-white font-medium">U-Net</strong> dengan backbone
            <strong className="text-white font-medium"> EfficientNet-B3</strong> yang telah dilatih
            pada ribuan citra bawah laut untuk mendeteksi dan memvisualisasikan area kerusakan
            terumbu karang secara otomatis. Sistem ini menghitung rasio piksel kerusakan
            dan menghasilkan peta segmentasi berwarna untuk analisis lebih lanjut.
          </p>
        </div>

        {/* Right Side: Image Cards Stack */}
        <div className="flex-1 w-full flex justify-center md:justify-end relative mt-12 md:mt-0">

          <div ref={cardRef} className="relative w-full max-w-[400px] group" style={{ aspectRatio: '4/5' }}>

            {cards.slice().reverse().map((card, idxReversed) => {
              const originalIndex = (cards.length - 1) - idxReversed; // 0 for front, 1 for middle, 2 for back

              let stylingClass = "";
              if (originalIndex > 2) {
                // Hidden cards behind the stack
                stylingClass = "opacity-0 pointer-events-none transform -rotate-[10deg] -translate-x-12 scale-[0.80] z-0";
              } else if (originalIndex === 2) {
                // Back card
                stylingClass = "transform -rotate-[10deg] -translate-x-12 scale-[0.85] z-10 opacity-60 group-hover:-translate-x-44 group-hover:-rotate-[15deg] group-hover:scale-95 group-hover:opacity-100 group-hover:z-30 transition-all duration-700 ease-out cursor-pointer";
              } else if (originalIndex === 1) {
                // Middle card
                stylingClass = "transform -rotate-[3deg] -translate-x-6 scale-90 z-20 opacity-80 group-hover:-translate-x-20 group-hover:-rotate-[5deg] group-hover:scale-100 group-hover:opacity-100 group-hover:z-40 transition-all duration-700 ease-out cursor-pointer";
              } else {
                // Front card
                stylingClass = "transform rotate-4 z-30 group-hover:rotate-0 group-hover:scale-105 group-hover:z-50 transition-all duration-700 ease-out cursor-pointer bg-[#040d12]";
              }

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`absolute inset-0 rounded-[2.5rem] overflow-hidden border-2 border-gold-20 shadow-2xl shadow-black/60 ${stylingClass}`}
                >
                  <img src={card.image} alt={card.title} className={`w-full h-full object-cover ${originalIndex === 0 ? 'scale-110' : ''}`} />

                  {/* Overlay Layer */}
                  <div className={`absolute inset-0 transition-colors duration-700 ${originalIndex === 0 ? 'bg-gradient-to-t from-[#040d12] via-transparent to-transparent opacity-90' : originalIndex === 1 ? 'bg-black/30 group-hover:bg-transparent mix-blend-multiply' : 'bg-black/50 group-hover:bg-black/10 mix-blend-multiply'}`} />

                  {/* Card Content (Only visible on front card) */}
                  <div className={`absolute bottom-10 left-8 right-8 transition-opacity duration-300 ${originalIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="font-serif text-3xl text-white mb-2 uppercase tracking-wide">{card.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="bg-white text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">{card.type}</span>
                      <span className="text-[var(--color-gold)] font-sans text-[10px] tracking-widest uppercase">{card.species}</span>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Decorative background glow behind the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-gold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none z-0" />

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] text-[var(--color-gold)] tracking-widest uppercase opacity-70 animate-pulse text-center w-full">
            Klik kartu terdepan untuk melihat detail penyakit
          </div>
        </div>
      </div>

      {/* Disease Detail Modal */}
      {activeDisease && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveDisease(null)} />
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-gold-20 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row transform transition-all">

            {/* Modal Image */}
            <div className="w-full md:w-5/12 h-48 md:h-auto relative border-b md:border-b-0 md:border-r border-white/10">
              <img src={activeDisease.image} alt={activeDisease.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent md:bg-gradient-to-r" />
              <div className="absolute top-4 left-4 bg-red-600/90 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-red-500/30">
                {activeDisease.type}
              </div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-7/12 p-8 flex flex-col justify-center">
              <button
                onClick={() => setActiveDisease(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="font-serif text-3xl text-gradient-gold uppercase mb-1">{activeDisease.title}</h3>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-6">{activeDisease.species}</p>

              <div className="mb-5">
                <h4 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                  Gejala & Ciri-Ciri
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {activeDisease.symptoms}
                </p>
              </div>

              <div>
                <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Dampak pada Ekosistem
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {activeDisease.impact}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   DATASET SECTION — Spylt Reference Layout
   ═══════════════════════════════════════════════════════════ */
const StatItem = ({ title, value }) => (
  <div className="flex flex-col items-center justify-center text-center w-[45%] md:w-auto py-4 md:py-2">
    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</span>
    <span className="font-serif text-3xl md:text-4xl text-[var(--color-gold)] mt-1">{value}</span>
  </div>
);

const DatasetSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    const els = sectionRef.current.querySelectorAll('.reveal-up');
    els.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
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
        }
      );
    });

    gsap.fromTo(imageRef.current,
      { scale: 0.8, opacity: 0, rotation: 5 },
      {
        scale: 1,
        opacity: 1,
        rotation: -2,
        duration: 1.5,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.to(imageRef.current, {
      y: -15,
      rotation: 2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const pill = sectionRef.current.querySelector('.pill-bar');
    gsap.fromTo(pill,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pill,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="dataset" className="relative py-24 md:py-32 px-6 bg-[var(--color-ocean-950)] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Top Row: 3 Columns */}
        <div className="flex flex-col lg:flex-row items-center w-full gap-12 lg:gap-8 mb-24">

          {/* Left: Bold Title */}
          <div className="flex-1 w-full text-left lg:text-left relative z-20">
            <h2 className="reveal-up font-serif text-6xl md:text-7xl lg:text-[5.5rem] text-white uppercase leading-[0.9] tracking-tighter">
              Dataset <br />
              Pelatihan <br />
              <span className="inline-block bg-[var(--color-gold)] text-[var(--color-ocean-950)] px-6 py-2 mt-4 rounded-sm shadow-xl font-bold tracking-normal">
                Kualitas Tinggi
              </span>
            </h2>
          </div>

          {/* Middle: Image */}
          <div className="flex-1 w-full flex justify-center relative z-10">
            <div ref={imageRef} className="relative w-full max-w-[320px] rounded-[2rem] overflow-hidden border border-gold-20 shadow-2xl shadow-black/80" style={{ aspectRatio: '3/4' }}>
              <img src="/corals/Acropora Hyacinthus (Table Coral).png" alt="Dataset Sample" className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040d12]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/90 font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                  Data Anotasi Masking
                </span>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white opacity-[0.02] blur-[80px] rounded-full pointer-events-none -z-10" />
          </div>

          {/* Right: Small text */}
          <div className="flex-1 w-full text-left lg:text-left relative z-20">
            <p className="reveal-up text-gray-400 text-base md:text-lg leading-relaxed max-w-sm lg:ml-auto">
              Model segmentasi <strong className="text-white">U-Net</strong> kami dilatih secara khusus menggunakan kumpulan dataset citra terumbu karang berkualitas tinggi dari perairan laut. Kami menargetkan berbagai bentuk dan struktur karang untuk memastikan tingkat presisi pendeteksian yang sempurna.
            </p>
          </div>
        </div>

        {/* Bottom Pill Bar */}
        <div className="pill-bar w-full max-w-6xl glass-card rounded-[2.5rem] md:rounded-full flex flex-wrap md:flex-nowrap justify-between items-center px-6 py-8 md:px-16 md:py-8 shadow-2xl shadow-black/50 relative z-20 border border-gold-10">
          <StatItem title="Total Citra" value="3,500+" />
          <div className="w-px h-16 bg-white/10 hidden md:block" />
          <StatItem title="Resolusi Image" value="640x640" />
          <div className="w-px h-16 bg-white/10 hidden md:block" />
          <StatItem title="Format Anotasi" value="Poligon" />
          <div className="w-px h-16 bg-white/10 hidden md:block" />
          <StatItem title="Tipe Kategori" value="5 Kelas" />
          <div className="w-px h-16 bg-white/10 hidden md:block" />
          <StatItem title="Sumber Data" value="Roboflow" />
        </div>

      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   FEATURES SECTION — 3 staggered cards
   ═══════════════════════════════════════════════════════════ */
const features = [
  {
    title: 'Segmentasi Semantik',
    desc: 'Mengidentifikasi area kerusakan karang pada level piksel dengan model U-Net.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" />
        <rect x="22" y="4" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <rect x="4" y="22" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <rect x="22" y="22" width="14" height="14" rx="2" stroke="#c9a96e" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Analisis Kuantitatif',
    desc: 'Menghitung persentase area rusak vs sehat secara real-time dengan metrik evaluasi lengkap.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <polyline points="4,32 12,22 20,26 28,14 36,8" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="22" r="2" fill="#c9a96e" opacity="0.6" />
        <circle cx="20" cy="26" r="2" fill="#c9a96e" opacity="0.6" />
        <circle cx="28" cy="14" r="2" fill="#c9a96e" opacity="0.6" />
        <circle cx="36" cy="8" r="2" fill="#c9a96e" />
      </svg>
    ),
  },
  {
    title: 'Visualisasi Overlay',
    desc: 'Peta overlay berwarna yang menampilkan area kerusakan visual secara akurat di atas citra asli.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <circle cx="16" cy="20" r="12" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <circle cx="24" cy="20" r="12" stroke="#c9a96e" strokeWidth="1.5" />
        <path d="M20 11 A12 12 0 0 1 20 29 A12 12 0 0 1 20 11" fill="#c9a96e" opacity="0.15" />
      </svg>
    ),
  },
  {
    title: 'Arsitektur U-Net',
    desc: 'Memanfaatkan EfficientNet-B3 sebagai encoder untuk mengekstraksi fitur spasial kompleks dengan presisi tinggi.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="8" width="24" height="24" rx="4" stroke="#c9a96e" strokeWidth="1.5" />
        <path d="M8 20h24M20 8v24" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
        <circle cx="20" cy="20" r="6" fill="#c9a96e" opacity="0.2" stroke="#c9a96e" strokeWidth="1.5" />
      </svg>
    ),
  }
];

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);

  useGSAP(() => {
    // Reveal Header
    const headers = sectionRef.current.querySelectorAll('.reveal-up');
    headers.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Reveal Cards
    const cards = sectionRef.current.querySelectorAll('.feature-card');
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Reveal Center Mockup
    gsap.fromTo(phoneRef.current,
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: phoneRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

  }, { scope: sectionRef });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 md:py-36 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20 relative z-20">
          <div className="reveal-up inline-block bg-[var(--color-gold)]/10 px-6 py-2 rounded-full mb-6 border border-gold-20">
            <span className="text-[var(--color-gold)] text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
              Proses Kami
            </span>
          </div>
          <h2 className="reveal-up font-serif text-4xl md:text-6xl text-white tracking-tight mb-4">
            Apa yang <span className="font-sans font-bold italic text-white">Sistem Lakukan</span>
          </h2>
          <p className="reveal-up text-gray-400 mt-2 text-xs md:text-sm tracking-[0.2em] uppercase">
            Teknologi AI cerdas di balik layar.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 relative z-10">

          {/* Left Column (Cards 1 & 2) */}
          <div className="flex flex-col justify-start gap-16 w-full lg:w-[30%] lg:pt-10 lg:pb-32">
            {[features[0], features[1]].map((f, i) => (
              <div key={i} className="feature-card glass-card rounded-[1.5rem] p-8 border border-white/5 hover:border-gold-30 transition-all duration-300 hover:bg-white/[0.03]">
                <div className="mb-6 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">{f.icon}</div>
                <h3 className="font-serif text-xl text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Center Column (System / Phone Mockup) */}
          <div className="w-full lg:w-[35%] relative my-8 lg:my-0">
            {/* Native CSS Sticky Container */}
            <div className="lg:sticky lg:top-32 flex flex-col items-center justify-start w-full h-full lg:h-auto">
              <div ref={phoneRef} className="relative w-full max-w-[280px] bg-[#02080a] border border-white/10 rounded-[3rem] p-2 shadow-2xl shadow-black z-10" style={{ aspectRatio: "9/19" }}>
                {/* Screen Content */}
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-[var(--color-ocean-950)] border border-white/5">
                  <img src="/detection-demo.png" alt="System Demo" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />

                  {/* Gradient overlay to make logo pop */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#02080a]/20 via-[#02080a]/60 to-[#02080a]" />

                  {/* Center Logo/Text inside mockup */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="mb-4">
                      <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
                      <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" opacity="0.3" />
                    </svg>
                    <span className="font-serif text-3xl tracking-widest text-white uppercase opacity-90">CoralLens</span>
                  </div>
                </div>
              </div>
              {/* Ambient Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-gold)] opacity-[0.04] blur-[100px] pointer-events-none z-0" />
            </div>
          </div>

          {/* Right Column (Cards 3 & 4) */}
          <div className="flex flex-col justify-end gap-16 w-full lg:w-[30%] lg:pt-32 lg:pb-10">
            {[features[2], features[3]].map((f, i) => (
              <div key={i} className="feature-card glass-card rounded-[1.5rem] p-8 border border-white/5 hover:border-gold-30 transition-all duration-300 hover:bg-white/[0.03]">
                <div className="mb-6 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">{f.icon}</div>
                <h3 className="font-serif text-xl text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

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
   FOOTER — Immersive Design
   ═══════════════════════════════════════════════════════════ */
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="relative bg-[#02080a] pt-16 md:pt-24 pb-10 overflow-hidden border-t border-white/5 flex flex-col justify-between min-h-[60vh]">

      {/* Floating Center Image (BEHIND TEXT) */}
      <div className="relative z-10 w-full flex flex-col items-center flex-1">

        {/* Social Icons floating above the image */}
        <div className="flex items-center justify-center gap-4 z-30 mb-8 md:mb-10">
          <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full glass-card flex items-center justify-center border border-white/10 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors text-white hover:text-[var(--color-gold)] backdrop-blur-md">
            {/* Play/Youtube Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15L15 12L10 9V15ZM21.56 7.17C21.43 6.64 21.05 6.2 20.5 6.07C18.61 5.57 12 5.57 12 5.57C12 5.57 5.39 5.57 3.5 6.07C2.95 6.2 2.57 6.64 2.44 7.17C2 8.9 2 12 2 12C2 12 2 15.1 2.44 16.83C2.57 17.36 2.95 17.8 3.5 17.93C5.39 18.43 12 18.43 12 18.43C12 18.43 18.61 18.43 20.5 17.93C21.05 17.8 21.43 17.36 21.56 16.83C22 15.1 22 12 22 12C22 12 22 8.9 21.56 7.17Z" /></svg>
          </a>
          <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full glass-card flex items-center justify-center border border-white/10 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors text-white hover:text-[var(--color-gold)] backdrop-blur-md">
            {/* Instagram Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </a>
          <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full glass-card flex items-center justify-center border border-white/10 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors text-white hover:text-[var(--color-gold)] backdrop-blur-md">
            {/* Twitter/X Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
        </div>

        <div className="relative w-full max-w-[280px] md:max-w-md lg:max-w-xl flex justify-center min-h-[300px]">
          {/* Image */}
          <img
            src="/Imagefooter.png"
            alt="Coral Reef"
            className="w-[120%] md:w-full h-auto object-contain hover:scale-105 transition-transform duration-700 ease-out z-10"
          />
          {/* Subtle backglow for the image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-[var(--color-gold)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none z-0" />
        </div>
      </div>

      {/* Huge Background Text (OVER TEXT) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20 overflow-hidden">
        <h1 className="font-serif text-[8vw] md:text-[10vw] font-bold text-white uppercase tracking-tight whitespace-nowrap leading-none mt-[-5vh] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mix-blend-overlay">
          #SAVEOURREEFS
        </h1>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-end relative z-30 mt-12 bg-gradient-to-t from-[#02080a] via-[#02080a]/90 to-transparent pt-12">

        {/* Left: Logo & Links */}
        <div className="flex flex-col gap-6 w-full md:w-2/3 lg:w-1/2">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
              <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" />
            </svg>
            <span className="font-serif text-lg tracking-widest text-gradient-gold uppercase">
              CoralLens
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#features" className="hover:text-white transition-colors">Technology</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <button onClick={() => setShowResearchModal(true)} className="text-left hover:text-white transition-colors">Research</button>
            <a href="#" className="hover:text-white transition-colors">Partners</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        {/* Right: Newsletter */}
        <div className="w-full flex flex-col gap-4 relative">
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Dapatkan akses eksklusif dan informasi terbaru seputar perkembangan teknologi AI konservasi laut kami!
          </p>
          <div className="relative mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full bg-transparent border-b py-3 text-white focus:outline-none transition-all placeholder:text-gray-500 font-serif text-xl pr-12 ${isSubscribed ? 'border-emerald-500 opacity-50' : 'border-gray-600 focus:border-[var(--color-gold)]'}`}
              disabled={isSubscribed}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            />
            <button 
              onClick={handleSubscribe}
              disabled={isSubscribed}
              className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${isSubscribed ? 'text-emerald-500' : 'text-[var(--color-gold)] hover:text-white cursor-pointer'}`}
            >
              {isSubscribed ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </button>
            
            {/* Success Message */}
            <div className={`absolute top-full left-0 mt-2 text-xs font-sans text-emerald-400 transition-all duration-300 ${isSubscribed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              ✨ Terima kasih telah berlangganan!
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Line */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 border-t border-white/10 pt-6 relative z-30 font-sans tracking-wide">
        <p>Designed for Pengolahan Citra Digital - Copyright © 2026 CoralLens - All Rights Reserved</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* RESEARCH MODAL */}
      {showResearchModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#02080a]/90 backdrop-blur-md"
            onClick={() => setShowResearchModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="border-b border-white/10 p-6 flex justify-between items-center bg-black/40">
              <div>
                <h3 className="font-serif text-2xl text-[var(--color-gold)] uppercase tracking-wider">Research Documentation</h3>
                <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">Sistem Estimasi Kondisi Terumbu Karang Berbasis AI</p>
              </div>
              <button 
                onClick={() => setShowResearchModal(false)}
                className="text-gray-500 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-10 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,169,110,0.3) transparent' }}>
              
              {/* Abstract */}
              <div className="mb-10">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--color-gold)] rounded-full"/> Abstrak
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed text-justify">
                  Sistem <strong className="text-white">CoralLens</strong> merupakan web-based application yang dirancang untuk melakukan segmentasi semantik pada citra terumbu karang. Tujuan utamanya adalah mengekstraksi metrik persentase area kerusakan (pemutihan/penyakit) dibandingkan dengan area karang sehat, guna mendukung upaya restorasi dan pemantauan ekosistem laut oleh Dinas Kelautan maupun NGO.
                </p>
              </div>

              {/* Architecture & Workflow */}
              <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> Arsitektur Model
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-2 list-disc ml-4">
                    <li><strong>Framework:</strong> PyTorch (FastAPI Backend)</li>
                    <li><strong>Network:</strong> Semantic Segmentation U-Net</li>
                    <li><strong>Backbone:</strong> EfficientNet-B3 (Feature Extractor)</li>
                    <li><strong>Preprocessing:</strong> Rembg U²-Net (Alpha Matting)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> Evaluasi Metrik AI
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-2 list-disc ml-4">
                    <li><strong>Global Accuracy:</strong> <span className="text-white font-mono">91.55%</span></li>
                    <li><strong>F1-Score:</strong> <span className="text-white font-mono">93.02%</span> (Equilibrium)</li>
                    <li><strong>Mean IoU:</strong> <span className="text-white font-mono">86.95%</span> (Intersection over Union)</li>
                    <li><strong>Loss Function:</strong> Binary Cross Entropy</li>
                  </ul>
                </div>
              </div>

              {/* Experiments & Optimizations */}
              <div className="mb-10">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"/> Eksperimen & Optimasi Threshold
                </h4>
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                  <p className="text-sm text-gray-400 leading-relaxed text-justify mb-4">
                    Prediksi mask piksel menggunakan fungsi aktivasi <strong className="text-white">Sigmoid</strong>. Sistem dilengkapi parameter *Threshold Control* dinamis:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-3">
                    <li className="flex gap-3"><span className="text-[var(--color-gold)] font-bold">100%</span> AI bertindak perfeksionis, hanya meloloskan piksel pucat ekstrem. Persentase rusak turun drastis.</li>
                    <li className="flex gap-3"><span className="text-[var(--color-gold)] font-bold">0%</span> AI meloloskan semua kecurigaan piksel, memprediksi kerusakan menjadi maksimal.</li>
                    <li className="flex gap-3"><span className="text-[var(--color-gold)] font-bold">50%</span> Sweet-spot ekuilibrium (F1-Score tertinggi) yang diset sebagai default sistem.</li>
                  </ul>
                </div>
              </div>

              {/* System Limitations */}
              <div>
                <h4 className="text-red-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"/> Batasan Sistem (Known Limitations)
                </h4>
                <div className="space-y-4">
                  <div className="border-l-2 border-red-500/50 pl-4">
                    <h5 className="text-white text-sm font-bold">1. Kegagalan Background Removal pada Cluttered Image</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Algoritma <i>salience</i> terkadang menghapus struktur karang utama jika latar belakang perairan terlalu ramai (banyak ikan/terumbu tumpang tindih). Gambar ideal adalah *close-up/macro*.</p>
                  </div>
                  <div className="border-l-2 border-red-500/50 pl-4">
                    <h5 className="text-white text-sm font-bold">2. Out of Distribution (OOD) - Spektrum Akuarium</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Pengujian pada foto akuarium dengan sorotan lampu <i>Actinic Blue/Purple</i> (ungu neon) menyebabkan bias deteksi hingga 70%. Model butuh retraining tambahan karena dataset primer 100% menggunakan spektrum cahaya matahari alami.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </footer>
  );
};

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE (Main Component)
   ═══════════════════════════════════════════════════════════ */
const LandingPage = ({ onStartDetection, onExploreGallery }) => {
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

    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        lenis.scrollTo(targetId, { offset: -80 }); // Offset for the fixed navbar
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-ocean-950)]">
      <Particles />
      <Navbar onExploreGallery={onExploreGallery} />
      <HeroSection onStartDetection={onStartDetection} />
      <GallerySection onExploreGallery={onExploreGallery} />
      <AboutSection />
      <DatasetSection />
      <FeaturesSection />
      <DetectionSection onStartDetection={onStartDetection} />
      <Footer />
    </div>
  );
};

export default LandingPage;
