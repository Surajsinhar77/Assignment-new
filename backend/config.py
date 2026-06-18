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
    cors_env = os.getenv("CORS_ORIGINS", "")
    ALLOWED_ORIGINS = [origin.strip() for origin in cors_env.split(",") if origin.strip()]
    if not ALLOWED_ORIGINS:
        # Allow all origins in production if not set (for assignment demo)
        ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost",
        "http://frontend:3000",
        "http://127.0.0.1:3000",
    ]
    cors_env = os.getenv("CORS_ORIGINS", "")
    if cors_env:
        ALLOWED_ORIGINS.extend([o.strip() for o in cors_env.split(",") if o.strip()])

# Remove empty strings
ALLOWED_ORIGINS = [origin for origin in ALLOWED_ORIGINS if origin]
