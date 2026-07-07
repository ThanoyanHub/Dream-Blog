from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.middleware.auth import get_current_admin
from app.models.models import User, Post, Comment, Category, PostStatusEnum
from app.schemas.schemas import DashboardStats, DashboardResponse, UserResponse

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
  
    total_users = db.query(func.count(User.id)).scalar()
    total_posts = db.query(func.count(Post.id)).scalar()
    total_comments = db.query(func.count(Comment.id)).scalar()
    total_categories = db.query(func.count(Category.id)).scalar()
    published_posts = db.query(func.count(Post.id)).filter(Post.status == PostStatusEnum.PUBLISHED).scalar()
    draft_posts = db.query(func.count(Post.id)).filter(Post.status == PostStatusEnum.DRAFT).scalar()
    
    stats = DashboardStats(
        total_users=total_users or 0,
        total_posts=total_posts or 0,
        total_comments=total_comments or 0,
        total_categories=total_categories or 0,
        published_posts=published_posts or 0,
        draft_posts=draft_posts or 0
    )
    
    return {
        "stats": stats,
        "message": "Dashboard data retrieved successfully"
    }


@router.get("/users", response_model=dict)
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(func.count(User.id)).scalar()
    
    return {
        "items": [UserResponse.from_orm(u) for u in users],
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "total_pages": (total + limit - 1) // limit
    }


@router.get("/users/{user_id}", response_model=dict)
async def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    user_posts = db.query(func.count(Post.id)).filter(Post.author_id == user_id).scalar()
    user_comments = db.query(func.count(Comment.id)).filter(Comment.author_id == user_id).scalar()
    
    return {
        "user": UserResponse.from_orm(user),
        "posts_count": user_posts,
        "comments_count": user_comments
    }


@router.put("/users/{user_id}/deactivate", status_code=status.HTTP_200_OK)
async def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    user.is_active = False
    db.commit()
    
    return {"message": "User deactivated successfully"}


@router.put("/users/{user_id}/activate", status_code=status.HTTP_200_OK)
async def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    user.is_active = True
    db.commit()
    
    return {"message": "User activated successfully"}


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}


@router.get("/posts", response_model=dict)
async def get_all_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):

    posts = db.query(Post).offset(skip).limit(limit).all()
    total = db.query(func.count(Post.id)).scalar()
    
    return {
        "items": [{"id": p.id, "title": p.title, "author": p.author.username, "status": p.status, "created_at": p.created_at} for p in posts],
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "total_pages": (total + limit - 1) // limit
    }


@router.delete("/posts/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post_admin(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return {"error": "Post not found"}
    
    db.delete(post)
    db.commit()
    
    return {"message": "Post deleted successfully"}
