import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in environment variables")

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
PORT = int(os.getenv("PORT", 8000))

# CORS Origins based on environment
if ENVIRONMENT == "production":
    ALLOWED_ORIGINS = [
        os.getenv("CORS_ORIGINS", "https://your-app-name.netlify.app"),
        "https://your-app-name.netlify.app",
    ]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost",
        "http://frontend:3000",
        "http://127.0.0.1:3000",
        os.getenv("CORS_ORIGINS", ""),
    ]

# Remove empty strings
ALLOWED_ORIGINS = [origin for origin in ALLOWED_ORIGINS if origin]
