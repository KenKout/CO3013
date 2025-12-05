from dotenv import load_dotenv, find_dotenv
from pydantic_settings import BaseSettings
import secrets

load_dotenv(find_dotenv(".env"), override=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Study Space"
    PROJECT_VERSION: str = "1.0.0"

    # JWT Settings
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Database Settings
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "study_space"


    IOT_SERVER_URL: str = "https://doantonghopiot.namanhishere.com"  
    IOT_API_TOKEN: str = "coconut"
    
    @property
    def DATABASE_URL(self) -> str:
        """Synchronous database URL for SQLAlchemy (using psycopg)"""
        return f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """Asynchronous database URL for SQLAlchemy (using asyncpg)"""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    
settings = Settings()
