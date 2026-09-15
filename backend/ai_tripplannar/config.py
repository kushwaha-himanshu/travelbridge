import os
from pathlib import Path
from dotenv import load_dotenv

# Load from ai_tripplannar local directory
current_dir = Path(__file__).resolve().parent
load_dotenv(current_dir / ".env")

# Also load from parent backend directory if keys are there
parent_dir = current_dir.parent
if (parent_dir / ".env").exists():
    load_dotenv(parent_dir / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
GOOGLE_ROUTES_API_KEY = os.getenv("GOOGLE_ROUTES_API_KEY")
STAYING_API_KEY = os.getenv("STAYING_API_KEY") or os.getenv("STAYINGAPI_KEY")
PYTHON_SERVICE_TOKEN = os.getenv("PYTHON_SERVICE_TOKEN", "")

# Print status (safely, no secrets leaked)
print(f"[Config] GEMINI_API_KEY configured: {bool(GEMINI_API_KEY)}")
print(f"[Config] GOOGLE_PLACES_API_KEY configured: {bool(GOOGLE_PLACES_API_KEY)}")
print(f"[Config] GOOGLE_ROUTES_API_KEY configured: {bool(GOOGLE_ROUTES_API_KEY)}")
print(f"[Config] STAYING_API_KEY configured: {bool(STAYING_API_KEY)}")
