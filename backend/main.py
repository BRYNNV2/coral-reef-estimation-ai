"""
FastAPI Application – Coral Reef Condition Estimation System

Cara menjalankan:
    cd backend
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Swagger UI:  http://localhost:8000/docs
ReDoc:       http://localhost:8000/redoc
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.inference import router as inference_router

app = FastAPI(
    title="🐠 Coral Reef Condition Estimation API",
    description=(
        "API untuk estimasi kondisi terumbu karang menggunakan "
        "semantic segmentation (U-Net + EfficientNet). "
        "Upload gambar terumbu karang dan dapatkan analisis "
        "persentase kerusakan beserta visualisasi overlay."
    ),
    version="1.0.0",
)

# ── CORS Middleware ────────────────────────────────────────
# Izinkan frontend React.js mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan domain frontend di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ──────────────────────────────────────
app.include_router(inference_router)


@app.get("/")
async def root():
    return {
        "name": "Coral Reef Condition Estimation API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "predict": "POST /api/v1/predict",
            "health": "GET /api/v1/health",
        },
    }
