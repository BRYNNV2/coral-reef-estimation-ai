import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const coralsData = [
  {
    id: 1,
    name: 'Acropora',
    type: 'Branching Coral',
    image: '/corals/Acropora (Branching Coral).png',
    desc: 'Bentuk karang bercabang yang menjadi habitat utama banyak ikan kecil. Tumbuh sangat cepat namun sangat rentan terhadap perubahan suhu laut dan pemutihan karang (bleaching).',
    price: 'A',
    category: 'branching'
  },
  {
    id: 2,
    name: 'Diploria',
    type: 'Brain Coral / Massive',
    image: '/corals/Diploria (Brain Coral  Massive).png',
    desc: 'Bentuknya menyerupai otak manusia dengan alur-alur yang kompleks. Tumbuh sangat lambat, namun strukturnya yang padat membuatnya sangat kuat dan mampu bertahan dari hantaman badai.',
    price: 'D',
    category: 'massive'
  },
  {
    id: 3,
    name: 'Turbinaria',
    type: 'Foliose Coral / Vase',
    image: '/corals/Turbinaria (Foliose Coral  Vase).png',
    desc: 'Membentuk struktur seperti lembaran terlipat atau vas raksasa. Sering ditemukan mendominasi di lereng terumbu yang lebih dalam dengan arus air yang moderate.',
    price: 'T',
    category: 'foliose'
  },
  {
    id: 4,
    name: 'Fungia',
    type: 'Mushroom Coral',
    image: '/corals/Fungia (Mushroom Coral).png',
    desc: 'Karang soliter yang berbentuk seperti jamur atau cakram. Uniknya, sebagian besar spesies ini tidak melekat pada substrat dan dapat bergerak bebas secara pasif di dasar laut.',
    price: 'F',
    category: 'foliose'
  },
  {
    id: 5,
    name: 'Acropora Hyacinthus',
    type: 'Table Coral',
    image: '/corals/Acropora Hyacinthus (Table Coral).png',
    desc: 'Tumbuh mendatar membentuk struktur seperti meja datar yang sangat lebar. Strategi ini sangat efektif untuk memaksimalkan penangkapan cahaya matahari di perairan dangkal yang jernih.',
    price: 'AH',
    category: 'foliose'
  },
  {
    id: 6,
    name: 'Seriatopora',
    type: 'Birdnest Coral',
    image: '/corals/Seriatopora (Birdnest Coral).png',
    desc: 'Cabang-cabangnya tipis, halus, dan runcing menyerupai anyaman sarang burung. Spesies ini sangat indah namun sangat sensitif terhadap perubahan kualitas air dan suhu.',
    price: 'S',
    category: 'branching'
  },
  {
    id: 7,
    name: 'Pocillopora',
    type: 'Cauliflower Coral',
    image: '/corals/ChatGPT Image 23 Mei 2026, 21.37.40 (1).png',
    desc: 'Memiliki struktur yang kuat dan membulat seperti kembang kol. Ini adalah karang pionir yang sangat tangguh dan sering menjadi kolonisator pertama di area terumbu yang rusak.',
    price: 'P',
    category: 'branching'
  },
  {
    id: 8,
    name: 'Montipora',
    type: 'Plating Coral',
    image: '/corals/ChatGPT Image 23 Mei 2026, 21.37.43 (7).png',
    desc: 'Tumbuh berlapis-lapis membentuk piringan atau lembaran tipis yang saling menumpuk. Sering menutupi luasan area yang besar dan mampu hidup dalam kondisi cahaya rendah.',
    price: 'M',
    category: 'foliose'
  },
  {
    id: 9,
    name: 'Euphyllia',
    type: 'Torch / Hammer Coral',
    image: '/corals/ChatGPT Image 23 Mei 2026, 21.37.43 (8).png',
    desc: 'Polipnya memanjang seperti tentakel berdaging dengan ujung yang bercahaya. Memiliki "sweeper tentacles" penyengat mematikan yang digunakan secara agresif untuk mempertahankan ruang hidupnya.',
    price: 'E',
    category: 'massive'
  },
  {
    id: 10,
    name: 'Porites',
    type: 'Boulder / Massive',
    image: '/corals/ChatGPT Image 23 Mei 2026, 21.37.43 (9).png',
    desc: 'Membentuk bongkahan raksasa padat yang menyerupai batu besar. Tumbuh sangat lambat (hanya beberapa milimeter per tahun) dan beberapa koloni dapat hidup hingga ratusan tahun.',
    price: 'P',
    category: 'massive'
  },
  {
    id: 11,
    name: 'Acanthastrea',
    type: 'Star Coral',
    image: '/corals/Acanthastrea — Star Coral.jpeg',
    desc: 'Memiliki koralit berbentuk bintang yang sangat menonjol dengan warna-warni cerah yang sangat indah. Terkenal sebagai salah satu karang hias paling populer karena keanekaragaman pola warnanya.',
    price: 'A',
    category: 'massive'
  },
  {
    id: 12,
    name: 'Favites',
    type: 'Closed Brain Coral',
    image: '/corals/Favites - Closed Brain Coral.jpeg',
    desc: 'Mirip dengan karang otak konvensional, namun dinding-dinding koralitnya menyatu secara rapat membentuk pola bersegi banyak (poligonal). Sangat toleran terhadap perairan dengan kekeruhan sedang.',
    price: 'F',
    category: 'massive'
  },
  {
    id: 13,
    name: 'Galaxea',
    type: 'Galaxy Coral',
    image: '/corals/Galaxea — Galaxy Coral.jpeg',
    desc: 'Koralitnya tumbuh menjulang seperti pilar-pilar kecil tajam mirip bintang-bintang di galaksi. Memiliki tentakel penyengat yang panjang dan agresif di malam hari untuk berburu plankton.',
    price: 'G',
    category: 'massive'
  },
  {
    id: 14,
    name: 'Goniopora',
    type: 'Flowerpot Coral',
    image: '/corals/Geniopora - Flower Pot Corall.jpeg',
    desc: 'Terkenal dengan polip panjang menjulur menyerupai sekumpulan bunga pot yang melambai-lambai mengikuti arus. Sangat sensitif terhadap sentuhan fisik dan stres lingkungan.',
    price: 'GO',
    category: 'massive'
  },
  {
    id: 15,
    name: 'Hydnophora',
    type: 'Horn Coral',
    image: '/corals/Hydnophora — Horn Coral.png',
    desc: 'Permukaan karangnya dipenuhi struktur runcing unik mirip tanduk-tanduk kecil bernama montikula. Karang ini memiliki tingkat pertumbuhan yang solid di bawah arus deras.',
    price: 'H',
    category: 'branching'
  } ,
  {
    id: 16,
    name: 'Leptoseris',
    type: 'Thin Plate Coral',
    image: '/corals/Leptoseris — Thin Plate Coral.jpeg',
    desc: 'Membentuk koloni lembaran tipis yang sangat berkerut dengan alur halus. Mampu beradaptasi dengan baik di kedalaman laut yang minim intensitas cahaya matahari.',
    price: 'L',
    category: 'foliose'
  },
  {
    id: 17,
    name: 'Merulina',
    type: 'Lettuce Coral',
    image: '/corals/Merulina — Lettuce Coral.jpeg',
    desc: 'Memiliki struktur berlipat-lipat menyerupai daun selada atau kipas bergelombang. Alur-alur di permukaannya berfungsi mengarahkan nutrisi ke bagian polip.',
    price: 'ME',
    category: 'foliose'
  },
  {
    id: 18,
    name: 'Pavona',
    type: 'Cactus Coral',
    image: '/corals/Pavona — Cactus Coral.png',
    desc: 'Tumbuh tegak berlembar-lembar menyerupai tanaman kaktus gurun di dasar laut. Memiliki tekstur halus di kedua sisi lembarannya yang dipenuhi lubang polip kecil.',
    price: 'PV',
    category: 'foliose'
  },
  {
    id: 19,
    name: 'Stylophora',
    type: 'Cat\'s Paw Coral',
    image: '/corals/Stylophora — Cat’s Paw Coral.png',
    desc: 'Memiliki cabang tebal membulat di ujungnya yang menyerupai bentuk cakar kucing. Tumbuh berkelompok rapat dan menyukai wilayah dengan paparan sinar matahari penuh.',
    price: 'ST',
    category: 'branching'
  },
  {
    id: 20,
    name: 'Tubastraea',
    type: 'Sun Coral',
    image: '/corals/Tubastraea — Sun Coral.jpeg',
    desc: 'Karang non-fotosintetik yang tidak memerlukan cahaya matahari. Polipnya berwarna kuning-oranye menyala mirip matahari, yang mengembang penuh di malam hari untuk menangkap plankton.',
    price: 'TU',
    category: 'massive'
  }
];

const GalleryPage = ({ onBack }) => {
  const containerRef = useRef(null);
  const [selectedCoral, setSelectedCoral] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCorals = activeCategory === 'all'
    ? coralsData
    : coralsData.filter(coral => coral.category === activeCategory);

  // Scroll to top and Lenis Smooth Scroll
  useEffect(() => {
    // Prevent browser from restoring previous scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force immediate browser scroll to top BEFORE Lenis initializes
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    // Double ensure scroll is at top after DOM paint
    setTimeout(() => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }, 50);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useGSAP(() => {
    // Entrance Animation for Hero Text
    gsap.fromTo('.hero-text-reveal',
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
    );

    // Parallax hero images
    gsap.to('.hero-img-left', {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: '.gallery-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
    gsap.to('.hero-img-right', {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: '.gallery-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Reveal List items (only those that are initially visible, or we let them animate naturally)
    const items = gsap.utils.toArray('.list-item');
    items.forEach((item, i) => {
      gsap.fromTo(item, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: (i % 5) * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            scroller: '.scrollable-list', // Use the scrollable div as the scroller
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[var(--color-gold)] selection:text-black font-sans">
      
      {/* NAVBAR */}
      <nav className="navbar fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-300 bg-[#0a0a0a]">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onBack}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-100 transition-opacity">
            <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
            <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" opacity="0.3" />
            <path d="M10 18 Q16 10 22 18" stroke="#c9a96e" strokeWidth="1" fill="none" />
          </svg>
          <span className="font-serif text-lg tracking-widest text-gradient-gold uppercase font-semibold">
            CoralLens
          </span>
        </div>
        <div className="flex gap-8 text-sm tracking-wider uppercase text-white">
          <button onClick={onBack} className="hover:text-[var(--color-gold)] transition-colors duration-300">
            Beranda
          </button>
        </div>
      </nav>

      {/* SECTION 1: HERO MOODY PARALLAX */}
      <section className="gallery-hero relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        
        {/* Abstract Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)] z-10 pointer-events-none" />

        {/* Left Parallax Image */}
        <div className="hero-img-left absolute left-4 md:left-24 top-1/4 w-[40vw] md:w-[25vw] opacity-40 md:opacity-60 z-0 grayscale-[20%] hover:grayscale-0 transition-all duration-700">
          <img src="/corals/Diploria (Brain Coral  Massive).png" alt="Brain Coral" className="w-full h-auto object-cover rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Right Parallax Image */}
        <div className="hero-img-right absolute right-4 md:right-24 top-[40%] w-[45vw] md:w-[28vw] opacity-40 md:opacity-60 z-0 grayscale-[20%] hover:grayscale-0 transition-all duration-700">
          <img src="/corals/Acropora (Branching Coral).png" alt="Branching Coral" className="w-full h-auto object-cover rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Center Text */}
        <div className="relative z-20 text-center flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6 hero-text-reveal">
            <div className="w-12 h-px bg-[var(--color-gold)] opacity-40" />
            <span className="text-[var(--color-gold)] text-xs md:text-sm tracking-[0.4em] uppercase">The Collection</span>
            <div className="w-12 h-px bg-[var(--color-gold)] opacity-40" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight drop-shadow-2xl hero-text-reveal">
            Eksplorasi<br/><span className="text-gray-300 italic font-light block mt-2">Spesies Karang</span>
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 opacity-50 hero-text-reveal">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* SECTION 2: LIST (Menu & Items) */}
      <section className="pt-48 pb-32 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 md:gap-24 relative z-20 bg-[#0a0a0a]">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 relative hidden md:block">
          <div className="flex flex-col gap-10">
            <h3 className="font-serif text-xl tracking-[0.3em] text-white/50 uppercase border-b border-white/10 pb-6">Bentuk Karang</h3>
            <div className="flex flex-col gap-5 text-xs tracking-[0.2em] text-gray-500 uppercase">
              <span 
                onClick={() => setActiveCategory('all')}
                className={`pl-4 py-1 transition-all cursor-pointer border-l-2 ${activeCategory === 'all' ? 'text-white border-[var(--color-gold)] font-bold' : 'hover:text-white border-transparent'}`}
              >
                Semua Spesies
              </span>
              <span 
                onClick={() => setActiveCategory('branching')}
                className={`pl-4 py-1 transition-all cursor-pointer border-l-2 ${activeCategory === 'branching' ? 'text-white border-[var(--color-gold)] font-bold' : 'hover:text-white border-transparent'}`}
              >
                Branching
              </span>
              <span 
                onClick={() => setActiveCategory('massive')}
                className={`pl-4 py-1 transition-all cursor-pointer border-l-2 ${activeCategory === 'massive' ? 'text-white border-[var(--color-gold)] font-bold' : 'hover:text-white border-transparent'}`}
              >
                Massive
              </span>
              <span 
                onClick={() => setActiveCategory('foliose')}
                className={`pl-4 py-1 transition-all cursor-pointer border-l-2 ${activeCategory === 'foliose' ? 'text-white border-[var(--color-gold)] font-bold' : 'hover:text-white border-transparent'}`}
              >
                Foliose
              </span>
            </div>
          </div>
        </div>

        {/* List Content (Scrollable Container) */}
        <div 
          className="w-full md:w-3/4 flex flex-col h-[75vh] overflow-y-auto scrollable-list pr-4" 
          data-lenis-prevent="true"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,169,110,0.3) transparent' }}
        >
          {/* Header Line inside scrollable so it aligns with left sidebar */}
          <div className="border-t border-white/10 mb-8" />
          
          {filteredCorals.map((coral) => (
            <div 
              key={coral.id} 
              className="list-item group flex items-start justify-between cursor-pointer border-b border-white/5 pb-12 mb-12 hover:border-white/20 transition-all duration-500"
              onClick={() => setSelectedCoral(coral)}
            >
              {/* Image & Text Group */}
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-start w-full pr-4">
                {/* Thumbnail */}
                <div className="w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/5 group-hover:border-[var(--color-gold)]/40 transition-colors duration-500 relative">
                  <img src={coral.image} alt={coral.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                {/* Text */}
                <div className="flex flex-col pt-2 w-full">
                  <h4 className="font-serif text-3xl md:text-4xl text-gray-200 group-hover:text-white transition-colors duration-300">{coral.name}</h4>
                  <p className="text-[var(--color-gold)] text-[10px] md:text-xs tracking-[0.2em] uppercase mt-3 mb-5 opacity-80">{coral.type}</p>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
                    {coral.desc}
                  </p>
                </div>
              </div>
              
              {/* Decorative Right Arrow */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-[var(--color-gold)] text-white/30 group-hover:text-[var(--color-gold)] transition-all duration-500 mt-4 group-hover:translate-x-2 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL / EXPLANATION CARD */}
      {selectedCoral && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#050505]/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300">
          <div 
            className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-12 h-12 bg-black/40 hover:bg-[var(--color-gold)] text-white hover:text-black backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-transparent"
              onClick={() => setSelectedCoral(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Left: Large Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative overflow-hidden group">
              <img src={selectedCoral.image} alt={selectedCoral.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s] ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]" />
              {/* Subtle Gold Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-gold)_200%)] opacity-20 mix-blend-color" />
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center overflow-y-auto">
              <div className="inline-block px-4 py-2 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-[10px] tracking-[0.3em] uppercase rounded-full mb-8 w-fit backdrop-blur-sm shadow-inner">
                {selectedCoral.type}
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-[1.1]">{selectedCoral.name}</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-12">
                {selectedCoral.desc}
              </p>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-auto">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">Karakteristik Pertumbuhan</p>
                  <p className="text-white font-medium text-sm md:text-base border-l-2 border-[var(--color-gold)] pl-3">Bergantung pada pencahayaan & kedalaman</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">Tingkat Kerentanan</p>
                  <p className="text-white font-medium text-sm md:text-base border-l-2 border-[var(--color-gold)] pl-3">Sangat terpengaruh suhu air laut</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;
