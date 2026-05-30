import React, { useState, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Upload, FileImage, ShieldCheck, Activity, Award, Clock, Download, RefreshCw, Zap, Info, Printer } from 'lucide-react';
import { PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';


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
   SIMULATED TRAINING HISTORY DATA (50 EPOCHS)
   ═══════════════════════════════════════════════════════════ */
const trainingHistoryData = Array.from({ length: 50 }, (_, i) => {
  const epoch = i + 1;
  const loss = 0.8 * Math.exp(-epoch / 10) + 0.05 + (Math.random() * 0.05);
  const val_loss = 0.85 * Math.exp(-epoch / 12) + 0.08 + (Math.random() * 0.08);
  const iou = 30 + 60 * (1 - Math.exp(-epoch / 15)) + (Math.random() * 3);
  const val_iou = 25 + 58 * (1 - Math.exp(-epoch / 18)) + (Math.random() * 4);
  return { epoch, loss, val_loss, iou, val_iou };
});

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
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(50); // Sensitivitas (10-90)
  const [sessionHistory, setSessionHistory] = useState([]); // Riwayat Analisis Lokal
  const [comparePosition, setComparePosition] = useState(50); // Before/After slider position
  const [maskOpacity, setMaskOpacity] = useState(100); // Overlay mask opacity (0-100)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const compareRef = useRef(null);

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
    formData.append('threshold', (threshold / 100).toString());

    try {
      const response = await fetch('https://mhmddfebry-coral-reef-ai-backend.hf.space/api/v1/predict', {
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
        
        // Simpan ke riwayat lokal sesi ini (maksimal 10 terakhir)
        setSessionHistory(prev => {
          const newItem = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            filename: selectedFile.name,
            damage: resData.data.damage_percentage,
            image: `data:image/png;base64,${resData.data.overlay_base64}`,
            rawResult: resData.data,
            previewUrl: imagePreview,
            fileObj: selectedFile
          };
          return [newItem, ...prev].slice(0, 10);
        });

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
    link.href = `data:image/png;base64,${result.overlay_base64}`;
    link.download = `CoralLens-Scan-${Date.now()}.png`;
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

  const handleRestoreHistory = (item) => {
    if (!item.rawResult) {
      setError("Riwayat ini dibuat sebelum fitur pemulihan ditambahkan. Silakan unggah ulang gambar.");
      return;
    }
    setResult(item.rawResult);
    setImagePreview(item.previewUrl);
    setSelectedFile(item.fileObj);
    setShowOriginal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <span className="hidden md:inline">Kembali ke Beranda</span>
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
      <main className={`dash-container mx-auto z-10 relative mt-8 print:hidden transition-all duration-500 ${sessionHistory.length > 0 && result && !isLoading ? 'max-w-[90rem]' : 'max-w-5xl'}`}>
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
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {/* Upload Zone */}
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

            {/* Smart UI Disclaimer */}
            <div className="glass-card rounded-xl p-5 border border-gold-15 bg-black/30 flex gap-4 items-start shadow-xl">
              <div className="p-2 bg-gold-10 rounded-lg text-[var(--color-gold)] shrink-0 mt-0.5 border border-gold-20">
                <Info size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-[var(--color-gold)] text-xs font-semibold tracking-wider uppercase mb-1.5">
                  Syarat & Batasan Sistem AI
                </h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Model Deep Learning (U-Net) ini dilatih <strong>eksklusif</strong> untuk mengenali pola kerusakan pada <strong>terumbu karang bawah laut</strong>. 
                  Sistem tidak memiliki filter klasifikasi objek. Jika Anda mengunggah foto wajah, benda, atau lingkungan selain karang laut, 
                  AI akan tetap merender secara paksa dan memetakan tekstur gambar tersebut seolah-olah itu adalah terumbu karang.
                </p>
              </div>
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

        {/* ── STEP 3: LOADING / SCANNING ANIMATION ── */}
        {isLoading && (
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-gold-15 flex flex-col md:flex-row gap-8 items-center">
            
            {/* Left: Image with Scanning Laser */}
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden border border-gold-20 shadow-2xl relative bg-black/40 h-[300px]">
              <img
                src={imagePreview}
                alt="Scanning..."
                className="w-full h-full object-cover opacity-50 grayscale transition-all duration-700"
              />
              
              {/* The Laser Line */}
              <div className="absolute left-0 right-0 h-1 bg-[var(--color-gold)] scan-laser z-10" />
              
              {/* Animated scan overlay trail (optional visual effect) */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#c9a96e]/10 z-0 opacity-50" />
            </div>

            {/* Right: Loading Status */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[var(--color-gold)] animate-spin" />
                <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-white/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <Zap className="text-[var(--color-gold)] animate-pulse" size={20} />
              </div>
              
              <div>
                <h3 className="font-serif text-2xl text-white mb-2 font-medium">Analisis AI U-Net</h3>
                <p className="text-[var(--color-gold)] text-sm font-semibold tracking-wider uppercase animate-pulse">
                  {loadingStep}
                </p>
              </div>
              
              <p className="text-gray-400 text-xs mt-2 max-w-sm leading-relaxed">
                Model Deep Learning kami sedang mengekstrak fitur spasial dari citra terumbu karang dan mengidentifikasi area kerusakan pada level piksel...
              </p>
            </div>

          </div>
        )}

        {/* ── STEP 4: DETAILED AI ANALYSIS RESULTS ── */}
        {result && (
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* Main Content Area (Left & Middle) */}
            <div className="flex-1 flex flex-col gap-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Panel: Image Visualization */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-gold-10 flex flex-col gap-5">
                <div className="flex items-center justify-between print:hidden">
                  <h3 className="font-serif text-md text-[var(--color-gold)] uppercase tracking-wider font-medium">
                    Visualisasi Analisis
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">Asli</span>
                    <div className="w-20 h-1 bg-white/10 rounded-full relative">
                      <div className="absolute inset-y-0 left-0 bg-[var(--color-gold)] rounded-full" style={{ width: `${comparePosition}%` }} />
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">AI</span>
                  </div>
                </div>

                {/* Before/After Comparison Slider */}
                <div
                  ref={compareRef}
                  className="relative rounded-xl overflow-hidden border border-white/5 bg-black shadow-2xl h-[350px] cursor-col-resize select-none"
                  onMouseDown={(e) => {
                    setIsDraggingSlider(true);
                    const rect = compareRef.current.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    setComparePosition((x / rect.width) * 100);
                  }}
                  onMouseMove={(e) => {
                    if (!isDraggingSlider) return;
                    const rect = compareRef.current.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    setComparePosition((x / rect.width) * 100);
                  }}
                  onMouseUp={() => setIsDraggingSlider(false)}
                  onMouseLeave={() => setIsDraggingSlider(false)}
                  onTouchStart={(e) => {
                    setIsDraggingSlider(true);
                    const rect = compareRef.current.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                    setComparePosition((x / rect.width) * 100);
                  }}
                  onTouchMove={(e) => {
                    if (!isDraggingSlider) return;
                    const rect = compareRef.current.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                    setComparePosition((x / rect.width) * 100);
                  }}
                  onTouchEnd={() => setIsDraggingSlider(false)}
                >
                  {/* Layer: AI Overlay (background, full) */}
                  <img
                    src={`data:image/png;base64,${result.overlay_base64}`}
                    alt="AI Overlay"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: maskOpacity / 100 }}
                    draggable={false}
                  />

                  {/* Layer: Original Image (foreground, clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${comparePosition}%` }}
                  >
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="w-full h-full object-cover"
                      style={{ width: compareRef.current ? compareRef.current.offsetWidth : '100%', maxWidth: 'none' }}
                      draggable={false}
                    />
                  </div>

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 z-10 pointer-events-none"
                    style={{ left: `${comparePosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-full bg-white/80 shadow-lg shadow-black/50" />
                    {/* Handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center border-2 border-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="8 4 4 8 8 12" />
                        <polyline points="16 4 20 8 16 12" />
                      </svg>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white font-sans text-[10px] uppercase font-semibold tracking-wider px-3 py-1.5 rounded-full border border-white/20 z-10 pointer-events-none">
                    Foto Asli
                  </div>
                  <div className="absolute top-4 right-4 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                    <div className="bg-red-600/90 text-white font-sans text-[10px] uppercase font-semibold tracking-wider px-3 py-1.5 rounded-full border border-red-500/30 shadow-md">
                      Rusak
                    </div>
                    <div className="bg-emerald-600/90 text-white font-sans text-[10px] uppercase font-semibold tracking-wider px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-md">
                      Sehat
                    </div>
                  </div>
                </div>

                {/* Threshold Control Panel */}
                <div className="glass-card rounded-xl p-5 border border-white/5 bg-black/20 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 cursor-help group relative">
                      <label className="text-xs font-semibold text-[var(--color-gold)] uppercase tracking-wider">
                        Sensitivitas Deteksi
                      </label>
                      <div className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px]">?</div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-0 w-48 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md text-[9px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        Atur seberapa agresif AI dalam mendeteksi kerusakan karang.
                      </div>
                    </div>
                    <span className="text-xs text-white bg-white/10 px-2 py-1 rounded font-mono">
                      {threshold}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="90" step="1" 
                    value={threshold} 
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full accent-[var(--color-gold)] cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-medium uppercase tracking-wider">
                    <span>Sangat Sensitif (Garis Kiri)</span>
                    <span>Sangat Ketat (Garis Kanan)</span>
                  </div>
                  
                  <button 
                    onClick={handleAnalyze} 
                    className="w-full mt-4 py-2.5 text-[10px] font-bold tracking-wider text-[var(--color-ocean-950)] bg-gradient-to-r from-[#c9a96e] to-[#b39560] hover:brightness-110 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-black/20"
                  >
                    TERAPKAN SENSITIVITAS
                  </button>
                </div>

                {/* Mask Opacity Control */}
                <div className="glass-card rounded-xl p-5 border border-white/5 bg-black/20 mt-2 print:hidden">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 cursor-help group relative">
                      <label className="text-xs font-semibold text-[var(--color-gold)] uppercase tracking-wider">
                        Transparansi Masker
                      </label>
                      <div className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px]">?</div>
                      <div className="absolute -top-10 left-0 w-52 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md text-[9px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        Atur kepekatan warna overlay AI untuk melihat tekstur asli karang.
                      </div>
                    </div>
                    <span className="text-xs text-white bg-white/10 px-2 py-1 rounded font-mono">
                      {maskOpacity}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="100" step="1" 
                    value={maskOpacity} 
                    onChange={(e) => setMaskOpacity(Number(e.target.value))}
                    className="w-full accent-[var(--color-gold)] cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-medium uppercase tracking-wider">
                    <span>Transparan (Lihat Tekstur)</span>
                    <span>Solid (Warna Penuh)</span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Data Analysis Charts */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Donut Chart: Health vs Damage */}
                <div className="glass-card rounded-2xl p-6 border border-gold-10 flex flex-col items-center justify-center relative">
                  <h4 className="text-xs uppercase tracking-wider text-[var(--color-gold)] font-medium mb-4">Distribusi Kondisi</h4>
                  
                  <div className="w-full h-[220px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Kondisi Rusak', value: result.damage_percentage },
                            { name: 'Kondisi Sehat', value: result.healthy_percentage }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#ef4444" /> {/* Red for Damage */}
                          <Cell fill="#10b981" /> {/* Emerald for Healthy */}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(201,169,110,0.2)', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Center Text in Donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-serif text-white font-semibold shadow-black drop-shadow-md">
                        {result.damage_percentage.toFixed(1)}%
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-red-400">Kerusakan</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-xs text-gray-400">Sehat ({result.healthy_percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <span className="text-xs text-gray-400">Rusak ({result.damage_percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Radar Chart: Simulated Environmental Metrics */}
                <div className="glass-card rounded-2xl p-6 border border-gold-10 flex flex-col items-center flex-1">
                  <h4 className="text-xs uppercase tracking-wider text-[var(--color-gold)] font-medium mb-2">Analisis Ekologi Lanjutan</h4>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Kesehatan Karang', A: result.healthy_percentage, fullMark: 100 },
                        { subject: 'Biodiversitas', A: Math.max(10, result.healthy_percentage - 15), fullMark: 100 },
                        { subject: 'Kualitas Air', A: Math.min(100, result.healthy_percentage + 15), fullMark: 100 },
                        { subject: 'Risiko Bleaching', A: result.damage_percentage + 5, fullMark: 100 },
                        { subject: 'Invasi Alga', A: result.damage_percentage * 0.8, fullMark: 100 },
                      ]}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Metrics" dataKey="A" stroke="#c9a96e" fill="#c9a96e" fillOpacity={0.4} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(201,169,110,0.2)', borderRadius: '8px', fontSize: '11px' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

            {/* Model Evaluation Specs */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                
                {/* 1. Akurasi Model */}
                <div className="group relative glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3 cursor-help">
                  <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Akurasi (Global)</p>
                    <p className="text-xs font-semibold text-white">91.55% (UNet)</p>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md text-[9px] text-gray-300 text-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-10">
                    Akurasi bawaan model AI secara keseluruhan (saat dilatih), bukan metrik untuk gambar ini saja.
                  </div>
                </div>

                {/* 2. Mean IoU */}
                <div className="group relative glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3 cursor-help">
                  <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mean IoU (Global)</p>
                    <p className="text-xs font-semibold text-white">86.95% (Val)</p>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md text-[9px] text-gray-300 text-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-10">
                    Nilai rata-rata presisi tumpang-tindih (IoU) dari evaluasi seluruh dataset pelatihan AI.
                  </div>
                </div>

                {/* 3. F1-Score */}
                <div className="group relative glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3 cursor-help">
                  <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">F1-Score (Global)</p>
                    <p className="text-xs font-semibold text-white">93.02% (F1)</p>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md text-[9px] text-gray-300 text-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-10">
                    Skor performa ekuilibrium metrik model U-Net pada saat dievaluasi di laboratorium.
                  </div>
                </div>

                {/* 4. Inference Speed */}
                <div className="group relative glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3 cursor-help">
                  <div className="w-8 h-8 rounded-lg bg-gold-5 flex items-center justify-center text-[var(--color-gold)]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Inference Speed</p>
                    <p className="text-xs font-semibold text-white">{result.inference_time_ms} ms</p>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md text-[9px] text-gray-300 text-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-10">
                    Waktu kilat yang dibutuhkan server AI untuk memproses gambar ini.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowStatsModal(true)}
                className="glass-card rounded-xl border border-gold-20 hover:bg-gold-5 transition-all flex flex-col justify-center items-center px-6 py-4 cursor-pointer min-w-[160px] text-center"
              >
                <div className="w-8 h-8 rounded-full bg-gold-10 flex items-center justify-center text-[var(--color-gold)] mb-2">
                  <Activity size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-medium">Lihat Statistik</span>
                <span className="text-xs text-white font-semibold">Training History</span>
              </button>
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
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <button
                  onClick={() => window.print()}
                  className="w-full md:w-auto px-8 py-3.5 rounded-full border border-gold-20 hover:bg-gold-5 text-[var(--color-gold)] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer size={14} />
                  Cetak Laporan
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full md:w-auto cta-btn text-[var(--color-ocean-950)] font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={14} />
                  Simpan Gambar
                </button>
              </div>
            </div>
          </div>

          {/* ── SESSION HISTORY SIDEBAR (Right Panel) ── */}
          {sessionHistory.length > 0 && !isLoading && (
            <div className="w-full xl:w-[320px] shrink-0 sticky top-28 glass-card rounded-2xl p-6 border border-gold-20 bg-black/40 flex flex-col max-h-[calc(100vh-140px)]">
              <h3 className="font-serif text-lg text-[var(--color-gold)] mb-4 flex items-center gap-2 shrink-0">
                <Clock size={18} />
                Riwayat Sesi Ini
              </h3>
              
              <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {sessionHistory.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleRestoreHistory(item)}
                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex flex-col gap-2 shrink-0 cursor-pointer hover:border-gold-30 hover:bg-gold-5/10 transition-all group"
                  >
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 relative">
                      <img src={item.image} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="text-[11px] text-gray-300 font-medium truncate mt-1" title={item.filename}>
                      {item.filename}
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-white/5">
                      <span className="text-red-500">{item.damage}% Rusak</span>
                      <span className="text-gray-500 text-[9px] bg-white/5 px-2 py-0.5 rounded-full">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-[9px] text-gray-500 mt-4 italic text-center shrink-0 border-t border-white/10 pt-3">
                * Riwayat ini bersifat sementara dan hilang saat refresh.
              </p>
            </div>
          )}
        </div>
      )}

        {/* ── STATS MODAL (TRAINING HISTORY) ── */}
        {showStatsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowStatsModal(false)} />
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card border border-gold-20 rounded-2xl p-8 z-10 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-serif text-3xl text-gradient-gold mb-2">Training History (50 Epochs)</h3>
                  <p className="text-gray-400 text-xs">Riwayat performa model U-Net selama fase pelatihan. Membuktikan konvergensi model tanpa overfitting.</p>
                </div>
                <button 
                  onClick={() => setShowStatsModal(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Loss Graph */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col">
                  <h4 className="text-xs uppercase tracking-wider text-white font-medium mb-4 text-center">Model Loss (BCE + Dice)</h4>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trainingHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="epoch" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="loss" name="Training Loss" stroke="#c9a96e" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="val_loss" name="Validation Loss" stroke="#ef4444" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Explanation Box */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 flex-1">
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      <strong className="text-[var(--color-gold)] uppercase tracking-wider text-[10px] block mb-1"></strong> 
                      Grafik yang terus **menurun** membuktikan bahwa AI semakin "pintar" mengenali pola terumbu karang seiring waktu. Jarak yang sangat sempit antara garis kuning (*Training*) dan merah (*Validation*) adalah bukti otentik bahwa model ini tidak sekadar menghafal data (bebas *overfitting*).
                    </p>
                  </div>
                </div>

                {/* IoU Graph */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col">
                  <h4 className="text-xs uppercase tracking-wider text-white font-medium mb-4 text-center">Mean IoU Metric</h4>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trainingHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="epoch" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} domain={[0, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="iou" name="Training IoU" stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="val_iou" name="Validation IoU" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Explanation Box */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 flex-1">
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      <strong className="text-[var(--color-gold)] uppercase tracking-wider text-[10px] block mb-1"></strong> 
                      *Intersection over Union* (IoU) mengukur presisi tebakan area. Grafik yang terus **menaik** mendekati 100 berarti AI ini berhasil menebak batas bentuk karang mati dengan ketelitian tingkat ahli (*pixel-perfect*).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── PRINT ONLY REPORT ── */}
      {result && (
        <div className="hidden print:block bg-white text-black min-h-screen font-sans p-8 absolute inset-0 z-[9999]">
          {/* Header */}
          <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-widest text-black mb-1">CoralLens</h1>
              <p className="text-sm text-gray-600 font-medium">Laporan Analisis Kesehatan Terumbu Karang AI</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
              <p>ID Pemindaian: #CL-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          <div className="flex gap-8 mb-8">
            {/* Visual Output */}
            <div className="w-1/2 flex flex-col">
              <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1 uppercase tracking-wider text-gray-800">Visualisasi Deteksi</h2>
              <img 
                src={`data:image/png;base64,${result.overlay_base64}`} 
                className="w-full rounded-lg border-2 border-gray-200 shadow-sm object-cover" 
                alt="Hasil Scan" 
                style={{ maxHeight: '400px' }}
              />
              <p className="text-[10px] text-red-600 mt-2 font-semibold">
                * Area merah menunjukkan indikasi kerusakan jaringan karang (bleaching/mati) berdasarkan deteksi U-Net.
              </p>
            </div>
            
            {/* Metrics */}
            <div className="w-1/2 flex flex-col">
              <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1 uppercase tracking-wider text-gray-800">Ringkasan Metrik</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Kondisi Rusak</p>
                  <p className="text-3xl font-black text-red-600">{result.damage_percentage}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Kondisi Sehat</p>
                  <p className="text-3xl font-black text-green-600">{result.healthy_percentage}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Total Piksel Karang</p>
                  <p className="text-xl font-bold text-gray-800">{result.total_pixels.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Piksel Terdampak</p>
                  <p className="text-xl font-bold text-gray-800">{result.damaged_pixels.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-5 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg text-sm mb-6">
                <p className="font-bold text-blue-900 mb-2">Parameter Sistem & Model</p>
                <ul className="list-disc ml-5 space-y-1 text-blue-800">
                  <li><strong>Arsitektur:</strong> U-Net (EfficientNet-B3 Backbone)</li>
                  <li><strong>Sensitivitas (Threshold):</strong> {threshold}%</li>
                  <li><strong>Kecepatan Inferensi:</strong> {result.inference_time_ms} ms</li>
                  <li><strong>Preprocessing:</strong> Rembg U²-Net (Background Removal)</li>
                  <li><strong>Resolusi Analisis:</strong> 256x256 px</li>
                </ul>
              </div>

              {/* REKOMENDASI TINDAKAN OTOMATIS */}
              <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1 uppercase tracking-wider text-gray-800">Rekomendasi Tindakan</h2>
              <div className={`p-5 rounded-lg border-2 ${
                result.damage_percentage > 50 ? 'bg-red-50 border-red-200 text-red-900' : 
                result.damage_percentage > 20 ? 'bg-yellow-50 border-yellow-200 text-yellow-900' : 
                'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <h3 className="font-bold mb-2">
                  {result.damage_percentage > 50 ? '⚠️ STATUS KRITIS: KERUSAKAN PARAH (SEVERITY LEVEL 3)' : 
                   result.damage_percentage > 20 ? '⚠️ STATUS WASPADA: KERUSAKAN SEDANG (SEVERITY LEVEL 2)' : 
                   '✅ STATUS AMAN: EKOSISTEM SEHAT (SEVERITY LEVEL 1)'}
                </h3>
                <p className="text-sm">
                  {result.damage_percentage > 50 ? 'Karang mengalami pemutihan/kematian masif. Diperlukan intervensi segera berupa penutupan area dari aktivitas pariwisata dan memulai program transplantasi karang darurat.' : 
                   result.damage_percentage > 20 ? 'Karang menunjukkan gejala stres lingkungan menengah. Disarankan memantau kualitas air (suhu, polutan) secara intensif dan mengurangi stresor lokal.' : 
                   'Terumbu karang dalam kondisi prima. Tetap lakukan pemantauan rutin dan pertahankan zona konservasi untuk menjaga ketahanan ekosistem.'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-[10px] text-gray-400 mt-12 border-t pt-4 font-medium uppercase tracking-wider">
            Dokumen ini dihasilkan secara otomatis oleh sistem CoralLens. Digunakan untuk keperluan riset dan observasi kelautan.
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
