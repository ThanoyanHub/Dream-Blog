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
    """User roles"""
    ADMIN = "admin"
    USER = "user"


class PostStatusEnum(str, enum.Enum):
    """Post status"""
    DRAFT = "draft"
    PUBLISHED = "published"
