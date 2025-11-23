import re
from datetime import datetime, timezone
from typing import List, Optional

import sqlalchemy as sa
from sqlalchemy import (
    BigInteger,
    SmallInteger,
    Text,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy.dialects.postgresql import CITEXT

from app.core.database import Base
from app.models.enums import UserRole, UserStatus


class User(Base):
    __tablename__ = "users"

    # Primary key
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # Enum fields
    role: Mapped[UserRole] = mapped_column(default=UserRole.STUDENT, nullable=False)
    status: Mapped[UserStatus] = mapped_column(default=UserStatus.ACTIVE, nullable=False)

    # Authentication fields
    email: Mapped[str] = mapped_column(CITEXT, nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)

    # Personal information
    full_name: Mapped[str] = mapped_column(Text, nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    student_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True, unique=True)
    department: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    year_of_study: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    profile_image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Timestamps
    joined_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking",
        back_populates="user",
        foreign_keys="Booking.user_id",
        lazy="selectin"
    )

    approved_bookings: Mapped[List["Booking"]] = relationship(
        "Booking",
        back_populates="approver",
        foreign_keys="Booking.approved_by",
        lazy="select"
    )

    penalties: Mapped[List["UserPenalty"]] = relationship(
        "UserPenalty",
        back_populates="user",
        foreign_keys="UserPenalty.user_id",
        lazy="select"
    )

    ratings_received: Mapped[List["UserRating"]] = relationship(
        "UserRating",
        back_populates="rated_user",
        foreign_keys="UserRating.rated_user_id",
        lazy="select"
    )

    penalties_created: Mapped[List["UserPenalty"]] = relationship(
        "UserPenalty",
        back_populates="creator",
        foreign_keys="UserPenalty.created_by",
        lazy="select"
    )

    ratings_given: Mapped[List["UserRating"]] = relationship(
        "UserRating",
        back_populates="creator",
        foreign_keys="UserRating.created_by",
        lazy="select"
    )

    # Table constraints
    __table_args__ = (
        CheckConstraint(
            "year_of_study IS NULL OR (year_of_study >= 1 AND year_of_study <= 7)",
            name="check_year_of_study_range"
        ),
        Index("idx_user_email", "email"),
        Index("idx_user_student_id", "student_id"),
        Index("idx_user_role_status", "role", "status"),
    )

    # Validators
    @validates("email")
    def validate_email(self, key: str, value: str) -> str:
        if not value:
            raise ValueError("Email is required")
        
        # Basic email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise ValueError("Invalid email format")
        
        # Convert to lowercase
        return value.lower()

    @validates("student_id")
    def validate_student_id(self, key: str, value: Optional[str]) -> Optional[str]:
        # Student ID is required for students
        if self.role == UserRole.STUDENT and not value:
            raise ValueError("Student ID is required for students")
        return value

    @validates("year_of_study")
    def validate_year_of_study(self, key: str, value: Optional[int]) -> Optional[int]:
        if value is not None and (value < 1 or value > 7):
            raise ValueError("Year of study must be between 1 and 7")
        return value