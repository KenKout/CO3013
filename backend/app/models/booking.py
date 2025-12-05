from datetime import datetime, timezone, date, time
from typing import List, Optional

import sqlalchemy as sa
from sqlalchemy import (
    BigInteger,
    Integer,
    Date,
    Time,
    Text,
    ForeignKey,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from app.core.database import Base
from app.models.enums import BookingStatus


class Booking(Base):
    __tablename__ = "bookings"

    # Primary key
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # Foreign keys
    user_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False
    )
    space_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("spaces.id", ondelete="RESTRICT"),
        nullable=False
    )

    # Booking details
    booking_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    status: Mapped[BookingStatus] = mapped_column(default=BookingStatus.PENDING, nullable=False)
    attendees: Mapped[int] = mapped_column(Integer, nullable=False)
    purpose: Mapped[str] = mapped_column(Text, nullable=False)

    # Request tracking
    requested_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Approval tracking
    approved_by: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=True
    )
    approved_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True), nullable=True)

    # Cancellation tracking
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True), nullable=True)
    cancellation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Check-in/out tracking
    check_in_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True), nullable=True)
    check_out_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True), nullable=True)

    #IOT session ID
    iot_session_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="bookings",
        foreign_keys=[user_id],
        lazy="selectin"
    )

    space: Mapped["Space"] = relationship(
        "Space",
        back_populates="bookings",
        lazy="selectin"
    )

    approver: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="approved_bookings",
        foreign_keys=[approved_by],
        lazy="select"
    )

    penalties: Mapped[List["UserPenalty"]] = relationship(
        "UserPenalty",
        back_populates="booking",
        lazy="select"
    )

    ratings: Mapped[List["UserRating"]] = relationship(
        "UserRating",
        back_populates="booking",
        lazy="select"
    )

    # Table constraints
    __table_args__ = (
        CheckConstraint("end_time > start_time", name="check_end_after_start"),
        CheckConstraint("attendees > 0", name="check_attendees_positive"),
        Index("idx_booking_user_id", "user_id"),
        Index("idx_booking_space_id", "space_id"),
        Index("idx_booking_date_status", "booking_date", "status"),
        Index("idx_booking_datetime", "booking_date", "start_time", "end_time"),
    )

    # Validators
    @validates("end_time")
    def validate_end_time(self, key: str, value: time) -> time:
        if hasattr(self, "start_time") and self.start_time and value <= self.start_time:
            raise ValueError("End time must be after start time")
        return value

    @validates("attendees")
    def validate_attendees(self, key: str, value: int) -> int:
        if value <= 0:
            raise ValueError("Attendees must be positive")
        return value

    @validates("check_out_at")
    def validate_check_out(self, key: str, value: Optional[datetime]) -> Optional[datetime]:
        if value and self.check_in_at and value <= self.check_in_at:
            raise ValueError("Check-out time must be after check-in time")
        return value