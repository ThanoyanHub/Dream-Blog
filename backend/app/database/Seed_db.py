"""
Database Seeding Script - Creates Admin User and Initial Categories
"""
from sqlalchemy.orm import sessionmaker
from app.database.database import engine
from app.models.models import User, RoleEnum, Category
from app.core.security import hash_password

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("Seeding database...")

# Check if admin user already exists
admin_email = "admin@dreamblog.com"
admin = db.query(User).filter(User.email == admin_email).first()

if not admin:
    admin = User(
        username="admin",
        email=admin_email,
        password_hash=hash_password("admin123"),
        role=RoleEnum.ADMIN,
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Admin user created successfully.")
else:
    print("Admin user already exists.")

# Create some categories
categories_data = [
    ("Technology", "All things tech, coding, gadgets, and software development."),
    ("Lifestyle", "Health, wellness, travel, fashion, and daily life inspiration."),
    ("Finance", "Personal finance, investment, budgeting, and economic trends."),
    ("Education", "Learning, tutorials, academic insights, and career growth.")
]

for name, desc in categories_data:
    slug = name.lower()
    existing = db.query(Category).filter(Category.slug == slug).first()
    if not existing:
        category = Category(name=name, slug=slug, description=desc)
        db.add(category)
        print(f"Created category: {name}")
    else:
        print(f"Category already exists: {name}")

db.commit()
db.close()
print("Seeding completed.")
