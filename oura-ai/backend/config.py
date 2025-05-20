import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OURA_PAT: str = os.getenv("OURA_PAT", "")
    OURA_RATE_LIMIT: int = 5000
    OURA_RATE_PERIOD: int = 300  # seconds (5 min)
    TIMEZONE: str = "Europe/London"

    class Config:
        env_file = ".env"

settings = Settings()
