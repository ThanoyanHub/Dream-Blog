"""
Authentication Service - Business logic for authentication
"""
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.utils.exceptions import UnauthorizedException, ConflictException
from app.schemas.schemas import UserResponse, TokenResponse
from app.models.models import User


class AuthService:
    """Service for authentication operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
    
    def register(self, username: str, email: str, password: str, full_name: str | None = None) -> UserResponse:
        """Register a new user"""
        # Check if user already exists
        if self.user_repo.get_user_by_email(email):
            raise ConflictException("Email already registered")
        
        if self.user_repo.get_user_by_username(username):
            raise ConflictException("Username already taken")
        
        # Create user
        user = self.user_repo.create_user(username, email, password, full_name)
        return UserResponse.from_orm(user)
    
    def login(self, email: str, password: str) -> TokenResponse:
        """Authenticate user and return tokens"""
        user = self.user_repo.get_user_by_email(email)
        
        if not user or not verify_password(password, user.password_hash):
            raise UnauthorizedException("Invalid email or password")
        
        if not user.is_active:
            raise UnauthorizedException("User account is inactive")
        
        # Create tokens
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.from_orm(user)
        )
    
    def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """Generate new access token from refresh token"""
        payload = decode_token(refresh_token)
        
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token")
        
        user_id = payload.get("sub")
        user = self.user_repo.get_user_by_id(int(user_id))
        
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")
        
        # Create new access token
        access_token = create_access_token({"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.from_orm(user)
        )
    
    def verify_token(self, token: str) -> dict | None:
        """Verify and decode token"""
        return decode_token(token)
