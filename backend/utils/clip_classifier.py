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
    Mengembalikan True jika probabilitas gambar karang lebih tinggi.
    """
    classifier = get_clip_classifier()
        
    candidate_labels = [
        "a close-up underwater photo of a coral reef",
        "a photo of a human, person, or face",
        "a photo of a cute fluffy hat or animal",
        "a photo of land, city, building, or indoor room"
    ]
    
    try:
        results = classifier(image_pil, candidate_labels=candidate_labels)
        top_label = results[0]['label']
        
        if top_label != "a close-up underwater photo of a coral reef":
            print(f"Gambar ditolak oleh CLIP. Terdeteksi sebagai: {top_label} (Score: {results[0]['score']:.2f})")
            return False
            
        print(f"Gambar lolos CLIP. Terdeteksi sebagai: {top_label} (Score: {results[0]['score']:.2f})")
        return True
    except Exception as e:
        print(f"Error saat inferensi CLIP: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "message": f"Error inferensi CLIP: {str(e)}"})
