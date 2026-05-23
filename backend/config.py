"""
=============================================================
Global Configuration for Coral Reef Condition Estimation System
=============================================================
Menyimpan semua konfigurasi terpusat: path, hyperparameter,
dan parameter preprocessing agar mudah diubah tanpa
menyentuh kode logika.
"""

from pathlib import Path

# ── Direktori Utama ──────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"
MODEL_DIR = BASE_DIR / "model" / "weights"
UPLOAD_DIR = BASE_DIR / "uploads"

# Buat folder otomatis jika belum ada
for _dir in [DATASET_DIR, MODEL_DIR, UPLOAD_DIR]:
    _dir.mkdir(parents=True, exist_ok=True)

# ── Model & Training Hyperparameters ────────────────────────
IMG_SIZE = 256                 # Ukuran input (256×256 piksel)
NUM_CLASSES = 1                # Binary segmentation (Healthy vs Damaged)
BATCH_SIZE = 8
LEARNING_RATE = 1e-4
NUM_EPOCHS = 5
ENCODER_NAME = "efficientnet-b3"  # Backbone EfficientNet
ENCODER_WEIGHTS = "imagenet"       # Pre-trained weights

# ── Preprocessing / Normalization ───────────────────────────
# ImageNet mean & std untuk normalisasi (karena backbone pretrained pada ImageNet)
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]

# ── Path Model Weights ──────────────────────────────────────
BEST_MODEL_PATH = MODEL_DIR / "best_unet_efficientnet.pth"

# ── Roboflow Configuration ──────────────────────────────────
# Ganti dengan kredensial Roboflow Anda
ROBOFLOW_API_KEY = "YOUR_ROBOFLOW_API_KEY"
ROBOFLOW_WORKSPACE = "your-workspace"
ROBOFLOW_PROJECT = "coral-reef-segmentation"
ROBOFLOW_VERSION = 1
