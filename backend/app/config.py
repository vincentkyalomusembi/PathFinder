"""Lightweight backend configuration - Redis only, no persistent DB."""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings"""

    # API settings
    API_TITLE: str = "PathFinder API"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_URL: Optional[str] = None

    # Session settings
    SESSION_TTL: int = 3600

    # External API Keys (optional)
    GEMINI_API_KEY: Optional[str] = None
    
    # Database (optional - not used but may be in .env)
    DATABASE_URL: Optional[str] = None
    SECRET_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env


settings = Settings()        