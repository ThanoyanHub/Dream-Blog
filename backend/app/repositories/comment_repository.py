from sqlalchemy.orm import Session
from app.models.models import Comment


class CommentRepository:
    """Repository for Comment model operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_comment_by_id(self, comment_id: int) -> Comment | None:
        """Get comment by ID"""
        return self.db.query(Comment).filter(Comment.id == comment_id).first()
    
    def get_comments_by_post(self, post_id: int, skip: int = 0, limit: int = 10) -> list[Comment]:
        """Get comments for a post"""
        return self.db.query(Comment).filter(
            Comment.post_id == post_id
        ).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_comments_by_author(self, author_id: int, skip: int = 0, limit: int = 10) -> list[Comment]:
        """Get comments by author"""
        return self.db.query(Comment).filter(
            Comment.author_id == author_id
        ).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_all_comments(self, skip: int = 0, limit: int = 10) -> list[Comment]:
        """Get all comments"""
        return self.db.query(Comment).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_comments_count(self, post_id: int | None = None) -> int:
        """Get total comments count"""
        query = self.db.query(Comment)
        if post_id:
            query = query.filter(Comment.post_id == post_id)
        return query.count()
    
    def create_comment(self, content: str, author_id: int, post_id: int) -> Comment:
        """Create a new comment"""
        comment = Comment(
            content=content,
            author_id=author_id,
            post_id=post_id
        )
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment
    
    def update_comment(self, comment_id: int, **kwargs) -> Comment | None:
        """Update comment"""
        comment = self.get_comment_by_id(comment_id)
        if not comment:
            return None
        
        for key, value in kwargs.items():
            if value is not None and hasattr(comment, key):
                setattr(comment, key, value)
        
        self.db.commit()
        self.db.refresh(comment)
        return comment
    
    def delete_comment(self, comment_id: int) -> bool:
        """Delete comment"""
        comment = self.get_comment_by_id(comment_id)
        if not comment:
            return False
        
        self.db.delete(comment)
        self.db.commit()
        return True
