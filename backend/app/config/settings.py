"""
Application Configuration Settings
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    APP_NAME: str = "Dream Blog"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    DATABASE_URL: str = "sqlite:///./dream_blog.db"
    
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars-long!!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
