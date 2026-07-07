from sqlalchemy.orm import Session
from app.repositories.post_repository import PostRepository
from app.repositories.category_repository import CategoryRepository
from app.utils.slug import generate_slug
from app.utils.exceptions import NotFoundException, ForbiddenException
from app.schemas.schemas import PostResponse, PostDetailResponse
from app.models.models import Post, PostStatusEnum, User


class PostService:
    """Service for post operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.post_repo = PostRepository(db)
        self.category_repo = CategoryRepository(db)
    
    def create_post(self, title: str, content: str, author: User, 
                   category_id: int | None = None, excerpt: str | None = None,
                   status: PostStatusEnum = PostStatusEnum.DRAFT) -> PostResponse:
        """Create a new post"""
        # Validate category if provided
        if category_id:
            category = self.category_repo.get_category_by_id(category_id)
            if not category:
                raise NotFoundException("Category not found")
        
        # Generate slug
        slug = generate_slug(title)
        
        # Ensure unique slug
        existing_post = self.post_repo.get_post_by_slug(slug)
        if existing_post:
            counter = 1
            while self.post_repo.get_post_by_slug(f"{slug}-{counter}"):
                counter += 1
            slug = f"{slug}-{counter}"
        
        # Create post
        post = self.post_repo.create_post(
            title=title,
            slug=slug,
            content=content,
            author_id=author.id,
            category_id=category_id,
            excerpt=excerpt,
            status=status
        )
        
        return PostResponse.from_orm(post)
    
    def get_post(self, post_id: int) -> PostDetailResponse:
        """Get post with details"""
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        response = PostDetailResponse.from_orm(post)
        response.likes_count = len(post.liked_by)
        return response
    
    def get_post_by_slug(self, slug: str) -> PostDetailResponse:
        """Get post by slug"""
        post = self.post_repo.get_post_by_slug(slug)
        if not post or post.status == PostStatusEnum.DRAFT:
            raise NotFoundException("Post not found")
        
        response = PostDetailResponse.from_orm(post)
        response.likes_count = len(post.liked_by)
        return response
    
    def update_post(self, post_id: int, current_user: User, **kwargs) -> PostResponse:
        """Update post"""
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        # Check authorization
        if post.author_id != current_user.id and current_user.role.value != "admin":
            raise ForbiddenException("You don't have permission to update this post")
        
        # Validate category if provided
        if 'category_id' in kwargs and kwargs['category_id']:
            category = self.category_repo.get_category_by_id(kwargs['category_id'])
            if not category:
                raise NotFoundException("Category not found")
        
        # Update post
        updated_post = self.post_repo.update_post(post_id, **kwargs)
        return PostResponse.from_orm(updated_post)
    
    def delete_post(self, post_id: int, current_user: User) -> bool:
        """Delete post"""
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        # Check authorization
        if post.author_id != current_user.id and current_user.role.value != "admin":
            raise ForbiddenException("You don't have permission to delete this post")
        
        return self.post_repo.delete_post(post_id)
    
    def get_user_posts(self, author_id: int, skip: int = 0, limit: int = 10):
        """Get posts by author"""
        posts = self.post_repo.get_posts_by_author(author_id, skip, limit)
        total = self.db.query(Post).filter(Post.author_id == author_id).count()
        return {
            "items": [PostResponse.from_orm(p) for p in posts],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
    
    def get_published_posts(self, skip: int = 0, limit: int = 10):
        """Get published posts"""
        posts = self.post_repo.get_published_posts(skip, limit)
        total = self.post_repo.get_posts_count(PostStatusEnum.PUBLISHED)
        return {
            "items": [PostResponse.from_orm(p) for p in posts],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
    
    def search_posts(self, query: str, skip: int = 0, limit: int = 10):
        """Search posts"""
        posts = self.post_repo.search_posts(query, skip, limit)
        total = len(posts)
        return {
            "items": [PostResponse.from_orm(p) for p in posts],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
    
    def like_post(self, post_id: int, user: User) -> bool:
        """Like a post"""
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        if user not in post.liked_by:
            post.liked_by.append(user)
            self.db.commit()
            return True
        return False
    
    def unlike_post(self, post_id: int, user: User) -> bool:
        """Unlike a post"""
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        
        if user in post.liked_by:
            post.liked_by.remove(user)
            self.db.commit()
            return True
        return False
    
