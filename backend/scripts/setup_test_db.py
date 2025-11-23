#!/usr/bin/env python
"""
Script to set up the test database.

Usage:
    uv run python scripts/setup_test_db.py
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.core.database import Base
# Import all models to register them with Base.metadata
from app.models import (
    User, Space, Utility, SpaceUtility,
    Booking, UserPenalty, UserRating
)


def get_test_database_url() -> str:
    """Get test database URL."""
    return f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/study_space_test"


def get_admin_database_url() -> str:
    """Get admin database URL (connects to postgres db to create test db)."""
    return f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/postgres"


async def create_test_database():
    """Drop and recreate the test database for a clean slate."""
    engine = create_async_engine(get_admin_database_url(), isolation_level="AUTOCOMMIT")

    async with engine.connect() as conn:
        # Terminate existing connections to the test database
        await conn.execute(text("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'study_space_test'
            AND pid <> pg_backend_pid()
        """))

        # Drop database if exists
        print("Dropping test database 'study_space_test' if exists...")
        await conn.execute(text("DROP DATABASE IF EXISTS study_space_test"))

        # Create fresh database
        print("Creating test database 'study_space_test'...")
        await conn.execute(text("CREATE DATABASE study_space_test"))
        print("Test database created successfully!")

    await engine.dispose()


async def create_tables():
    """Create all tables in the test database."""
    engine = create_async_engine(get_test_database_url())

    async with engine.begin() as conn:
        # Enable required extensions
        print("Enabling extensions...")
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS citext"))

        print("Creating tables in test database...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created successfully!")

    await engine.dispose()


async def main():
    """Main entry point."""
    print(f"Setting up test database...")
    print(f"Host: {settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}")

    try:
        await create_test_database()
        await create_tables()
        print("\nTest database setup complete!")
    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
