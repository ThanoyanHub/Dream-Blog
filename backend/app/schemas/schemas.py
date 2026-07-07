from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from app.models.models import RoleEnum, PostStatusEnum


class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    """User update schema"""
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    """User response schema"""
    id: int
    role: RoleEnum
    is_active: bool
    bio: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserDetailResponse(UserResponse):
    """Detailed user response with posts count"""
    posts_count: int = 0


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema"""
    refresh_token: str


class CategoryBase(BaseModel):
    """Base category schema"""
    name: str = Field(..., min_length=1, max_length=50)
    slug: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    """Category creation schema"""
    pass


class CategoryUpdate(BaseModel):
    """Category update schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    slug: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    """Category response schema"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    """Base comment schema"""
    content: str = Field(..., min_length=1, max_length=1000)


class CommentCreate(CommentBase):
    """Comment creation schema"""
    pass


class CommentUpdate(BaseModel):
    """Comment update schema"""
    content: str = Field(..., min_length=1, max_length=1000)


class CommentResponse(CommentBase):
    """Comment response schema"""
    id: int
    author_id: int
    post_id: int
    author: UserResponse
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PostBase(BaseModel):
    """Base post schema"""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    excerpt: Optional[str] = None
    category_id: Optional[int] = None


class PostCreate(PostBase):
    """Post creation schema"""
    status: PostStatusEnum = PostStatusEnum.DRAFT


class PostUpdate(BaseModel):
    """Post update schema"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    status: Optional[PostStatusEnum] = None
    category_id: Optional[int] = None


class PostResponse(PostBase):
    """Post response schema"""
    id: int
    slug: str
    status: PostStatusEnum
    author_id: int
    author: UserResponse
    category: Optional[CategoryResponse]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PostDetailResponse(PostResponse):
    """Detailed post response with comments"""
    comments: List[CommentResponse] = []
    likes_count: int = 0
    is_liked: bool = False


class PostListResponse(BaseModel):
    """Post list response with pagination"""
    items: List[PostResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    
    
class DashboardStats(BaseModel):
    """Dashboard statistics schema"""
    total_users: int
    total_posts: int
    total_comments: int
    total_categories: int
    published_posts: int
    draft_posts: int


class RecentActivity(BaseModel):
    """Recent activity schema"""
    id: int
    activity_type: str  # "post_created", "comment_added", "user_registered"
    description: str
    created_at: datetime


class DashboardResponse(BaseModel):
    """Dashboard response schema"""
    stats: DashboardStats
    recent_activities: List[RecentActivity]
