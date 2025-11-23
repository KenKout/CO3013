from fastapi import APIRouter

from app.routes import auth, spaces, utilities, bookings, penalties, ratings, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(spaces.router, prefix="/spaces", tags=["Spaces"])
api_router.include_router(utilities.router, prefix="/utilities", tags=["Utilities"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(penalties.router, prefix="/penalties", tags=["Penalties"])
api_router.include_router(ratings.router, prefix="/ratings", tags=["Ratings"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
