"""
Seed script to initialize the database with default data.
Run with: uv run python -m app.scripts.seed
"""
import asyncio
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import User, Utility, Space, UserRole, UserStatus, SpaceStatus


async def seed_utilities(session):
    """Seed default utilities."""
    utilities = [
        {"key": "wifi", "label": "WiFi", "description": "Wireless internet access"},
        {"key": "ac", "label": "Air Conditioning", "description": "Climate control"},
        {"key": "whiteboard", "label": "Whiteboard", "description": "Writing board with markers"},
        {"key": "projector", "label": "Projector", "description": "Video projector for presentations"},
        {"key": "power_outlets", "label": "Power Outlets", "description": "Electrical outlets for charging"},
        {"key": "computer", "label": "Computer", "description": "Desktop computer available"},
        {"key": "printer", "label": "Printer", "description": "Printing services available"},
        {"key": "quiet_zone", "label": "Quiet Zone", "description": "Silent study area"},
    ]

    for util_data in utilities:
        result = await session.execute(
            select(Utility).where(Utility.key == util_data["key"])
        )
        if not result.scalar_one_or_none():
            utility = Utility(**util_data)
            session.add(utility)
            print(f"  Added utility: {util_data['label']}")

    await session.flush()


async def seed_admin_user(session):
    """Seed default admin user."""
    admin_email = "admin@studyspace.com"

    result = await session.execute(select(User).where(User.email == admin_email))
    if not result.scalar_one_or_none():
        admin = User(
            email=admin_email,
            password_hash=get_password_hash("admin123"),
            full_name="System Administrator",
            role=UserRole.ADMIN,
            status=UserStatus.ACTIVE,
        )
        session.add(admin)
        print(f"  Added admin user: {admin_email} (password: admin123)")
    else:
        print(f"  Admin user already exists: {admin_email}")

    await session.flush()


async def seed_sample_spaces(session):
    """Seed sample study spaces."""
    from app.models import SpaceUtility

    # Get utilities for linking
    result = await session.execute(select(Utility))
    utilities = {u.key: u for u in result.scalars().all()}

    spaces_data = [
        {
            "name": "Study Room A1",
            "building": "Library",
            "floor": "1",
            "location": "Near entrance",
            "capacity": 6,
            "status": SpaceStatus.ACTIVE,
            "utility_keys": ["wifi", "ac", "whiteboard", "power_outlets"],
        },
        {
            "name": "Study Room A2",
            "building": "Library",
            "floor": "1",
            "location": "Near cafe",
            "capacity": 4,
            "status": SpaceStatus.ACTIVE,
            "utility_keys": ["wifi", "ac", "power_outlets"],
        },
        {
            "name": "Computer Lab B1",
            "building": "Library",
            "floor": "2",
            "location": "East wing",
            "capacity": 20,
            "status": SpaceStatus.ACTIVE,
            "utility_keys": ["wifi", "ac", "computer", "printer", "power_outlets"],
        },
        {
            "name": "Quiet Study Hall",
            "building": "Library",
            "floor": "3",
            "location": "Top floor",
            "capacity": 50,
            "status": SpaceStatus.ACTIVE,
            "utility_keys": ["wifi", "ac", "quiet_zone", "power_outlets"],
        },
        {
            "name": "Meeting Room C1",
            "building": "Student Center",
            "floor": "1",
            "capacity": 10,
            "status": SpaceStatus.ACTIVE,
            "utility_keys": ["wifi", "ac", "projector", "whiteboard"],
        },
    ]

    for space_data in spaces_data:
        result = await session.execute(
            select(Space).where(
                Space.name == space_data["name"],
                Space.building == space_data["building"]
            )
        )
        if not result.scalar_one_or_none():
            utility_keys = space_data.pop("utility_keys", [])
            space = Space(**space_data)
            session.add(space)
            await session.flush()

            # Add utilities via junction table
            for key in utility_keys:
                if key in utilities:
                    space_utility = SpaceUtility(
                        space_id=space.id,
                        utility_id=utilities[key].id
                    )
                    session.add(space_utility)

            print(f"  Added space: {space_data['name']}")

    await session.flush()


async def main():
    """Run all seed functions."""
    print("Starting database seed...")

    async with AsyncSessionLocal() as session:
        try:
            print("\nSeeding utilities...")
            await seed_utilities(session)

            print("\nSeeding admin user...")
            await seed_admin_user(session)

            print("\nSeeding sample spaces...")
            await seed_sample_spaces(session)

            await session.commit()
            print("\nDatabase seeded successfully!")

        except Exception as e:
            await session.rollback()
            print(f"\nError seeding database: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(main())
