"""
Post Controller - HTTP endpoints for posts
"""
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.middleware.auth import get_current_user, get_optional_user
from app.services.post_service import PostService
from app.schemas.schemas import PostCreate, PostUpdate, PostResponse, PostDetailResponse
from app.models.models import PostStatusEnum, Post

router = APIRouter(prefix="/api/posts", tags=["Posts"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new post"""
    post_service = PostService(db)
    post = post_service.create_post(
        title=post_data.title,
        content=post_data.content,
        author=current_user,
        category_id=post_data.category_id,
        excerpt=post_data.excerpt,
        status=post_data.status
    )
    return {"message": "Post created successfully", "post": post}


@router.get("", response_model=dict)
async def get_posts(
    category_id: int | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get published posts"""
    post_service = PostService(db)
    if category_id:
        posts = post_service.post_repo.get_posts_by_category(category_id, skip, limit)
        total = db.query(Post).filter(Post.category_id == category_id, Post.status == PostStatusEnum.PUBLISHED).count()
        return {
            "items": [PostResponse.from_orm(p) for p in posts],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
    return post_service.get_published_posts(skip, limit)


@router.get("/search", response_model=dict)
async def search_posts(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search posts"""
    post_service = PostService(db)
    return post_service.search_posts(q, skip, limit)


@router.get("/my-posts", response_model=dict)
async def get_my_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get posts by current user"""
    post_service = PostService(db)
    return post_service.get_user_posts(current_user.id, skip, limit)


@router.get("/{post_id}", response_model=PostDetailResponse)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get post by ID"""
    post_service = PostService(db)
    return post_service.get_post(post_id)


@router.put("/{post_id}", response_model=dict)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update post"""
    post_service = PostService(db)
    update_dict = post_data.dict(exclude_unset=True)
    post = post_service.update_post(post_id, current_user, **update_dict)
    return {"message": "Post updated successfully", "post": post}


@router.delete("/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete post"""
    post_service = PostService(db)
    post_service.delete_post(post_id, current_user)
    return {"message": "Post deleted successfully"}


@router.post("/{post_id}/like", status_code=status.HTTP_200_OK)
async def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Like a post"""
    post_service = PostService(db)
    post_service.like_post(post_id, current_user)
    return {"message": "Post liked"}


@router.post("/{post_id}/unlike", status_code=status.HTTP_200_OK)
async def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Unlike a post"""
    post_service = PostService(db)
    post_service.unlike_post(post_id, current_user)
    return {"message": "Post unliked"}


