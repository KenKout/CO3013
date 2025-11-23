from datetime import datetime, timezone
from typing import Optional

import sqlalchemy as sa
from sqlalchemy import (
    BigInteger,
    SmallInteger,
    Text,
    ForeignKey,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from app.core.database import Base


class UserRating(Base):
    __tablename__ = "user_ratings"

    # Primary key
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # Foreign keys
    rated_user_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False
    )
    booking_id: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        ForeignKey("bookings.id", ondelete="SET NULL"),
        nullable=True
    )
    created_by: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=True
    )

    # Rating details
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    rated_user: Mapped["User"] = relationship(
        "User",
        back_populates="ratings_received",
        foreign_keys=[rated_user_id],
        lazy="selectin"
    )

    booking: Mapped[Optional["Booking"]] = relationship(
        "Booking",
        back_populates="ratings",
        lazy="select"
    )

    creator: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="ratings_given",
        foreign_keys=[created_by],
        lazy="select"
    )

    # Table constraints
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
        Index("idx_rating_user_id", "rated_user_id"),
    )

    # Validators
    @validates("rating")
    def validate_rating(self, key: str, value: int) -> int:
        if value < 1 or value > 5:
            raise ValueError("Rating must be between 1 and 5")
        return value