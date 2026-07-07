from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship
from app.database.database import Base
import enum

def utcnow():
    """Returns naive UTC datetime, replacing deprecated datetime.utcnow"""
    return datetime.now(timezone.utc).replace(tzinfo=None)


# Association table for likes
post_likes = Table(
    'post_likes',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('post_id', Integer, ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True)
)



class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class PostStatusEnum(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)
    

    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    liked_posts = relationship("Post", secondary=post_likes, back_populates="liked_by")
