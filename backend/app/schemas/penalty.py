from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import PenaltyStatus


class PenaltyResponse(BaseModel):
    """Penalty response schema."""
    id: int
    user_id: int
    booking_id: int | None = None
    reason: str
    points: int
    status: PenaltyStatus
    created_at: datetime
    created_by: int | None = None

    model_config = {"from_attributes": True}


class AddPenaltyRequest(BaseModel):
    """Request schema for adding a penalty."""
    user_id: int
    booking_id: int | None = None
    reason: str = Field(min_length=1)
    points: int = Field(ge=1, le=50)


class UpdatePenaltyRequest(BaseModel):
    """Request schema for updating a penalty."""
    reason: str | None = Field(default=None, min_length=1)
    points: int | None = Field(default=None, ge=1, le=50)
    status: PenaltyStatus | None = None
