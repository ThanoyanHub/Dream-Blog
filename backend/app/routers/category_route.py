"""
Category Controller - HTTP endpoints for categories
"""
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.middleware.auth import get_current_admin
from app.services.category_service import CategoryService
from app.schemas.schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create a new category (Admin only)"""
    category_service = CategoryService(db)
    category = category_service.create_category(
        name=category_data.name,
        description=category_data.description
    )
    return {"message": "Category created successfully", "category": category}


@router.get("", response_model=dict)
async def get_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all categories"""
    category_service = CategoryService(db)
    return category_service.get_all_categories(skip, limit)


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Get category by ID"""
    category_service = CategoryService(db)
    return category_service.get_category(category_id)


@router.put("/{category_id}", response_model=dict)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update category (Admin only)"""
    category_service = CategoryService(db)
    category = category_service.update_category(
        category_id,
        name=category_data.name,
        description=category_data.description
    )
    return {"message": "Category updated successfully", "category": category}


@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete category (Admin only)"""
    category_service = CategoryService(db)
    category_service.delete_category(category_id)
    return {"message": "Category deleted successfully"}


@router.get("/search", response_model=dict)
async def search_categories(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search categories"""
    category_service = CategoryService(db)
    return category_service.search_categories(q, skip, limit)
