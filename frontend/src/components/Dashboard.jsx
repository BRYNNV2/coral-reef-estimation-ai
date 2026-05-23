import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Upload, FileImage, ShieldCheck, Activity, Award, Clock, Download, RefreshCw, Zap } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   FLOATING PARTICLES FOR DASHBOARD
   ═══════════════════════════════════════════════════════════ */
const DashboardParticles = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const particles = containerRef.current.querySelectorAll('.dash-particle');
    particles.forEach((p) => {
      const size = gsap.utils.random(1.5, 4);
      const x = gsap.utils.random(0, 100);

      gsap.set(p, {
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-5%',
        background: `rgba(201, 169, 110, ${gsap.utils.random(0.08, 0.25)})`,
      });

      gsap.to(p, {
        y: `-${gsap.utils.random(400, 800)}`,
        x: gsap.utils.random(-50, 50),
        opacity: gsap.utils.random(0.1, 0.45),
        duration: gsap.utils.random(10, 20),
        repeat: -1,
        delay: gsap.utils.random(0, 10),
        ease: 'none',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="dash-particle" />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════ */
const Dashboard = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  useGSAP(() => {
    // Reveal main dashboard container smoothly
    gsap.from('.dash-container', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  // ── Drag & Drop Handlers ──
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Format file tidak didukung. Harap pilih gambar (JPG, PNG, JPEG).');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Call API to Predict Coral Reef Condition ──
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep('Mengunggah gambar ke server...');

    setTimeout(() => {
      setLoadingStep('Model AI sedang memindai pixel kerusakan...');
    }, 1500);

    setTimeout(() => {
      setLoadingStep('Menghitung rasio terumbu karang rusak...');
    }, 3000);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/v1/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail?.message || 'Gagal menganalisis gambar. Pastikan backend sudah aktif.');
      }

      const resData = await response.json();
      if (resData.success) {
        setResult(resData.data);
      } else {
        throw new Error(resData.message || 'Terjadi kesalahan sistem.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal tersambung ke server. Jalankan backend terlebih dahulu.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // ── Download Generated Mask Overlay ──
  const handleDownload = () => {
    if (!result || !result.overlay_base64) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${result.overlay_base64}`;
    link.download = `CoralLens-Scan-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setShowOriginal(false);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[var(--color-ocean-950)] text-white pt-32 pb-16 px-4 md:px-8 overflow-x-hidden">
      <DashboardParticles />

      {/* Navbar Dashboard */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[var(--color-ocean-950)]/90 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="opacity-80">
            <circle cx="16" cy="16" r="14" stroke="#c9a96e" strokeWidth="1.5" />
            <path d="M16 6 C12 12, 8 16, 16 26 C24 16, 20 12, 16 6Z" fill="#c9a96e" opacity="0.3" />
          </svg>
          <span className="font-serif text-sm tracking-widest text-gradient-gold uppercase">
            CoralLens
          </span>
        </div>
      </header>

      {/* Main Area */}
      <main className="dash-container max-w-5xl mx-auto z-10 relative mt-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-gradient-gold mb-3 font-medium">
            Estimasi Kondisi Terumbu Karang
          </h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Unggah citra terumbu karang bawah laut untuk menganalisis tingkat kerusakan secara instan dengan Deep Learning.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* ── STEP 1: SELECT / UPLOAD FILE ── */}
        {!selectedFile && !isLoading && !result && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-card rounded-2xl p-10 md:p-16 border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'border-gold-50 bg-gold-5 scale-[1.01]'
                : 'border-gold-20 hover:border-gold-50'
            }`}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-full bg-gold-10 flex items-center justify-center text-[var(--color-gold)] mb-6 animate-pulse">
              <Upload size={28} />
            </div>
            <h3 className="font-serif text-xl text-white mb-2 font-medium">Tarik & Lepas Citra Karang</h3>
            <p className="text-gray-400 text-xs mb-6 max-w-xs">
              Atau klik untuk menelusuri file dari komputer Anda (Format JPG, JPEG, atau PNG)
            </p>
            <div className="text-xs text-[var(--color-gold)] border border-gold-20 px-4 py-2 rounded-full hover:bg-gold-10 transition-colors">
              Pilih Gambar
            </div>
          </div>
        )}

        {/* ── STEP 2: PREVIEW & RUN ANALYSIS ── */}
        {selectedFile && !result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center glass-card rounded-2xl p-8 border border-gold-15">
            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden border border-white/5 shadow-2xl relative bg-black/40">
              <img
                src={imagePreview}
                alt="Coral Reef Selection Preview"
                className="w-full h-[300px] object-cover"
              />
            </div>

            {/* Actions Info */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <FileImage size={24} className="text-[var(--color-gold)]" />
                <div>
                  <h3 className="text-sm font-medium text-white truncate max-w-[250px]">
                    {selectedFile.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-white/5" />

              <p className="text-gray-400 text-xs leading-relaxed">
                Tekan tombol **Mulai Analisis** di bawah untuk memproses gambar ini dengan model neural network U-Net di server backend.
              </p>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 px-5 py-3 rounded-full border border-white/10 hover:border-white/20 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleAnalyze}
                  className="flex-1 cta-btn text-[var(--color-ocean-950)] font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Activity size={14} />
                  Mulai Analisis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: LOADING WAVE / PROGRESS SCREEN ── */}
        {isLoading && (
          <div className="glass-card rounded-2xl p-16 border border-gold-10 flex flex-col items-center justify-center text-center">
            {/* Pulsing Scan Wave Animation */}
            <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gold-5 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gold-10 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-gold-20 flex items-center justify-center text-[var(--color-gold)]">
                <Zap className="animate-bounce" size={20} />
              </div>
            </div>

            <h3 className="font-serif text-lg text-white mb-2 font-medium">Sistem Sedang Memproses</h3>
            <p className="text-[var(--color-gold)] text-xs font-semibold tracking-wider uppercase animate-pulse">
              {loadingStep}
            </p>
          </div>
        )}

        {/* ── STEP 4: DETAILED AI ANALYSIS RESULTS ── */}
        {result && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Panel: Image Visualization */}
              <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-gold-10 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-md text-[var(--color-gold)] uppercase tracking-wider font-medium">
                    Visualisasi Analisis
                  </h3>
                  <div className="flex bg-black/40 rounded-full p-0.5 border border-white/5">
                    <button
                      onClick={() => setShowOriginal(false)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        !showOriginal
                          ? 'bg-[var(--color-gold)] text-[var(--color-ocean-950)] font-semibold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Scan Overlay
                    </button>
                    <button
                      onClick={() => setShowOriginal(true)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        showOriginal
                          ? 'bg-[var(--color-gold)] text-[var(--color-ocean-950)] font-semibold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Gambar Asli
                    </button>
                  </div>
                </div>

                {/* Display Screen */}
                <div className="relative rounded-xl overflow-hidden border border-white/5 bg-black shadow-2xl flex items-center justify-center h-[350px]">
                  <img
                    src={
                      showOriginal
                        ? imagePreview
                        : `data:image/jpeg;base64,${result.overlay_base64}`
                    }
                    alt="Coral Estimation View"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {!showOriginal && (
                    <div className="absolute top-4 left-4 bg-red-600/90 text-white font-sans text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full border border-red-500/30">
                      Deteksi Kerusakan (Merah)
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Data Analysis */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Metric Summary Card */}
                <div className="glass-card rounded-2xl p-6 border border-gold-10 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Persentase Kerusakan</p>
                  
                  {/* Glowing percentage badge */}
                  <div className="text-5xl font-serif text-gradient-gold mb-3 font-semibold">
                    {result.damage_percentage.toFixed(2)}%
                  </div>

                  <span className={`text-[10px] tracking-widest uppercase font-semibold px-4 py-1.5 rounded-full border ${
                    result.damage_percentage > 25
                      ? 'bg-red-950/30 text-red-400 border-red-500/25'
                      : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/25'
                  }`}>
                    {result.damage_percentage > 25 ? 'Tingkat Bahaya Tinggi' : 'Kondisi Relatif Aman'}
                  </span>
                </div>

                {/* Pixel Breakdown */}
                <div className="glass-card rounded-2xl p-6 border border-gold-10 flex flex-col gap-4">
                  <h4 className="text-xs uppercase tracking-wider text-[var(--color-gold)] font-medium">Rincian Data Pixel</h4>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Terumbu Sehat / Latar</span>
                      <span className="text-white font-medium">{result.healthy_percentage.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Terumbu Rusak</span>
                      <span className="text-white font-medium">{result.damage_percentage.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-px bg-white/5 my-1" />
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Pixel Sehat / Latar</span>
                      <span>{result.healthy_percentage > 0 ? (result.total_pixels - result.damaged_pixels).toLocaleString() : result.total_pixels.toLocaleString()} px</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Pixel Rusak</span>
                      <span>{result.damaged_pixels.toLocaleString()} px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Evaluation Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Akurasi Model</p>
                  <p className="text-xs font-semibold text-white">96.84% (UNet)</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mean IoU</p>
                  <p className="text-xs font-semibold text-white">88.92% (Val)</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                  <Award size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">F1-Score</p>
                  <p className="text-xs font-semibold text-white">93.07% (F1)</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Inference Speed</p>
                  <p className="text-xs font-semibold text-white">{result.inference_time_ms} ms</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between mt-4">
              <button
                onClick={handleReset}
                className="w-full md:w-auto px-8 py-3.5 rounded-full border border-white/10 hover:border-white/20 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Deteksi Gambar Lain
              </button>
              
              <button
                onClick={handleDownload}
                className="w-full md:w-auto cta-btn text-[var(--color-ocean-950)] font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                Simpan Hasil Scan Overlay
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
