import React, { useEffect } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const TermsOfServicePage = ({ onBack }) => {
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
          <FileText size={20} className="text-[var(--color-gold)]" />
          <span className="font-serif text-sm tracking-widest text-gradient-gold uppercase">
            Terms of Service
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto mt-12 fade-up">
        <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-gold)] mb-8 font-medium">Syarat dan Ketentuan</h1>
        
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/5 space-y-8 text-gray-300 leading-relaxed font-sans text-sm md:text-base">
          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">1. Tujuan Penggunaan</h2>
            <p>
              Aplikasi web CoralLens dirancang khusus untuk memenuhi tugas mata kuliah Pengolahan Citra Digital di program studi Teknik Informatika, Universitas Maritim Raja Ali Haji (UMRAH). 
              Aplikasi ini berfokus pada eksperimentasi model segmentasi U-Net dalam konteks pemantauan kondisi fisik terumbu karang. Aplikasi ini tidak diperuntukkan untuk operasional komersial tingkat enterprise.
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">2. Akurasi Hasil AI</h2>
            <p>
              Hasil analisis tingkat kerusakan (persentase) yang diberikan oleh aplikasi merupakan <strong>estimasi otomatis berbasis piksel</strong> dari model Deep Learning U-Net (dengan backbone EfficientNet-B3).
              Hasil tersebut tidak bisa dijadikan patokan mutlak secara saintifik tanpa verifikasi dari ahli biologi kelautan atau observasi manual lapangan. Pengembang tidak bertanggung jawab atas kerugian atau misinterpretasi akibat penggunaan hasil AI ini dalam pengambilan keputusan nyata.
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">3. Batasan Unggahan Data</h2>
            <p>
              Pengguna hanya diperkenankan mengunggah foto/citra yang berhubungan dengan bawah laut dan terumbu karang. Aplikasi telah dilengkapi dengan sistem <em>Satpam AI (CLIP)</em> yang secara otomatis menolak gambar yang tidak relevan (seperti benda mati, wajah, atau pemandangan darat). Tindakan penyalahgunaan dengan terus mencoba mem-bypass sistem dapat menyebabkan IP pengguna dibatasi oleh server (Hugging Face / Vercel).
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">4. Ketersediaan Layanan (Uptime)</h2>
            <p>
              Aplikasi frontend dan backend dihosting melalui layanan pihak ketiga seperti Vercel dan Hugging Face Spaces. Kami tidak menjamin layanan ini akan tersedia 24/7 tanpa henti. Backend Hugging Face mungkin membutuhkan waktu *cold-start* (tidur lalu bangun) jika tidak diakses dalam jangka waktu tertentu, yang berakibat pada keterlambatan loading awal.
            </p>
          </section>

          <section className="fade-up">
            <h2 className="text-xl font-serif text-white mb-4">5. Hak Cipta & Lisensi</h2>
            <p>
              Seluruh source code aplikasi ini bersifat terbuka (Open Source) dalam ruang lingkup akademis dan dapat dilihat melalui GitHub Repository BRYNNV2. Segala bentuk modifikasi atau plagiasi komersial tanpa persetujuan kreator asli akan melanggar etika akademis dan lisensi Hak Kekayaan Intelektual (HAKI) terkait.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
