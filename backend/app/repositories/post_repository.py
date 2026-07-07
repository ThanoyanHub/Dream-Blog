from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.models import Post, PostStatusEnum
from datetime import datetime, timezone


class PostRepository:
    """Repository for Post model operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_post_by_id(self, post_id: int) -> Post | None:
        """Get post by ID"""
        return self.db.query(Post).filter(Post.id == post_id).first()
    
    def get_post_by_slug(self, slug: str) -> Post | None:
        """Get post by slug"""
        return self.db.query(Post).filter(Post.slug == slug).first()
    
    def get_posts_by_author(self, author_id: int, skip: int = 0, limit: int = 10) -> list[Post]:
        """Get posts by author"""
        return self.db.query(Post).filter(
            Post.author_id == author_id
        ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_published_posts(self, skip: int = 0, limit: int = 10) -> list[Post]:
        """Get all published posts"""
        return self.db.query(Post).filter(
            Post.status == PostStatusEnum.PUBLISHED
        ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_posts_by_category(self, category_id: int, skip: int = 0, limit: int = 10) -> list[Post]:
        """Get posts by category"""
        return self.db.query(Post).filter(
            and_(Post.category_id == category_id, Post.status == PostStatusEnum.PUBLISHED)
        ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_all_posts(self, skip: int = 0, limit: int = 10, status: PostStatusEnum | None = None) -> list[Post]:
        """Get all posts with optional status filter"""
        query = self.db.query(Post)
        if status:
            query = query.filter(Post.status == status)
        return query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_posts_count(self, status: PostStatusEnum | None = None) -> int:
        """Get total posts count"""
        query = self.db.query(Post)
        if status:
            query = query.filter(Post.status == status)
        return query.count()
    
    def search_posts(self, query: str, skip: int = 0, limit: int = 10) -> list[Post]:
        """Search posts by title or content"""
        return self.db.query(Post).filter(
            and_(
                or_(
                    Post.title.ilike(f"%{query}%"),
                    Post.content.ilike(f"%{query}%")
                ),
                Post.status == PostStatusEnum.PUBLISHED
            )
        ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    def create_post(self, title: str, slug: str, content: str, author_id: int, 
                   category_id: int | None = None, excerpt: str | None = None,
                   status: PostStatusEnum = PostStatusEnum.DRAFT) -> Post:
        """Create a new post"""
        post = Post(
            title=title,
            slug=slug,
            content=content,
            author_id=author_id,
            category_id=category_id,
            excerpt=excerpt,
            status=status,
            published_at=datetime.now(timezone.utc).replace(tzinfo=None) if status == PostStatusEnum.PUBLISHED else None
        )
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        return post
    
    def update_post(self, post_id: int, **kwargs) -> Post | None:
        """Update post"""
        post = self.get_post_by_id(post_id)
        if not post:
            return None
        
        # Handle status change to published
        if 'status' in kwargs and kwargs['status'] == PostStatusEnum.PUBLISHED and post.status == PostStatusEnum.DRAFT:
            kwargs['published_at'] = datetime.now(timezone.utc).replace(tzinfo=None)
        
        for key, value in kwargs.items():
            if value is not None and hasattr(post, key):
                setattr(post, key, value)
        
        self.db.commit()
        self.db.refresh(post)
        return post
    
    def delete_post(self, post_id: int) -> bool:
        """Delete post"""
        post = self.get_post_by_id(post_id)
        if not post:
            return False
        
        self.db.delete(post)
        self.db.commit()
        return True
