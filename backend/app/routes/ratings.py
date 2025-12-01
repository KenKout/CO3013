from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_async_db
from app.core.exceptions import NotFoundException, BadRequestException
from app.dependencies import get_current_admin_user
from app.models import UserRating, User, Booking, BookingStatus
from app.schemas import (
    RatingResponse,
    AddRatingRequest,
    UpdateRatingRequest,
)
from app.schemas.common import PaginatedResponse, PaginatedResponseMeta

router = APIRouter()


@router.get("", response_model=PaginatedResponse[RatingResponse])
async def list_ratings(
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    q: str | None = Query(default=None, description="Search query"),
    rated_user_id: int | None = Query(default=None, alias="ratedUserId"),
):
    """List user ratings (admin only)."""
    query = select(UserRating)

    if q:
        query = query.where(UserRating.comment.ilike(f"%{q}%"))
    if rated_user_id:
        query = query.where(UserRating.rated_user_id == rated_user_id)

    query = query.order_by(UserRating.created_at.desc())

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    ratings = result.scalars().all()

    return PaginatedResponse(
        data=[RatingResponse.model_validate(r) for r in ratings],
        meta=PaginatedResponseMeta(total=total, limit=limit, offset=offset)
    )


@router.post("", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
async def add_rating(
    request: AddRatingRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Add a rating for a user (admin only)."""
    # Verify user exists
    user_result = await db.execute(select(User).where(User.id == request.rated_user_id))
    if not user_result.scalar_one_or_none():
        raise NotFoundException(detail="User not found")

    # Verify booking exists if provided and check for duplicate ratings
    if request.booking_id:
        booking_result = await db.execute(select(Booking).where(Booking.id == request.booking_id))
        booking = booking_result.scalar_one_or_none()
        if not booking:
            raise NotFoundException(detail="Booking not found")
        
        # Verify the booking belongs to the user being rated
        if booking.user_id != request.rated_user_id:
            raise BadRequestException(detail="Booking does not belong to the user being rated")

        # Verify the booking is completed
        if booking.status != BookingStatus.COMPLETED:
            raise BadRequestException(detail="Can only rate completed bookings")

        # Check if a rating already exists for this booking
        existing_rating = await db.execute(
            select(UserRating).where(UserRating.booking_id == request.booking_id)
        )
        if existing_rating.scalar_one_or_none():
            raise BadRequestException(detail="A rating already exists for this booking")

    rating = UserRating(
        rated_user_id=request.rated_user_id,
        booking_id=request.booking_id,
        rating=request.rating,
        comment=request.comment,
        created_by=current_user.id,
    )

    db.add(rating)
    await db.flush()
    await db.refresh(rating)

    return RatingResponse.model_validate(rating)


@router.patch("/{rating_id}", response_model=RatingResponse)
async def update_rating(
    rating_id: int,
    request: UpdateRatingRequest,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Update a rating (admin only)."""
    result = await db.execute(select(UserRating).where(UserRating.id == rating_id))
    rating = result.scalar_one_or_none()

    if not rating:
        raise NotFoundException(detail="Rating not found")

    # Update rating fields
    rating.rating = request.rating
    rating.comment = request.comment

    await db.flush()
    await db.refresh(rating)

    return RatingResponse.model_validate(rating)


@router.delete("/{rating_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rating(
    rating_id: int,
    current_user: Annotated[User, Depends(get_current_admin_user)],
    db: Annotated[AsyncSession, Depends(get_async_db)]
):
    """Delete a rating (admin only)."""
    result = await db.execute(select(UserRating).where(UserRating.id == rating_id))
    rating = result.scalar_one_or_none()

    if not rating:
        raise NotFoundException(detail="Rating not found")

    await db.delete(rating)
    await db.flush()
