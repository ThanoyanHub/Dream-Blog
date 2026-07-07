from sqlalchemy.orm import Session
from app.repositories.category_repository import CategoryRepository
from app.utils.exceptions import NotFoundException, ConflictException
from app.schemas.schemas import CategoryResponse
from app.utils.slug import generate_slug


class CategoryService:
    """Service for category operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)
    
    def create_category(self, name: str, description: str | None = None) -> CategoryResponse:
        """Create a new category"""
        # Generate slug from name
        slug = generate_slug(name)
        
        # Check if slug already exists
        if self.category_repo.get_category_by_slug(slug):
            raise ConflictException("Category already exists")
        
        # Create category
        category = self.category_repo.create_category(name, slug, description)
        return CategoryResponse.from_orm(category)
    
    def get_category(self, category_id: int) -> CategoryResponse:
        """Get category by ID"""
        category = self.category_repo.get_category_by_id(category_id)
        if not category:
            raise NotFoundException("Category not found")
        
        return CategoryResponse.from_orm(category)
    
    def get_all_categories(self, skip: int = 0, limit: int = 100):
        """Get all categories"""
        categories = self.category_repo.get_all_categories(skip, limit)
        total = self.category_repo.get_categories_count()
        
        return {
            "items": [CategoryResponse.from_orm(c) for c in categories],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
    
    def update_category(self, category_id: int, name: str | None = None, 
                       description: str | None = None) -> CategoryResponse:
        """Update category"""
        category = self.category_repo.get_category_by_id(category_id)
        if not category:
            raise NotFoundException("Category not found")
        
        # Update slug if name changed
        update_data = {}
        if name:
            update_data['name'] = name
            slug = generate_slug(name)
            
            # Check if new slug already exists
            existing = self.category_repo.get_category_by_slug(slug)
            if existing and existing.id != category_id:
                raise ConflictException("Category with this name already exists")
            
            update_data['slug'] = slug
        
        if description is not None:
            update_data['description'] = description
        
        # Update category
        updated_category = self.category_repo.update_category(category_id, **update_data)
        return CategoryResponse.from_orm(updated_category)
    
    def delete_category(self, category_id: int) -> bool:
        """Delete category"""
        category = self.category_repo.get_category_by_id(category_id)
        if not category:
            raise NotFoundException("Category not found")
        
        return self.category_repo.delete_category(category_id)
    
    def search_categories(self, query: str, skip: int = 0, limit: int = 10):
        """Search categories"""
        categories = self.category_repo.search_categories(query, skip, limit)
        total = len(categories)
        
        return {
            "items": [CategoryResponse.from_orm(c) for c in categories],
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total + limit - 1) // limit
        }
