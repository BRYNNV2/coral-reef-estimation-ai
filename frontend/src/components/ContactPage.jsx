import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowLeft, Mail, Send, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactPage = ({ onBack }) => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

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
      <section className="relative pt-36 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="reveal text-[var(--color-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-bold flex items-center justify-center gap-2">
            <Mail size={16} /> Kolaborasi & Dukungan
          </p>
          <h1 className="reveal font-serif text-4xl md:text-6xl text-white leading-[1.1] mb-6 uppercase tracking-tight">
            Hubungi <span className="text-gradient-gold">Kami</span>
          </h1>
          <p className="reveal text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Apakah Anda seorang peneliti, pegiat konservasi laut, atau tertarik untuk menggunakan sistem kami di institusi Anda? Kami siap berkolaborasi.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6 max-w-5xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Contact Info */}
          <div className="reveal space-y-10">
            <div>
              <h3 className="text-white font-serif text-2xl tracking-wide uppercase mb-6">Informasi Kontak</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Tim pengembang CoralLens AI berpusat di laboratorium penelitian visi komputer. Kami terbuka untuk diskusi terkait *open-source model*, kustomisasi dataset, atau dukungan teknis.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Email Resmi</h4>
                  <p className="text-gray-400 text-sm">research@corallens.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Universitas Maritim Raja Ali Haji</h4>
                  <p className="text-gray-400 text-sm">Fakultas Teknik dan Teknologi Kemaritiman<br/>Teknik Informatika</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Repositori GitHub</h4>
                  <a href="https://github.com/BRYNNV2/coral-reef-estimation-ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-[var(--color-gold)] transition-colors cursor-pointer block truncate w-64 md:w-auto">
                    github.com/BRYNNV2/coral-reef-estimation-ai
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal bg-white/[0.02] border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <h3 className="text-white font-serif text-2xl tracking-wide uppercase mb-8">Kirim Pesan</h3>
            
            {isSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-sm z-20">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h4 className="text-emerald-400 font-serif text-2xl mb-2">Pesan Terkirim</h4>
                <p className="text-gray-400 text-sm text-center max-w-xs">Terima kasih telah menghubungi kami. Tim kami akan segera merespons email Anda.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="Prof. John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Alamat Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="john@institution.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pesan / Tujuan</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-gold)] transition-colors h-32 resize-none"
                  placeholder="Jelaskan maksud dan tujuan Anda berkolaborasi..."
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[var(--color-gold)] text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[var(--color-gold-light)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Kirim Pesan <Send size={16} /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
