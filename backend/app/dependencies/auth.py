from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_async_db
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models import User, UserRole, UserStatus

# Use HTTPBearer for cleaner Swagger UI - shows simple "Bearer token" input
bearer_scheme = HTTPBearer(
    scheme_name="JWT Bearer",
    description="Enter your JWT token (without 'Bearer ' prefix)"
)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
) -> User:
    """Get the current authenticated user from JWT token."""
    token = credentials.credentials

    payload = decode_access_token(token)
    if payload is None:
        raise UnauthorizedException(detail="Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedException(detail="Invalid token payload")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()

    if user is None:
        raise UnauthorizedException(detail="User not found")

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """Get the current user and verify they are active."""
    if current_user.status != UserStatus.ACTIVE:
        raise ForbiddenException(detail="User account is suspended")
    return current_user


async def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    """Get the current user and verify they are an admin."""
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="Admin access required")
    return current_user
