"""Make test1 premium"""
from app.database import SessionLocal
from app.models import User

db = SessionLocal()

# Find test1
user = db.query(User).filter(User.username == 'test1').first()

if user:
    print(f"Found user: {user.username}")
    print(f"Current premium status: {user.is_premium}")
    print(f"Current NeuraCoins: {user.neuracoins}")
    
    # Update to premium
    user.is_premium = True
    user.neuracoins = 1000
    db.commit()
    
    print("\n✅ Updated!")
    print(f"New premium status: {user.is_premium}")
    print(f"New NeuraCoins: {user.neuracoins}")
else:
    print("❌ User 'test1' not found!")

db.close()
