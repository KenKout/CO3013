from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_async_db
from app.core.exceptions import NotFoundException, ConflictException
from app.dependencies import get_current_admin_user
from app.models import Utility, User
from app.schemas import (
    UtilityResponse,
    CreateUtilityRequest,
    UpdateUtilityRequest,
)

router = APIRouter()


@router.get("", response_model=list[UtilityResponse])
async def list_utilities(
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """List all utilities (WiFi, AC, whiteboard, etc.)."""
    result = await db.execute(select(Utility).order_by(Utility.label))
    utilities = result.scalars().all()
    return [UtilityResponse.model_validate(u) for u in utilities]


@router.post("", response_model=UtilityResponse, status_code=status.HTTP_201_CREATED)
async def create_utility(
    request: CreateUtilityRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Create a new utility (admin only)."""
    # Check if key already exists
    result = await db.execute(select(Utility).where(Utility.key == request.key))
    if result.scalar_one_or_none():
        raise ConflictException(detail="Utility key already exists")

    utility = Utility(
        key=request.key,
        label=request.label,
        description=request.description,
    )

    db.add(utility)
    await db.flush()
    await db.refresh(utility)

    return UtilityResponse.model_validate(utility)


@router.patch("/{utility_id}", response_model=UtilityResponse)
async def update_utility(
    utility_id: int,
    request: UpdateUtilityRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Update a utility (admin only)."""
    result = await db.execute(select(Utility).where(Utility.id == utility_id))
    utility = result.scalar_one_or_none()

    if not utility:
        raise NotFoundException(detail="Utility not found")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(utility, field, value)

    await db.flush()
    await db.refresh(utility)

    return UtilityResponse.model_validate(utility)


@router.delete("/{utility_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_utility(
    utility_id: int,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Delete a utility (admin only)."""
    result = await db.execute(select(Utility).where(Utility.id == utility_id))
    utility = result.scalar_one_or_none()

    if not utility:
        raise NotFoundException(detail="Utility not found")

    await db.delete(utility)
    await db.flush()
