from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_async_db
from app.core.exceptions import NotFoundException, BadRequestException
from app.dependencies import get_current_admin_user
from app.models import UserPenalty, User, Booking, PenaltyStatus
from app.schemas import (
    PenaltyResponse,
    AddPenaltyRequest,
    UpdatePenaltyRequest,
)
from app.schemas.common import PaginatedResponse, PaginatedResponseMeta

router = APIRouter()


@router.get("", response_model=PaginatedResponse[PenaltyResponse])
async def list_penalties(
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    q: str | None = Query(default=None, description="Search query"),
    status: PenaltyStatus | None = None,
    user_id: int | None = Query(default=None, alias="userId"),
):
    """List penalties (admin only)."""
    query = select(UserPenalty)

    if q:
        query = query.where(UserPenalty.reason.ilike(f"%{q}%"))
    if status:
        query = query.where(UserPenalty.status == status)
    if user_id:
        query = query.where(UserPenalty.user_id == user_id)

    query = query.order_by(UserPenalty.created_at.desc())

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    penalties = result.scalars().all()

    return PaginatedResponse(
        data=[PenaltyResponse.model_validate(p) for p in penalties],
        meta=PaginatedResponseMeta(total=total, limit=limit, offset=offset)
    )


@router.post("", response_model=PenaltyResponse, status_code=status.HTTP_201_CREATED)
async def add_penalty(
    request: AddPenaltyRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Add a penalty to a user (admin only)."""
    # Verify user exists
    user_result = await db.execute(select(User).where(User.id == request.user_id))
    if not user_result.scalar_one_or_none():
        raise NotFoundException(detail="User not found")

    # Verify booking exists if provided
    if request.booking_id:
        booking_result = await db.execute(select(Booking).where(Booking.id == request.booking_id))
        if not booking_result.scalar_one_or_none():
            raise NotFoundException(detail="Booking not found")

    penalty = UserPenalty(
        user_id=request.user_id,
        booking_id=request.booking_id,
        reason=request.reason,
        points=request.points,
        status=PenaltyStatus.ACTIVE,
        created_by=current_user.id,
    )

    db.add(penalty)
    await db.flush()
    await db.refresh(penalty)

    return PenaltyResponse.model_validate(penalty)


@router.patch("/{penalty_id}", response_model=PenaltyResponse)
async def update_penalty(
    penalty_id: int,
    request: UpdatePenaltyRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Update penalty status (admin only)."""
    result = await db.execute(select(UserPenalty).where(UserPenalty.id == penalty_id))
    penalty = result.scalar_one_or_none()

    if not penalty:
        raise NotFoundException(detail="Penalty not found")

    penalty.status = request.status

    await db.flush()
    await db.refresh(penalty)

    return PenaltyResponse.model_validate(penalty)
