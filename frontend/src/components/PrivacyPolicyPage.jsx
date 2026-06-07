import React, { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PrivacyPolicyPage = ({ onBack }) => {
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
          <Shield size={20} className="text-[var(--color-gold)]" />
          <span className="font-serif text-sm tracking-widest text-gradient-gold uppercase">
            Privacy Policy
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto mt-12 fade-up">
        <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-gold)] mb-8 font-medium">Kebijakan Privasi</h1>
        
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/5 space-y-8 text-gray-300 leading-relaxed font-sans text-sm md:text-base">
          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">1. Pengumpulan Data</h2>
            <p>
              Sistem CoralLens mengumpulkan data citra/gambar terumbu karang yang Anda unggah secara langsung melalui antarmuka web. 
              Gambar-gambar ini hanya digunakan untuk keperluan inferensi sesaat (sementara) dan dikirim ke server pemrosesan AI kami (Hugging Face / Local Backend).
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">2. Penyimpanan Data</h2>
            <p>
              Gambar yang Anda unggah <strong>TIDAK DISIMPAN</strong> secara permanen di server kami setelah proses inferensi selesai.
              Adapun data "Riwayat Sesi" yang muncul di halaman Dashboard Anda hanya disimpan secara lokal di dalam browser perangkat Anda menggunakan memori state sementara. Data riwayat tersebut akan hilang secara permanen jika Anda memuat ulang (refresh) halaman.
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">3. Penggunaan Model AI</h2>
            <p>
              Gambar yang diunggah akan dievaluasi oleh sistem OpenAI CLIP untuk penyaringan konten (Zero-shot Image Classification) dan kemudian dikirimkan ke model U-Net (Deep Learning) untuk dianalisis pola kerusakannya.
              Tidak ada data pribadi (seperti wajah, lokasi EXIF, atau nama pengguna) yang kami ekstrak dari gambar Anda.
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">4. Analitik & Kinerja</h2>
            <p>
              Aplikasi kami mungkin mencatat data performa dasar seperti waktu pemuatan model (inference time) dan pesan error anonim guna membantu mahasiswa peneliti meningkatkan kualitas aplikasi untuk keperluan tugas akhir dan skripsi.
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">5. Perubahan Kebijakan</h2>
            <p>
              Kebijakan ini dibuat secara khusus untuk kebutuhan riset akademik mata kuliah Pengolahan Citra Digital (Universitas Maritim Raja Ali Haji). Kami berhak mengubah kebijakan privasi sewaktu-waktu sesuai dengan evolusi perangkat lunak ini.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
