import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowLeft, MessageCircleQuestion, Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: 'Bagaimana cara mengambil foto karang yang ideal untuk analisis?',
    a: 'Ambil foto dari jarak dekat (close-up/macro) agar tekstur karang terlihat jelas. Pastikan pencahayaan alami (cahaya matahari) cukup terang dan minimalkan objek yang menutupi karang seperti ikan, atau terumbu karang lain yang tumpang tindih.',
  },
  {
    q: 'Mengapa gambar saya ditolak atau gagal diproses?',
    a: 'Sistem kami menggunakan AI "Satpam" (Zero-Shot Classifier CLIP) yang akan memblokir gambar jika terdeteksi bukan terumbu karang (misalnya: foto wajah, daratan, atau hewan laut non-karang). Ini bertujuan menjaga keakuratan analisis U-Net kami agar tidak tercemar outlier.',
  },
  {
    q: 'Apakah CoralLens dapat digunakan untuk karang di akuarium?',
    a: 'Saat ini, akurasi untuk foto akuarium yang menggunakan lampu Actinic Blue (warna ungu neon) masih rendah. Model kami dilatih secara spesifik menggunakan ribuan dataset dengan spektrum cahaya matahari alami di laut lepas.',
  },
  {
    q: 'Apa arti metrik persentase pada hasil deteksi?',
    a: 'Persentase tersebut menunjukkan rasio antara area piksel karang yang terdeteksi rusak (mengalami pemutihan/penyakit) dibandingkan dengan total area karang sehat di dalam satu frame foto. Rasio ini membantu klasifikasi kondisi karang dari "Sangat Baik" hingga "Kritis".',
  },
  {
    q: 'Apakah foto yang saya unggah akan disimpan oleh server?',
    a: 'Tidak. Aplikasi ini mengutamakan privasi dan berjalan secara stateless di sisi backend. Foto yang Anda unggah hanya diproses sementara di server RAM untuk menghasilkan inferensi segmentasi, dan akan langsung dihapus, tidak disimpan ke dalam database permanen kami.',
  },
  {
    q: 'Seberapa akurat deteksi kerusakan pada sistem ini?',
    a: 'Model kami mencapai Global Accuracy sebesar 91.55% dan F1-Score 93.02% pada data pengujian. Namun, hasil bisa bervariasi tergantung dari kualitas kamera, tingkat kekeruhan air, dan sudut pengambilan gambar.',
  }
];

const FAQPage = ({ onBack }) => {
  const containerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => lenis.destroy();
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current.querySelectorAll('.reveal'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[var(--color-ocean-950)] text-white">
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

      {/* Header */}
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="reveal text-[var(--color-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-bold flex items-center justify-center gap-2">
            <MessageCircleQuestion size={16} /> Bantuan
          </p>
          <h1 className="reveal font-serif text-4xl md:text-6xl text-white leading-[1.1] mb-6 uppercase tracking-tight">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h1>
          <p className="reveal text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar cara kerja, batasan, dan penggunaan sistem deteksi CoralLens AI.
          </p>
        </div>
      </section>

      {/* Accordion Content */}
      <section className="pb-32 px-6 max-w-3xl mx-auto relative z-10">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="reveal bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-gold)]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none cursor-pointer group"
              >
                <h3 className={`text-sm md:text-base font-bold transition-colors ${openIndex === i ? 'text-[var(--color-gold)]' : 'text-white group-hover:text-[var(--color-gold-light)]'}`}>
                  {faq.q}
                </h3>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ml-4 transition-all duration-300 ${openIndex === i ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]' : 'border-white/20 text-gray-500 group-hover:border-[var(--color-gold)]/50 group-hover:text-[var(--color-gold)]'}`}>
                  <Plus size={16} className={`transition-transform duration-500 ${openIndex === i ? 'rotate-45' : ''}`} />
                </div>
              </button>
              
              <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 text-sm leading-relaxed p-6 md:p-8 pt-0 border-t border-white/5 mt-2">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
