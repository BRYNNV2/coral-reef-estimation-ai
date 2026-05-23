"""
=============================================================
U-Net Model dengan EfficientNet Backbone
=============================================================
Modul ini mendefinisikan arsitektur U-Net menggunakan library
`segmentation-models-pytorch` (SMP) dengan backbone EfficientNet.

ARSITEKTUR:
┌────────────────────────────────────────────────┐
│                  U-Net                         │
│                                                │
│  Encoder: EfficientNet-B3 (pretrained ImageNet)│
│     ↓                                          │
│  Bottleneck                                    │
│     ↓                                          │
│  Decoder: 5 upsampling blocks + skip connections│
│     ↓                                          │
│  Segmentation Head: Conv2d → Sigmoid           │
│     ↓                                          │
│  Output: Binary Mask [B, 1, H, W]              │
└────────────────────────────────────────────────┘

KENAPA U-Net + EfficientNet?
- U-Net: Arsitektur standar untuk segmentasi biomedis/ilmiah
  dengan skip connections yang mempertahankan detail spasial.
- EfficientNet: Backbone yang efisien secara komputasi dengan
  akurasi tinggi, cocok untuk fine-tuning.
- Kombinasi ini memberikan keseimbangan speed vs precision
  sesuai dokumentasi proyek.

MODULARITAS:
- `build_model()`: Factory function untuk membuat model
- `CoralSegmentationModel`: Wrapper class yang menambahkan
  method inference untuk integrasi API
=============================================================
"""

from pathlib import Path
from typing import Optional

import torch
import torch.nn as nn
import segmentation_models_pytorch as smp


def build_model(
    encoder_name: str = "efficientnet-b3",
    encoder_weights: str = "imagenet",
    num_classes: int = 1,
    activation: Optional[str] = None,
) -> smp.Unet:
    """
    Factory function untuk membuat model U-Net.

    Parameters:
        encoder_name    : Nama backbone (e.g., 'efficientnet-b3')
        encoder_weights : Pre-trained weights ('imagenet' atau None)
        num_classes     : Jumlah output classes (1 untuk binary)
        activation      : Activation function di output layer.
                          None = raw logits (pakai BCEWithLogitsLoss)
                          'sigmoid' = probabilitas (pakai BCELoss)

    Returns:
        Model U-Net (smp.Unet)

    Catatan:
        Kita gunakan activation=None (raw logits) saat training
        karena BCEWithLogitsLoss sudah include sigmoid dan lebih
        numerically stable. Saat inference, kita apply sigmoid manual.
    """
    model = smp.Unet(
        encoder_name=encoder_name,
        encoder_weights=encoder_weights,
        in_channels=3,
        classes=num_classes,
        activation=activation,
    )
    return model


class CoralSegmentationModel:
    """
    Wrapper class untuk model segmentasi terumbu karang.

    Menambahkan kemampuan:
    - Load/save model weights
    - Inference dengan post-processing
    - Perhitungan persentase kerusakan

    Class ini dirancang untuk digunakan oleh API layer.
    """

    def __init__(
        self,
        encoder_name: str = "efficientnet-b3",
        encoder_weights: str = "imagenet",
        num_classes: int = 1,
        device: Optional[str] = None,
    ):
        # Auto-detect device
        if device is None:
            self.device = torch.device(
                "cuda" if torch.cuda.is_available() else "cpu"
            )
        else:
            self.device = torch.device(device)

        self.model = build_model(
            encoder_name=encoder_name,
            encoder_weights=encoder_weights,
            num_classes=num_classes,
            activation=None,  # Raw logits untuk training
        )
        self.model.to(self.device)

    def load_weights(self, weights_path: str | Path) -> None:
        """Load trained model weights dari file .pth"""
        weights_path = Path(weights_path)
        if not weights_path.exists():
            raise FileNotFoundError(
                f"Model weights tidak ditemukan: {weights_path}\n"
                "Pastikan model sudah dilatih terlebih dahulu."
            )

        state_dict = torch.load(
            weights_path,
            map_location=self.device,
            weights_only=True,
        )
        self.model.load_state_dict(state_dict)
        self.model.eval()
        print(f"✅ Model weights loaded dari: {weights_path}")

    def save_weights(self, weights_path: str | Path) -> None:
        """Simpan model weights ke file .pth"""
        weights_path = Path(weights_path)
        weights_path.parent.mkdir(parents=True, exist_ok=True)
        torch.save(self.model.state_dict(), weights_path)
        print(f"💾 Model weights disimpan ke: {weights_path}")

    @torch.no_grad()
    def predict(
        self, image_tensor: torch.Tensor, threshold: float = 0.5
    ) -> torch.Tensor:
        """
        Menjalankan inference pada satu atau batch gambar.

        Parameters:
            image_tensor : Tensor [B, 3, H, W] atau [3, H, W]
            threshold    : Threshold untuk binarisasi (default 0.5)

        Returns:
            Binary mask tensor [B, 1, H, W] atau [1, H, W]
        """
        self.model.eval()

        # Handle single image (tambah batch dimension)
        if image_tensor.dim() == 3:
            image_tensor = image_tensor.unsqueeze(0)

        image_tensor = image_tensor.to(self.device)

        # Forward pass → raw logits
        logits = self.model(image_tensor)

        # Sigmoid → probabilitas → binarisasi
        probs = torch.sigmoid(logits)
        binary_mask = (probs > threshold).float()

        return binary_mask

    @torch.no_grad()
    def predict_with_stats(
        self, image_tensor: torch.Tensor, threshold: float = 0.5
    ) -> dict:
        """
        Inference + kalkulasi statistik kerusakan.

        Parameters:
            image_tensor : Tensor [3, H, W] – single image
            threshold    : Threshold binarisasi

        Returns:
            Dictionary berisi:
            - 'mask': Binary mask numpy array [H, W]
            - 'probability_map': Probability map [H, W]
            - 'damage_percentage': Persentase area rusak (float)
            - 'healthy_percentage': Persentase area sehat (float)
            - 'total_pixels': Total piksel yang dianalisis
            - 'damaged_pixels': Jumlah piksel rusak
        """
        self.model.eval()

        if image_tensor.dim() == 3:
            image_tensor = image_tensor.unsqueeze(0)

        image_tensor = image_tensor.to(self.device)

        # Forward pass
        logits = self.model(image_tensor)
        probs = torch.sigmoid(logits)
        binary_mask = (probs > threshold).float()

        # Konversi ke numpy untuk kalkulasi
        mask_np = binary_mask.squeeze().cpu().numpy()
        probs_np = probs.squeeze().cpu().numpy()

        # Hitung statistik piksel
        total_pixels = mask_np.size
        damaged_pixels = int(mask_np.sum())
        damage_pct = (damaged_pixels / total_pixels) * 100

        return {
            "mask": mask_np,
            "probability_map": probs_np,
            "damage_percentage": round(damage_pct, 2),
            "healthy_percentage": round(100 - damage_pct, 2),
            "total_pixels": total_pixels,
            "damaged_pixels": damaged_pixels,
        }
