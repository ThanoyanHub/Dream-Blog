"""
Authentication Controller - HTTP endpoints for authentication
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.auth_service import AuthService
from app.schemas.schemas import UserCreate, LoginRequest, TokenResponse, RefreshTokenRequest
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    auth_service = AuthService(db)
    user = auth_service.register(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name
    )
    return {"message": "User registered successfully", "user": user}


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Login user"""
    auth_service = AuthService(db)
    return auth_service.login(credentials.email, credentials.password)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token"""
    auth_service = AuthService(db)
    return auth_service.refresh_access_token(request.refresh_token)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user = Depends(get_current_user)):
    """Logout user"""
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=dict)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "avatar_url": current_user.avatar_url,
        "bio": current_user.bio,
        "created_at": current_user.created_at
    }
