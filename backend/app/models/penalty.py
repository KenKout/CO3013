from datetime import datetime, timezone
from typing import Optional

import sqlalchemy as sa
from sqlalchemy import (
    BigInteger,
    Integer,
    Text,
    ForeignKey,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from app.core.database import Base
from app.models.enums import PenaltyStatus


class UserPenalty(Base):
    __tablename__ = "user_penalties"

    # Primary key
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # Foreign keys
    user_id: Mapped[int] = mapped_column(
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

    # Penalty details
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[PenaltyStatus] = mapped_column(default=PenaltyStatus.ACTIVE, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="penalties",
        foreign_keys=[user_id],
        lazy="selectin"
    )

    booking: Mapped[Optional["Booking"]] = relationship(
        "Booking",
        back_populates="penalties",
        lazy="select"
    )

    creator: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="penalties_created",
        foreign_keys=[created_by],
        lazy="select"
    )

    # Table constraints
    __table_args__ = (
        CheckConstraint("points > 0", name="check_points_positive"),
        Index("idx_penalty_user_id", "user_id"),
        Index("idx_penalty_status", "status"),
    )

    # Validators
    @validates("points")
    def validate_points(self, key: str, value: int) -> int:
        if value <= 0:
            raise ValueError("Points must be positive")
        return value