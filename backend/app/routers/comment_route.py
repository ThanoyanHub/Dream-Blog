from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.middleware.auth import get_current_user
from app.services.comment_service import CommentService
from app.schemas.schemas import CommentCreate, CommentUpdate, CommentResponse

router = APIRouter(prefix="/api/comments", tags=["Comments"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_data: CommentCreate,
    post_id: int = Query(..., gt=0),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new comment"""
    comment_service = CommentService(db)
    comment = comment_service.create_comment(
        content=comment_data.content,
        post_id=post_id,
        author=current_user
    )
    return {"message": "Comment created successfully", "comment": comment}


@router.get("/{comment_id}", response_model=CommentResponse)
async def get_comment(
    comment_id: int,
    db: Session = Depends(get_db)
):
    """Get comment by ID"""
    comment_service = CommentService(db)
    return comment_service.get_comment(comment_id)


@router.put("/{comment_id}", response_model=dict)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update comment"""
    comment_service = CommentService(db)
    comment = comment_service.update_comment(comment_id, comment_data.content, current_user)
    return {"message": "Comment updated successfully", "comment": comment}


@router.delete("/{comment_id}", status_code=status.HTTP_200_OK)
async def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete comment"""
    comment_service = CommentService(db)
    comment_service.delete_comment(comment_id, current_user)
    return {"message": "Comment deleted successfully"}


@router.get("/post/{post_id}", response_model=dict)
async def get_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get comments for a post"""
    comment_service = CommentService(db)
    return comment_service.get_post_comments(post_id, skip, limit)
