Project Documentation: Coral Reef Condition Estimation System
1. Core Architecture & Workflow
System Type: Web-based Application for semantic image segmentation.

Processing Pipeline:

Input Handling: Image ingestion from user upload (JPG/PNG) with automatic resizing/preprocessing pipeline.

Inference Engine: PyTorch-based U-Net model using EfficientNet as a feature extractor (backbone) to maximize segmentation accuracy.

Output Logic: Pixel-wise classification into binary masks (Healthy/Damaged).

Analytical Module: Calculation of pixel-ratio to determine the percentage of damaged area versus total coral area.

Visualization: Post-processing module that overlays the binary mask onto the original image (overlay/heatmap) to visualize detected damaged zones for the user.

2. Technical Requirements
Backend API (FastAPI):

Endpoint for model inference.

Middleware for image preprocessing (normalization, tensor conversion).

Exception handling for invalid file formats.

Frontend (React.js):

State management for uploaded images and inference results.

Dashboard for displaying statistical reports (percentage breakdown) and graphical visualizations.

Model Specifications:

Framework: PyTorch.

Optimization: Fine-tuning of EfficientNet hyperparameters to balance speed and segmentation precision.

Evaluation Metrics: Accuracy, Precision, Recall, and F1-Score.

3. Data Processing Strategy
Augmentation: Implementation of geometric and photometric augmentation to ensure model robustness against underwater image noise (e.g., blur, light scattering).

Data Structure: Handling segmented mask files (polygons) from Roboflow to train the pixel-level classification model.

4. Expected System Output
Quantitative: Percentage of damaged coral coverage.

Visual: Original image with segmentation mask overlay indicating damaged areas.

## 5. Eksperimen, Optimasi & Batasan Sistem (Evaluasi AI)

### A. Optimasi Dataset & Retraining Model (U-Net)
Pada iterasi awal, model gagal membedakan karang sehat dan rusak karena kesalahan pelabelan dataset (seluruh bentuk karang di-anotasi). Kami melakukan *retraining* (pelatihan ulang) dengan pendekatan **Instance/Semantic Segmentation format COCO** di mana label/poligon **hanya** difokuskan pada area jaringan karang yang memutih (bleaching).
Hasilnya, performa model U-Net (EfficientNet-B3 backbone) melonjak drastis dengan metrik evaluasi akhir:
- **Accuracy:** 91.55%
- **F1-Score:** 93.02%
- **Mean IoU:** 86.95%

### B. Analisis Parameter Threshold (Sigmoid Probability)
Sistem dilengkapi dengan fitur *Threshold Control* (sensitivitas 10-90%). Secara matematis, prediksi mask piksel oleh U-Net menggunakan aktivasi Sigmoid.
- **Threshold 100%:** AI bertindak sangat ketat (*perfeksionis*), hanya meloloskan piksel yang sangat pucat. Hal ini membuat persentase kerusakan turun drastis (~1%).
- **Threshold 0%:** AI meloloskan semua kecurigaan piksel, membuat prediksi kerusakan menjadi 100%.
- **Sweet Spot:** Sistem menggunakan angka default `0.5` (50%) untuk mencapai ekuilibrium (F1-Score tertinggi).

### C. Batasan Sistem (*System Limitations*)
Dalam evaluasi riil, ditemukan dua batasan arsitektur *Dual-AI* yang penting untuk dicatat:
1. **Kegagalan Background Removal (Rembg) pada Citra Cluttered:** 
   Algoritma deteksi salience (`rembg`) terkadang kebingungan jika dihadapkan pada latar belakang laut yang sangat ramai (banyak ikan, bayangan, atau susunan karang lain di belakang). `rembg` dapat secara keliru menghapus bagian utama karang karena mengiranya sebagai *background*.
   *Saran Penggunaan:* Input gambar paling optimal adalah foto jarak dekat (*close-up/macro*) dari satu bongkahan karang tunggal dengan latar belakang laut biru.
2. **Out of Distribution (OOD) pada Pencahayaan Akuarium:**
   Saat diuji dengan foto *soft coral* (Zoanthids) di dalam akuarium yang disorot lampu *Actinic Blue/Purple* (ungu neon), model mengalami bias dan menebak area ungu cerah sebagai kerusakan 70%+. Ini terjadi karena dataset pelatihan 100% berasal dari laut lepas dengan sinar matahari alami (Domain Cahaya). Model belum mengenali spektrum warna buatan akuarium.