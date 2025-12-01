from datetime import datetime

from pydantic import BaseModel, Field


class RatingResponse(BaseModel):
    """Rating response schema."""
    id: int
    rated_user_id: int
    booking_id: int | None = None
    rating: int
    comment: str | None = None
    created_at: datetime
    created_by: int | None = None

    model_config = {"from_attributes": True}


class AddRatingRequest(BaseModel):
    """Request schema for adding a rating."""
    rated_user_id: int
    booking_id: int | None = None
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class UpdateRatingRequest(BaseModel):
    """Request schema for updating a rating."""
    rating: int = Field(ge=1, le=5)
    comment: str | None = None
