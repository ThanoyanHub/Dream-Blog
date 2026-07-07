from sqlalchemy.orm import Session
from app.models.models import Category


class CategoryRepository:
    """Repository for Category model operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_category_by_id(self, category_id: int) -> Category | None:
        """Get category by ID"""
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def get_category_by_slug(self, slug: str) -> Category | None:
        """Get category by slug"""
        return self.db.query(Category).filter(Category.slug == slug).first()
    
    def get_all_categories(self, skip: int = 0, limit: int = 100) -> list[Category]:
        """Get all categories"""
        return self.db.query(Category).offset(skip).limit(limit).all()
    
    def get_categories_count(self) -> int:
        """Get total categories count"""
        return self.db.query(Category).count()
    
    def create_category(self, name: str, slug: str, description: str | None = None) -> Category:
        """Create a new category"""
        category = Category(
            name=name,
            slug=slug,
            description=description
        )
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def update_category(self, category_id: int, **kwargs) -> Category | None:
        """Update category"""
        category = self.get_category_by_id(category_id)
        if not category:
            return None
        
        for key, value in kwargs.items():
            if value is not None and hasattr(category, key):
                setattr(category, key, value)
        
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def delete_category(self, category_id: int) -> bool:
        """Delete category"""
        category = self.get_category_by_id(category_id)
        if not category:
            return False
        
        self.db.delete(category)
        self.db.commit()
        return True
    
    def search_categories(self, query: str, skip: int = 0, limit: int = 10) -> list[Category]:
        """Search categories by name"""
        return self.db.query(Category).filter(
            Category.name.ilike(f"%{query}%")
        ).offset(skip).limit(limit).all()
