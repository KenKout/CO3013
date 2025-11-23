from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    """Request schema for user registration."""
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1)
    student_id: str | None = None
    department: str | None = None
    year_of_study: int | None = Field(default=None, ge=1, le=7)


class LoginRequest(BaseModel):
    """Request schema for user login."""
    email: EmailStr
    password: str


class AuthTokenResponse(BaseModel):
    """Response schema for authentication (login/register)."""
    token: str
    user: UserResponse
