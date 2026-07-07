from sqlalchemy.orm import Session
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository
from app.utils.exceptions import NotFoundException, ForbiddenException
from app.schemas.schemas import CommentResponse
from app.models.models import User


class CommentService:
    """Service for comment operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.comment_repo = CommentRepository(db)
        self.post_repo = PostRepository(db)
    
    def create_comment(self, content: str, post_id: int, author: User) -> CommentResponse:
        """Create a new comment"""
        # Verify post exists
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        # Create comment
        comment = self.comment_repo.create_comment(content, author.id, post_id)
        return CommentResponse.from_orm(comment)
    
    def get_comment(self, comment_id: int) -> CommentResponse:
        """Get comment by ID"""
        comment = self.comment_repo.get_comment_by_id(comment_id)
        if not comment:
            raise NotFoundException("Comment not found")
        
        return CommentResponse.from_orm(comment)
    
    def update_comment(self, comment_id: int, content: str, current_user: User) -> CommentResponse:
        """Update comment"""
        comment = self.comment_repo.get_comment_by_id(comment_id)
        if not comment:
            raise NotFoundException("Comment not found")
        
        # Check authorization
        if comment.author_id != current_user.id and current_user.role.value != "admin":
            raise ForbiddenException("You don't have permission to update this comment")
        
        # Update comment
        updated_comment = self.comment_repo.update_comment(comment_id, content=content)
        return CommentResponse.from_orm(updated_comment)
    
    def delete_comment(self, comment_id: int, current_user: User) -> bool:
        """Delete comment"""
        comment = self.comment_repo.get_comment_by_id(comment_id)
        if not comment:
            raise NotFoundException("Comment not found")
        
        # Check authorization
        if comment.author_id != current_user.id and current_user.role.value != "admin":
            raise ForbiddenException("You don't have permission to delete this comment")
        
        return self.comment_repo.delete_comment(comment_id)
    
    def get_post_comments(self, post_id: int, skip: int = 0, limit: int = 10):
        """Get comments for a post"""
        # Verify post exists
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        comments = self.comment_repo.get_comments_by_post(post_id, skip, limit)
        total = self.comment_repo.get_comments_count(post_id)
        
        return {
            "items": [CommentResponse.from_orm(c) for c in comments],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
