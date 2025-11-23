from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_async_db
from app.core.exceptions import NotFoundException
from app.dependencies import get_current_admin_user
from app.models import User, Booking, UserPenalty, UserRating, UserStatus, BookingStatus
from app.schemas import (
    UserResponse,
    UserSummaryResponse,
    AdminUpdateUserRequest,
)
from app.schemas.user import AdminUserSummaryResponse, BookingHistoryItem
from app.schemas.penalty import PenaltyResponse
from app.schemas.rating import RatingResponse
from app.schemas.common import PaginatedResponse, PaginatedResponseMeta

router = APIRouter()


@router.get("/users", response_model=PaginatedResponse[UserSummaryResponse])
async def admin_list_users(
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    q: str | None = Query(default=None, description="Search query"),
    status: UserStatus | None = None,
):
    """Admin list of users."""
    query = select(User).options(selectinload(User.bookings))

    if q:
        query = query.where(
            User.full_name.ilike(f"%{q}%") |
            User.email.ilike(f"%{q}%") |
            User.student_id.ilike(f"%{q}%")
        )
    if status:
        query = query.where(User.status == status)

    query = query.order_by(User.joined_at.desc())

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    # Build response with computed fields
    user_summaries = []
    for user in users:
        # Calculate average rating
        rating_result = await db.execute(
            select(func.avg(UserRating.rating)).where(UserRating.rated_user_id == user.id)
        )
        avg_rating = rating_result.scalar()

        user_summaries.append(UserSummaryResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            student_id=user.student_id,
            department=user.department,
            profile_image_url=user.profile_image_url,
            status=user.status,
            total_bookings=len(user.bookings) if user.bookings else 0,
            average_rating=float(avg_rating) if avg_rating else None,
        ))

    return PaginatedResponse(
        data=user_summaries,
        meta=PaginatedResponseMeta(total=total, limit=limit, offset=offset)
    )


@router.get("/users/{user_id}", response_model=UserResponse)
async def admin_get_user(
    user_id: int,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Get full user details by admin."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundException(detail="User not found")

    return UserResponse.model_validate(user)


@router.patch("/users/{user_id}", response_model=UserResponse)
async def admin_update_user(
    user_id: int,
    request: AdminUpdateUserRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Update user (role/status) by admin."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundException(detail="User not found")

    # Prevent admin from modifying their own status or role
    if user.id == current_user.id:
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException(detail="Cannot modify your own account status or role")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.flush()
    await db.refresh(user)

    return UserResponse.model_validate(user)


@router.get("/users/{user_id}/summary", response_model=AdminUserSummaryResponse)
async def admin_get_user_summary(
    user_id: int,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Get user with booking history, penalties and ratings."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundException(detail="User not found")

    # Get booking history (completed, cancelled, no_show)
    booking_result = await db.execute(
        select(Booking)
        .where(
            Booking.user_id == user_id,
            Booking.status.in_([
                BookingStatus.COMPLETED,
                BookingStatus.CANCELLED,
                BookingStatus.NO_SHOW
            ])
        )
        .options(selectinload(Booking.space))
        .order_by(Booking.booking_date.desc())
        .limit(50)
    )
    bookings = booking_result.scalars().all()

    booking_history = [
        BookingHistoryItem(
            id=b.id,
            space_name=b.space.name if b.space else "Unknown",
            date=str(b.booking_date),
            time=f"{b.start_time.strftime('%H:%M')} - {b.end_time.strftime('%H:%M')}",
            status=b.status.value,
        )
        for b in bookings
    ]

    # Get penalties
    penalty_result = await db.execute(
        select(UserPenalty)
        .where(UserPenalty.user_id == user_id)
        .order_by(UserPenalty.created_at.desc())
    )
    penalties = penalty_result.scalars().all()

    # Get ratings
    rating_result = await db.execute(
        select(UserRating)
        .where(UserRating.rated_user_id == user_id)
        .order_by(UserRating.created_at.desc())
    )
    ratings = rating_result.scalars().all()

    return AdminUserSummaryResponse(
        user=UserResponse.model_validate(user),
        booking_history=booking_history,
        penalties=[PenaltyResponse.model_validate(p) for p in penalties],
        ratings=[RatingResponse.model_validate(r) for r in ratings],
    )
