"""
Training Script untuk Coral Reef Segmentation Model
Cara pakai: python train.py
"""

import sys
from pathlib import Path

import torch
import torch.nn as nn
from tqdm import tqdm

# Tambah path agar bisa import modul lokal
sys.path.insert(0, str(Path(__file__).resolve().parent))

from config import (
    DATASET_DIR, BEST_MODEL_PATH, IMG_SIZE, BATCH_SIZE,
    LEARNING_RATE, NUM_EPOCHS, ENCODER_NAME, ENCODER_WEIGHTS,
    NUM_CLASSES, MEAN, STD,
)
from dataset.coral_dataset import get_dataloaders
from model.unet import CoralSegmentationModel
from utils.metrics import calculate_metrics


def train_one_epoch(model, loader, criterion, optimizer, device):
    """Training loop untuk satu epoch."""
    model.model.train()
    total_loss = 0
    all_metrics = {"accuracy": 0, "precision": 0, "recall": 0, "f1_score": 0, "iou": 0}

    pbar = tqdm(loader, desc="Training", leave=False)
    for images, masks in pbar:
        images = images.to(device)
        masks = masks.to(device)

        optimizer.zero_grad()
        logits = model.model(images)
        loss = criterion(logits, masks)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        batch_metrics = calculate_metrics(logits, masks)
        for k in all_metrics:
            all_metrics[k] += batch_metrics[k]

        pbar.set_postfix(loss=f"{loss.item():.4f}")

    n = len(loader)
    avg_loss = total_loss / n
    avg_metrics = {k: round(v / n, 4) for k, v in all_metrics.items()}
    return avg_loss, avg_metrics


@torch.no_grad()
def validate(model, loader, criterion, device):
    """Validation loop."""
    model.model.eval()
    total_loss = 0
    all_metrics = {"accuracy": 0, "precision": 0, "recall": 0, "f1_score": 0, "iou": 0}

    for images, masks in tqdm(loader, desc="Validating", leave=False):
        images = images.to(device)
        masks = masks.to(device)

        logits = model.model(images)
        loss = criterion(logits, masks)

        total_loss += loss.item()
        batch_metrics = calculate_metrics(logits, masks)
        for k in all_metrics:
            all_metrics[k] += batch_metrics[k]

    n = len(loader)
    avg_loss = total_loss / n
    avg_metrics = {k: round(v / n, 4) for k, v in all_metrics.items()}
    return avg_loss, avg_metrics


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Device] {device}")

    # ── DataLoaders ────────────────────────────────────────
    train_loader, val_loader = get_dataloaders(
        dataset_dir=DATASET_DIR,
        img_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        mean=MEAN,
        std=STD,
    )

    # ── Model ──────────────────────────────────────────────
    coral_model = CoralSegmentationModel(
        encoder_name=ENCODER_NAME,
        encoder_weights=ENCODER_WEIGHTS,
        num_classes=NUM_CLASSES,
        device=str(device),
    )
    print(f"[Model] U-Net + {ENCODER_NAME}")

    # ── Loss & Optimizer ───────────────────────────────────
    # BCEWithLogitsLoss = Binary Cross Entropy + Sigmoid (numerically stable)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.Adam(coral_model.model.parameters(), lr=LEARNING_RATE)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", patience=5, factor=0.5
    )

    # ── Training Loop ──────────────────────────────────────
    best_val_loss = float("inf")

    for epoch in range(1, NUM_EPOCHS + 1):
        print(f"\n{'='*60}")
        print(f"Epoch {epoch}/{NUM_EPOCHS}")
        print(f"{'='*60}")

        train_loss, train_met = train_one_epoch(
            coral_model, train_loader, criterion, optimizer, device
        )
        val_loss, val_met = validate(
            coral_model, val_loader, criterion, device
        )

        scheduler.step(val_loss)

        print(f"  Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")
        print(f"  Train → Acc: {train_met['accuracy']} | F1: {train_met['f1_score']} | IoU: {train_met['iou']}")
        print(f"  Valid → Acc: {val_met['accuracy']} | F1: {val_met['f1_score']} | IoU: {val_met['iou']}")

        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            coral_model.save_weights(BEST_MODEL_PATH)
            print(f"  [BEST] Model saved! (val_loss: {val_loss:.4f})")

    print(f"\n[DONE] Training selesai! Best val_loss: {best_val_loss:.4f}")
    print(f"   Model tersimpan di: {BEST_MODEL_PATH}")


if __name__ == "__main__":
    main()
