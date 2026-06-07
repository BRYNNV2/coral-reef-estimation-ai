import React, { useEffect } from 'react';
import { ArrowLeft, Users, Building, Cpu, Globe } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PartnersPage = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    gsap.from('.fade-up', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  });

  const partners = [
    {
      name: "Universitas Maritim Raja Ali Haji",
      role: "Academic Institution",
      desc: "Mendukung penelitian ekologi maritim dan komputasi cerdas (Pengolahan Citra Digital).",
      icon: <Building size={32} className="text-[var(--color-gold)]" />,
    },
    {
      name: "Hugging Face",
      role: "AI Infrastructure",
      desc: "Menyediakan infrastruktur cloud gratis untuk deployment model U-Net dan CLIP Classifier.",
      icon: <Cpu size={32} className="text-[var(--color-gold)]" />,
    },
    {
      name: "Vercel",
      role: "Frontend Hosting",
      desc: "Menyediakan platform hosting super cepat untuk antarmuka React dan PWA CoralLens.",
      icon: <Globe size={32} className="text-[var(--color-gold)]" />,
    },
    {
      name: "OpenAI CLIP",
      role: "Zero-Shot Model",
      desc: "Teknologi di balik 'Satpam AI' yang memvalidasi input gambar terumbu karang.",
      icon: <Users size={32} className="text-[var(--color-gold)]" />,
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-ocean-950)] text-white pt-24 pb-16 px-4 md:px-8">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-[50] bg-[var(--color-ocean-950)]/90 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="hidden md:inline">Kembali ke Beranda</span>
        </button>
        <div className="flex items-center gap-3">
          <Users size={20} className="text-[var(--color-gold)]" />
          <span className="font-serif text-sm tracking-widest text-gradient-gold uppercase">
            Partners
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto mt-12">
        <div className="text-center mb-16 fade-up">
          <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-gold)] mb-4 font-medium">Mitra & Dukungan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Proyek CoralLens AI tidak akan terwujud tanpa dukungan dari berbagai institusi akademik dan penyedia infrastruktur teknologi open-source kelas dunia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up">
          {partners.map((partner, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-8 border border-white/5 hover:border-[var(--color-gold)]/30 transition-all group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gold-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {partner.icon}
              </div>
              <h3 className="text-xl font-serif text-white mb-1">{partner.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-bold mb-4">{partner.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{partner.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
