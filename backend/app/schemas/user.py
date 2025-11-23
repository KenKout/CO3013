from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import BaseModel, EmailStr, Field, HttpUrl

from app.models.enums import UserRole, UserStatus

if TYPE_CHECKING:
    from app.schemas.booking import BookingHistoryItem
    from app.schemas.penalty import PenaltyResponse
    from app.schemas.rating import RatingResponse


class UserResponse(BaseModel):
    """Full user response schema."""
    id: int
    role: UserRole
    status: UserStatus
    email: EmailStr
    full_name: str
    first_name: str | None = None
    last_name: str | None = None
    student_id: str | None = None
    department: str | None = None
    year_of_study: int | None = None
    phone: str | None = None
    profile_image_url: str | None = None
    joined_at: datetime

    model_config = {"from_attributes": True}


class UserSummaryResponse(BaseModel):
    """Lightweight user summary for lists."""
    id: int
    full_name: str
    email: EmailStr
    student_id: str | None = None
    department: str | None = None
    profile_image_url: str | None = None
    status: UserStatus
    total_bookings: int = 0
    average_rating: float | None = None

    model_config = {"from_attributes": True}


class UpdateUserProfileRequest(BaseModel):
    """Request schema for updating user profile."""
    full_name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    department: str | None = None
    year_of_study: int | None = Field(default=None, ge=1, le=7)
    phone: str | None = None
    profile_image_url: str | None = None


class AdminUpdateUserRequest(BaseModel):
    """Request schema for admin to update user."""
    role: UserRole | None = None
    status: UserStatus | None = None


class BookingHistoryItem(BaseModel):
    """Booking history item for admin user summary."""
    id: int
    space_name: str
    date: str
    time: str
    status: str

    model_config = {"from_attributes": True}


class AdminUserSummaryResponse(BaseModel):
    """Aggregated user info for admin details view."""
    user: UserResponse
    booking_history: list[BookingHistoryItem] = []
    penalties: list["PenaltyResponse"] = []
    ratings: list["RatingResponse"] = []


# Avoid circular import
from app.schemas.penalty import PenaltyResponse
from app.schemas.rating import RatingResponse
AdminUserSummaryResponse.model_rebuild()
