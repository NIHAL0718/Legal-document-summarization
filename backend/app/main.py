from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import routers
from app.routes.chatbot_routes import router as chatbot_router
from app.routes.ocr_routes import router as ocr_router
from app.routes.summarize_routes import router as summarize_router
from app.routes.translate_routes import router as translate_router  # ✅ router defined in translate_routes.py

app = FastAPI(
    title="Legal Document Summarizer API",
    description="API for OCR, Chatbot, Summarization, and Translation functionalities",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers with prefixes
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(ocr_router, prefix="/api/ocr", tags=["OCR"])
app.include_router(summarize_router, prefix="/api/summarize", tags=["Summarization"])
app.include_router(translate_router, prefix="/api/translate", tags=["Translation"])  # ✅ Correct prefix

# Optional: Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to the Legal Document Summarizer API. Use the following endpoints:",
        "endpoints": {
            "Chatbot": "/api/chatbot",
            "OCR": "/api/ocr",
            "Summarization": "/api/summarize",
            "Translation": "/api/translate"
        }
    }
