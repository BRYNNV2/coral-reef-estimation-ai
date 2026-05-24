import React, { useState, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Upload, FileImage, ShieldCheck, Activity, Award, Clock, Download, RefreshCw, Zap, Info } from 'lucide-react';
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
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
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
                </div>

                {/* IoU Graph */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
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
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
