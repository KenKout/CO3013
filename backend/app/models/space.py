from datetime import datetime, timezone
from typing import List, Optional

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
from app.models.enums import SpaceStatus


class Space(Base):
    __tablename__ = "spaces"

    # Primary key
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # Basic information
    name: Mapped[str] = mapped_column(Text, nullable=False)
    building: Mapped[str] = mapped_column(Text, nullable=False)
    floor: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Status
    status: Mapped[SpaceStatus] = mapped_column(default=SpaceStatus.ACTIVE, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking",
        back_populates="space",
        lazy="select"
    )

    space_utilities: Mapped[List["SpaceUtility"]] = relationship(
        "SpaceUtility",
        back_populates="space",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    utilities: Mapped[List["Utility"]] = relationship(
        "Utility",
        secondary="space_utilities",
        back_populates="spaces",
        lazy="selectin",
        viewonly=True
    )

    # Table constraints
    __table_args__ = (
        CheckConstraint("capacity > 0", name="check_capacity_positive"),
        Index("idx_space_status", "status"),
        Index("idx_space_building_floor", "building", "floor"),
    )

    # Validators
    @validates("capacity")
    def validate_capacity(self, key: str, value: int) -> int:
        if value <= 0:
            raise ValueError("Capacity must be positive")
        return value


class Utility(Base):
    __tablename__ = "utilities"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Fields
    key: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    label: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    space_utilities: Mapped[List["SpaceUtility"]] = relationship(
        "SpaceUtility",
        back_populates="utility",
        cascade="all, delete-orphan",
        lazy="select"
    )

    spaces: Mapped[List["Space"]] = relationship(
        "Space",
        secondary="space_utilities",
        back_populates="utilities",
        lazy="select",
        viewonly=True
    )

    # Table constraints
    __table_args__ = (
        Index("idx_utility_key", "key"),
    )


class SpaceUtility(Base):
    __tablename__ = "space_utilities"

    # Composite primary key
    space_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("spaces.id", ondelete="CASCADE"),
        primary_key=True
    )
    utility_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("utilities.id", ondelete="CASCADE"),
        primary_key=True
    )

    # Relationships
    space: Mapped["Space"] = relationship(
        "Space",
        back_populates="space_utilities"
    )

    utility: Mapped["Utility"] = relationship(
        "Utility",
        back_populates="space_utilities"
    )