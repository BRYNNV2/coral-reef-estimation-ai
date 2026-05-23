"""
=============================================================
Coral Reef Segmentation Dataset – PyTorch Dataset Class
=============================================================
Modul ini mengkonversi dataset COCO-segmentation (anotasi
polygon dari Roboflow) menjadi tensor yang siap dilatih.

ALUR KERJA:
1. Baca file `_annotations.coco.json` yang berisi polygon
   untuk setiap gambar.
2. Render semua polygon menjadi binary mask (numpy array).
3. Terapkan augmentasi (Albumentations) pada gambar + mask.
4. Konversi ke tensor PyTorch.

FORMAT OUTPUT:
- image: Tensor [3, H, W] – gambar yang sudah dinormalisasi
- mask:  Tensor [1, H, W] – binary mask (0=Healthy, 1=Damaged)
=============================================================
"""

import json
from pathlib import Path
from typing import Optional, Tuple

import cv2
import numpy as np
import torch
from torch.utils.data import Dataset
import albumentations as A
from albumentations.pytorch import ToTensorV2


class CoralReefDataset(Dataset):
    """
    PyTorch Dataset untuk segmentasi terumbu karang.

    Parameters:
        root_dir   : Path ke folder split (e.g., 'dataset/train')
        img_size   : Ukuran target (H, W) setelah resize
        mean       : Mean per-channel untuk normalisasi
        std        : Std per-channel untuk normalisasi
        augment    : Apakah menggunakan augmentasi (True untuk training)
    """

    def __init__(
        self,
        root_dir: str | Path,
        img_size: int = 256,
        mean: list = [0.485, 0.456, 0.406],
        std: list = [0.229, 0.224, 0.225],
        augment: bool = False,
    ):
        self.root_dir = Path(root_dir)
        self.img_size = img_size
        self.mean = mean
        self.std = std
        self.augment = augment

        # ── Load COCO Annotations ──────────────────────────
        ann_path = self.root_dir / "_annotations.coco.json"
        if not ann_path.exists():
            raise FileNotFoundError(
                f"File anotasi tidak ditemukan: {ann_path}\n"
                "Pastikan dataset sudah di-download dengan format 'coco-segmentation'."
            )

        with open(ann_path, "r") as f:
            self.coco = json.load(f)

        # Buat lookup: image_id → info gambar
        self.images = {img["id"]: img for img in self.coco["images"]}

        # Buat lookup: image_id → list of annotations
        self.img_to_anns: dict[int, list] = {}
        for ann in self.coco["annotations"]:
            img_id = ann["image_id"]
            self.img_to_anns.setdefault(img_id, []).append(ann)

        # Daftar semua image_id yang punya anotasi
        self.image_ids = list(self.img_to_anns.keys())

        # ── Build Augmentation Pipeline ────────────────────
        self.transform = self._build_transforms()

    def _build_transforms(self) -> A.Compose:
        """
        Membangun pipeline augmentasi menggunakan Albumentations.

        Augmentasi Training (sesuai dokumentasi proyek):
        - Geometric: Flip, Rotate, ShiftScaleRotate
        - Photometric: ColorJitter, GaussianBlur (simulasi blur bawah air)

        Augmentasi Val/Test:
        - Hanya Resize dan Normalize
        """
        if self.augment:
            return A.Compose([
                # Geometric augmentation
                A.Resize(self.img_size, self.img_size),
                A.HorizontalFlip(p=0.5),
                A.VerticalFlip(p=0.3),
                A.ShiftScaleRotate(
                    shift_limit=0.1,
                    scale_limit=0.2,
                    rotate_limit=30,
                    border_mode=cv2.BORDER_CONSTANT,
                    p=0.5,
                ),
                # Photometric augmentation (underwater noise simulation)
                A.OneOf([
                    A.GaussianBlur(blur_limit=(3, 7), p=1.0),
                    A.MotionBlur(blur_limit=7, p=1.0),
                ], p=0.3),
                A.ColorJitter(
                    brightness=0.2,
                    contrast=0.2,
                    saturation=0.3,
                    hue=0.1,
                    p=0.4,
                ),
                A.GaussNoise(p=0.2),
                # Normalize & convert
                A.Normalize(mean=self.mean, std=self.std),
                ToTensorV2(),
            ])
        else:
            return A.Compose([
                A.Resize(self.img_size, self.img_size),
                A.Normalize(mean=self.mean, std=self.std),
                ToTensorV2(),
            ])

    def _polygon_to_mask(
        self, annotations: list, height: int, width: int
    ) -> np.ndarray:
        """
        Mengkonversi anotasi polygon COCO menjadi binary mask.

        Setiap anotasi berisi field 'segmentation' yang merupakan
        list of polygons. Setiap polygon adalah flat list:
            [x1, y1, x2, y2, ..., xN, yN]

        Kita render semua polygon ke satu mask menggunakan cv2.fillPoly.

        Parameters:
            annotations : List anotasi COCO untuk satu gambar
            height      : Tinggi gambar asli
            width       : Lebar gambar asli

        Returns:
            Binary mask (H, W) dengan nilai 0 atau 1
        """
        mask = np.zeros((height, width), dtype=np.uint8)

        for ann in annotations:
            # 'segmentation' bisa berisi beberapa polygon per anotasi
            for seg in ann.get("segmentation", []):
                # Konversi flat list → array of points (N, 2)
                pts = np.array(seg, dtype=np.float32).reshape(-1, 2)
                pts = pts.astype(np.int32)
                cv2.fillPoly(mask, [pts], color=1)

        return mask

    def __len__(self) -> int:
        return len(self.image_ids)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Mengambil satu sampel (image, mask) sebagai tensor.

        Returns:
            image : Tensor [3, H, W] – normalized RGB image
            mask  : Tensor [1, H, W] – binary segmentation mask
        """
        img_id = self.image_ids[idx]
        img_info = self.images[img_id]

        # ── Load Gambar ────────────────────────────────────
        img_path = self.root_dir / img_info["file_name"]
        image = cv2.imread(str(img_path))
        if image is None:
            raise FileNotFoundError(f"Gambar tidak ditemukan: {img_path}")
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # ── Generate Binary Mask dari Polygon ──────────────
        h, w = img_info["height"], img_info["width"]
        annotations = self.img_to_anns.get(img_id, [])
        mask = self._polygon_to_mask(annotations, h, w)

        # ── Apply Augmentation ─────────────────────────────
        transformed = self.transform(image=image, mask=mask)
        image_t = transformed["image"]          # [3, H, W]
        mask_t = transformed["mask"]            # [H, W]

        # Tambahkan channel dimension pada mask → [1, H, W]
        mask_t = mask_t.unsqueeze(0).float()

        return image_t, mask_t


def get_dataloaders(
    dataset_dir: str | Path,
    img_size: int = 256,
    batch_size: int = 8,
    mean: list = [0.485, 0.456, 0.406],
    std: list = [0.229, 0.224, 0.225],
    num_workers: int = 2,
) -> Tuple[torch.utils.data.DataLoader, torch.utils.data.DataLoader]:
    """
    Membuat DataLoader untuk training dan validation.

    Parameters:
        dataset_dir : Path ke root dataset (berisi subfolder train/ dan valid/)
        img_size    : Ukuran resize
        batch_size  : Jumlah sampel per batch
        mean, std   : Normalization parameters
        num_workers : Jumlah worker untuk data loading

    Returns:
        (train_loader, val_loader)
    """
    dataset_dir = Path(dataset_dir)

    train_dataset = CoralReefDataset(
        root_dir=dataset_dir / "train",
        img_size=img_size,
        mean=mean,
        std=std,
        augment=True,
    )

    val_dataset = CoralReefDataset(
        root_dir=dataset_dir / "valid",
        img_size=img_size,
        mean=mean,
        std=std,
        augment=False,
    )

    train_loader = torch.utils.data.DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True,
        drop_last=True,
    )

    val_loader = torch.utils.data.DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True,
    )

    print(f"📊 Dataset Loaded:")
    print(f"   Train: {len(train_dataset)} samples → {len(train_loader)} batches")
    print(f"   Valid: {len(val_dataset)} samples → {len(val_loader)} batches")

    return train_loader, val_loader
