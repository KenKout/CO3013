from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiError(BaseModel):
    """Standard API error response."""
    code: str
    message: str
    details: dict[str, Any] | None = None


class PaginatedResponseMeta(BaseModel):
    """Pagination metadata."""
    total: int
    limit: int
    offset: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response."""
    data: list[T]
    meta: PaginatedResponseMeta


class PaginationParams(BaseModel):
    """Pagination query parameters."""
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)
