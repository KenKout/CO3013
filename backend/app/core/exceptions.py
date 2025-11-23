from fastapi import HTTPException, status


class BadRequestException(HTTPException):
    def __init__(self, detail: str = "Bad request", code: str = "BAD_REQUEST"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": code, "message": detail}
        )


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Not authenticated", code: str = "UNAUTHORIZED"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": code, "message": detail},
            headers={"WWW-Authenticate": "Bearer"}
        )


class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "Forbidden", code: str = "FORBIDDEN"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": code, "message": detail}
        )


class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Resource not found", code: str = "NOT_FOUND"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": code, "message": detail}
        )


class ConflictException(HTTPException):
    def __init__(self, detail: str = "Resource already exists", code: str = "CONFLICT"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": code, "message": detail}
        )
