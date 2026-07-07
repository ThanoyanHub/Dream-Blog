from sqlalchemy.orm import Session
from app.models.models import User
from app.core.security import hash_password


class UserRepository:
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_id(self, user_id: int) -> User | None:

        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> User | None:
        
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_username(self, username: str) -> User | None:
        
        return self.db.query(User).filter(User.username == username).first()
    
    def get_all_users(self, skip: int = 0, limit: int = 10) -> list[User]:
        
        return self.db.query(User).offset(skip).limit(limit).all()
    
    def get_users_count(self) -> int:
        
        return self.db.query(User).count()
    
    def create_user(self, username: str, email: str, password: str, full_name: str | None = None) -> User:
    
        user = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            full_name=full_name
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_user(self, user_id: int, **kwargs) -> User | None:
    
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        for key, value in kwargs.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete_user(self, user_id: int) -> bool:
    
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        self.db.delete(user)
        self.db.commit()
        return True
    
    def search_users(self, query: str, skip: int = 0, limit: int = 10) -> list[User]:

        return self.db.query(User).filter(
            (User.username.ilike(f"%{query}%")) | 
            (User.email.ilike(f"%{query}%"))
        ).offset(skip).limit(limit).all()
