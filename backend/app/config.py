from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "ai_career_copilot"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # App
    APP_NAME: str = "AI Career Copilot"
    DEBUG: bool = False
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-production-domain.com",
    ]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
