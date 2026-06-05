import os
import torch
from transformers import pipeline

from fastapi import HTTPException

# Singleton instance to avoid reloading the model for every request
_clip_classifier = None
_clip_error = None

def get_clip_classifier():
    """
    Initialize and return the CLIP zero-shot image classification pipeline.
    """
    global _clip_classifier, _clip_error
    if _clip_classifier is None and _clip_error is None:
        print("Memuat model CLIP untuk Zero-Shot Classification...")
        device = 0 if torch.cuda.is_available() else -1
        try:
            _clip_classifier = pipeline(
                "zero-shot-image-classification", 
                model="openai/clip-vit-base-patch32", 
                device=device
            )
            print("Model CLIP berhasil dimuat!")
        except Exception as e:
            print(f"Gagal memuat model CLIP: {e}")
            _clip_error = str(e)
            
    if _clip_error:
        raise HTTPException(status_code=500, detail={"success": False, "message": f"CLIP Gagal dimuat: {_clip_error}"})
        
    return _clip_classifier

def is_coral_image(image_pil) -> bool:
    """
    Memeriksa apakah gambar yang diberikan adalah terumbu karang laut.
    Menggunakan strategi ketat:
      1. Binary check: underwater coral reef vs everything else
      2. Minimum confidence threshold (harus > 0.55)
    Mengembalikan True hanya jika gambar sangat meyakinkan sebagai karang bawah laut.
    """
    classifier = get_clip_classifier()
    
    # Minimum confidence score — gambar harus SANGAT meyakinkan sebagai karang
    MIN_CORAL_CONFIDENCE = 0.55
    
    # Label yang sangat spesifik dan kontrastif
    candidate_labels = [
        "an underwater photograph of a colorful coral reef ecosystem in the ocean, with blue or turquoise water visible",
        "a photograph of dry rocks, gravel, stones, pebbles, or boulders on land with no water",
        "a photograph of a person, human face, selfie, or group of people",
        "a photograph of buildings, houses, streets, vehicles, or city infrastructure",
        "a photograph of animals, pets, cats, dogs, birds, or insects",
        "a photograph of food, drinks, fruits, vegetables, or meals on a plate",
        "a photograph of plants, trees, flowers, grass, forest, or garden on land",
        "a photograph of sky, clouds, sunset, sunrise, or landscape scenery",
    ]
    
    try:
        results = classifier(image_pil, candidate_labels=candidate_labels)
        
        # Log semua skor untuk debugging
        print(f"\n{'='*50}")
        print(f"[CLIP] Hasil klasifikasi:")
        for r in results:
            print(f"  {r['score']:.4f}  {r['label'][:70]}")
        print(f"{'='*50}")
        
        top_label = results[0]['label']
        top_score = results[0]['score']
        
        coral_label = "an underwater photograph of a colorful coral reef ecosystem in the ocean, with blue or turquoise water visible"
        
        # Cek 1: Label teratas HARUS coral
        if top_label != coral_label:
            print(f"[CLIP] DITOLAK - Bukan karang. Terdeteksi: '{top_label[:60]}' (Score: {top_score:.2f})")
            return False
        
        # Cek 2: Confidence harus di atas threshold
        if top_score < MIN_CORAL_CONFIDENCE:
            print(f"[CLIP] DITOLAK - Confidence terlalu rendah: {top_score:.2f} (minimum: {MIN_CORAL_CONFIDENCE})")
            return False
            
        print(f"[CLIP] LOLOS - Terumbu karang terdeteksi (Score: {top_score:.2f})")
        return True
        
    except Exception as e:
        print(f"Error saat inferensi CLIP: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "message": f"Error inferensi CLIP: {str(e)}"})

