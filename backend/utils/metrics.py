"""
Evaluation Metrics untuk Segmentasi
Accuracy, Precision, Recall, F1-Score (sesuai dokumentasi proyek)
"""

import torch
import numpy as np


def calculate_metrics(pred_mask: torch.Tensor, true_mask: torch.Tensor, threshold: float = 0.5) -> dict:
    """
    Hitung metrik evaluasi untuk binary segmentation.

    Parameters:
        pred_mask  : Prediksi (logits atau probabilities) [B, 1, H, W]
        true_mask  : Ground truth binary mask [B, 1, H, W]
        threshold  : Threshold untuk binarisasi prediksi

    Returns:
        Dict berisi accuracy, precision, recall, f1_score, iou
    """
    # Binarisasi prediksi
    if pred_mask.requires_grad:
        pred_mask = pred_mask.detach()

    pred_binary = (torch.sigmoid(pred_mask) > threshold).float()
    true_binary = true_mask.float()

    # Flatten
    pred_flat = pred_binary.view(-1)
    true_flat = true_binary.view(-1)

    # Confusion matrix components
    tp = (pred_flat * true_flat).sum().item()
    fp = (pred_flat * (1 - true_flat)).sum().item()
    fn = ((1 - pred_flat) * true_flat).sum().item()
    tn = ((1 - pred_flat) * (1 - true_flat)).sum().item()

    total = tp + fp + fn + tn
    accuracy = (tp + tn) / total if total > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    iou = tp / (tp + fp + fn) if (tp + fp + fn) > 0 else 0

    return {
        "accuracy": round(accuracy, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "iou": round(iou, 4),
    }
