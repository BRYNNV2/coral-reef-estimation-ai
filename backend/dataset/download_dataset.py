"""
=============================================================
Download Dataset dari Roboflow
=============================================================
Script ini mengunduh dataset segmentasi terumbu karang dari
Roboflow dan menyimpannya ke folder `dataset/`.

Roboflow mendukung berbagai format export. Untuk segmentasi
semantik, kita gunakan format 'coco-segmentation' yang
menyediakan anotasi polygon dalam file JSON.

Cara Pakai:
    python -m dataset.download_dataset
=============================================================
"""

import sys
from pathlib import Path

# Tambahkan parent directory ke path agar bisa import config
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from roboflow import Roboflow
from config import (
    ROBOFLOW_API_KEY,
    ROBOFLOW_WORKSPACE,
    ROBOFLOW_PROJECT,
    ROBOFLOW_VERSION,
    DATASET_DIR,
)


def download_roboflow_dataset() -> Path:
    """
    Mengunduh dataset dari Roboflow menggunakan API Key.

    Returns:
        Path ke folder dataset yang sudah di-download.

    Catatan:
        - Pastikan ROBOFLOW_API_KEY sudah diisi di config.py
        - Dataset akan disimpan di DATASET_DIR
        - Format 'coco-segmentation' menghasilkan:
            ├── train/
            │   ├── _annotations.coco.json   ← Anotasi polygon (COCO format)
            │   └── *.jpg                     ← Gambar training
            ├── valid/
            │   ├── _annotations.coco.json
            │   └── *.jpg
            └── test/
                ├── _annotations.coco.json
                └── *.jpg
    """
    if ROBOFLOW_API_KEY == "YOUR_ROBOFLOW_API_KEY":
        raise ValueError(
            "⚠️  Roboflow API Key belum diisi!\n"
            "   Buka file config.py dan isi ROBOFLOW_API_KEY dengan key Anda.\n"
            "   Dapatkan API key di: https://app.roboflow.com/settings/api"
        )

    print(f"🔗 Menghubungkan ke Roboflow workspace: {ROBOFLOW_WORKSPACE}")
    rf = Roboflow(api_key=ROBOFLOW_API_KEY)
    project = rf.workspace(ROBOFLOW_WORKSPACE).project(ROBOFLOW_PROJECT)
    version = project.version(ROBOFLOW_VERSION)

    print(f"📥 Mengunduh dataset versi {ROBOFLOW_VERSION}...")
    dataset = version.download(
        model_format="coco-segmentation",
        location=str(DATASET_DIR),
        overwrite=True,
    )

    print(f"✅ Dataset berhasil diunduh ke: {DATASET_DIR}")
    print(f"   Location: {dataset.location}")
    return Path(dataset.location)


if __name__ == "__main__":
    download_roboflow_dataset()
