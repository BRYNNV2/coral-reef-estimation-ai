"""
Preprocessing Utilities untuk Inference API
"""

import io
from pathlib import Path
from typing import Tuple

import cv2
import numpy as np
import torch
from PIL import Image
import base64

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}


def validate_image_file(filename: str) -> bool:
    """Validasi format gambar yang didukung."""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def preprocess_image(
    image_bytes: bytes,
    img_size: int = 256,
    mean: list = [0.485, 0.456, 0.406],
    std: list = [0.229, 0.224, 0.225],
) -> Tuple[torch.Tensor, np.ndarray]:
    """
    Konversi bytes upload → tensor siap inference.
    Returns: (tensor [3,H,W], original_image numpy RGB)
    """
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    original = np.array(pil_image)

    resized = cv2.resize(original, (img_size, img_size))
    normalized = resized.astype(np.float32) / 255.0
    for c in range(3):
        normalized[:, :, c] = (normalized[:, :, c] - mean[c]) / std[c]

    tensor = torch.from_numpy(normalized).permute(2, 0, 1).float()
    return tensor, original


def create_overlay(
    original_image: np.ndarray,
    mask: np.ndarray,
    alpha: float = 0.4,
    damage_color: Tuple[int, int, int] = (255, 50, 50),
    healthy_color: Tuple[int, int, int] = (50, 220, 50),
) -> np.ndarray:
    """Overlay binary mask pada gambar original (area rusak = merah, area sehat = hijau)."""
    h, w = original_image.shape[:2]
    mask_resized = cv2.resize(
        mask.astype(np.float32), (w, h), interpolation=cv2.INTER_NEAREST
    )
    overlay = original_image.copy()
    damage_mask = mask_resized > 0.5
    
    # Deteksi area karang keseluruhan dari alpha channel (jika RGBA)
    if original_image.shape[-1] == 4:
        coral_mask = original_image[..., 3] > 0
    else:
        coral_mask = np.ones((h, w), dtype=bool)
        
    healthy_mask = coral_mask & ~damage_mask

    # Adapt colors if original image is RGBA
    if overlay.shape[-1] == 4:
        if len(damage_color) == 3:
            damage_color = tuple(list(damage_color) + [255])
        if len(healthy_color) == 3:
            healthy_color = tuple(list(healthy_color) + [255])
        
    # Warna Merah untuk area rusak
    overlay[damage_mask] = (
        (1 - alpha) * overlay[damage_mask]
        + alpha * np.array(damage_color, dtype=np.float32)
    ).astype(np.uint8)
    
    # Warna Hijau untuk area sehat
    overlay[healthy_mask] = (
        (1 - alpha) * overlay[healthy_mask]
        + alpha * np.array(healthy_color, dtype=np.float32)
    ).astype(np.uint8)
    
    return overlay


def mask_to_base64(mask: np.ndarray) -> str:
    """Konversi binary mask → base64 PNG string."""
    mask_uint8 = (mask * 255).astype(np.uint8)
    pil_mask = Image.fromarray(mask_uint8, mode="L")
    buffer = io.BytesIO()
    pil_mask.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def overlay_to_base64(overlay: np.ndarray) -> str:
    """Konversi overlay RGB/RGBA image → base64 PNG string."""
    pil_image = Image.fromarray(overlay)
    buffer = io.BytesIO()
    pil_image.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")
