"""Script to create dummy users for testing"""
from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def create_dummy_users():
    db = SessionLocal()
    
    # Check if users already exist
    existing_users = db.query(User).filter(User.username.in_(['test1', 'test2', 'test3', 'test4', 'test5', 'test6'])).all()
    if existing_users:
        print("Dummy users already exist. Deleting them first...")
        for user in existing_users:
            db.delete(user)
        db.commit()
    
    dummy_users = [
        {
            "username": "test1",
            "email": "test1@neuralife.com",
            "password": "123456",
            "is_premium": True,
            "neuracoins": 5000
        },
        {
            "username": "test2",
            "email": "test2@neuralife.com",
            "password": "123456",
            "is_premium": False,
            "neuracoins": 5000
        },
        {
            "username": "test3",
            "email": "test3@neuralife.com",
            "password": "123456",
            "is_premium": False,
            "neuracoins": 5000
        },
        {
            "username": "test4",
            "email": "test4@neuralife.com",
            "password": "123456",
            "is_premium": False,
            "neuracoins": 5000
        },
        {
            "username": "test5",
            "email": "test5@neuralife.com",
            "password": "123456",
            "is_premium": False,
            "neuracoins": 5000
        },
        {
            "username": "test6",
            "email": "test6@neuralife.com",
            "password": "123456",
            "is_premium": False,
            "neuracoins": 5000
        }
    ]
    
    for user_data in dummy_users:
        hashed_password = get_password_hash(user_data["password"])
        new_user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=hashed_password,
            is_premium=user_data["is_premium"],
            neuracoins=user_data["neuracoins"]
        )
        db.add(new_user)
    
    db.commit()
    print("✅ Successfully created 6 dummy users!")
    print("   - test1 (Premium ⭐) - 5000 NeuraCoins")
    print("   - test2 to test6 (Free) - 5000 NeuraCoins each")
    print("   - All passwords: 123456")
    
    db.close()

if __name__ == "__main__":
    create_dummy_users()
