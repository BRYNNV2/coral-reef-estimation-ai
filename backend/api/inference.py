"""
FastAPI Inference Endpoint untuk Coral Reef Segmentation
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import time

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config import BEST_MODEL_PATH, IMG_SIZE, MEAN, STD, ENCODER_NAME, NUM_CLASSES
from model.unet import CoralSegmentationModel
from utils.preprocessing import (
    validate_image_file,
    preprocess_image,
    create_overlay,
    mask_to_base64,
    overlay_to_base64,
)

router = APIRouter(prefix="/api/v1", tags=["inference"])


# ── Response Schema ────────────────────────────────────────
class InferenceResponse(BaseModel):
    """Schema response JSON untuk hasil inference."""
    success: bool
    message: str
    data: Optional[dict] = None


# ── Load Model (singleton) ────────────────────────────────
_model: Optional[CoralSegmentationModel] = None


def get_model() -> CoralSegmentationModel:
    """
    Lazy-load model sebagai singleton.
    Model hanya di-load sekali saat pertama kali dipanggil.
    """
    global _model
    if _model is None:
        _model = CoralSegmentationModel(
            encoder_name=ENCODER_NAME,
            num_classes=NUM_CLASSES,
            encoder_weights=None,  # Kita load dari file, bukan pretrained
        )
        _model.load_weights(BEST_MODEL_PATH)
    return _model


# ── Endpoints ──────────────────────────────────────────────
@router.post("/predict", response_model=InferenceResponse)
async def predict_coral_damage(file: UploadFile = File(...)):
    """
    Endpoint utama untuk prediksi kerusakan terumbu karang.

    Flow:
    1. Validasi format file (JPG/PNG)
    2. Preprocessing (resize, normalize, tensor)
    3. Inference model U-Net
    4. Hitung persentase kerusakan (pixel-ratio)
    5. Buat overlay visualisasi
    6. Return JSON dengan statistik + gambar base64

    Request:
        POST /api/v1/predict
        Content-Type: multipart/form-data
        Body: file (image)

    Response:
        {
            "success": true,
            "message": "Inference berhasil",
            "data": {
                "damage_percentage": 23.45,
                "healthy_percentage": 76.55,
                "total_pixels": 65536,
                "damaged_pixels": 15370,
                "inference_time_ms": 142.5,
                "mask_base64": "...",
                "overlay_base64": "..."
            }
        }
    """
    # ── 1. Validasi File ───────────────────────────────────
    if not validate_image_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": f"Format file tidak didukung: {file.filename}. "
                           f"Gunakan: JPG, PNG, BMP, TIFF, atau WebP.",
            }
        )

    # ── 2. Baca & Preprocessing ────────────────────────────
    try:
        image_bytes = await file.read()
        tensor, original_image = preprocess_image(
            image_bytes, img_size=IMG_SIZE, mean=MEAN, std=STD
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": f"Gagal memproses gambar: {str(e)}"}
        )

    # ── 3. Inference ───────────────────────────────────────
    try:
        model = get_model()
        start_time = time.time()
        result = model.predict_with_stats(tensor)
        inference_ms = round((time.time() - start_time) * 1000, 2)
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail={
                "success": False,
                "message": "Model belum dilatih. Jalankan train.py terlebih dahulu.",
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "message": f"Inference error: {str(e)}"}
        )

    # ── 4. Buat Overlay Visualisasi ────────────────────────
    overlay = create_overlay(original_image, result["mask"])

    # ── 5. Return Response ─────────────────────────────────
    return InferenceResponse(
        success=True,
        message="Inference berhasil",
        data={
            "damage_percentage": result["damage_percentage"],
            "healthy_percentage": result["healthy_percentage"],
            "total_pixels": result["total_pixels"],
            "damaged_pixels": result["damaged_pixels"],
            "inference_time_ms": inference_ms,
            "mask_base64": mask_to_base64(result["mask"]),
            "overlay_base64": overlay_to_base64(overlay),
        }
    )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    model_exists = BEST_MODEL_PATH.exists()
    return {
        "status": "healthy",
        "model_loaded": _model is not None,
        "model_file_exists": model_exists,
        "model_path": str(BEST_MODEL_PATH),
    }
