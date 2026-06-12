from app.database import SessionLocal
from app.models import Therapist
from app.auth import verify_password

db = SessionLocal()
liban = db.query(Therapist).filter(Therapist.email == 'liban@neuralife.com').first()

if liban:
    print(f"Liban found in database")
    print(f"Email: {liban.email}")
    print(f"Testing password 'therapist123': {verify_password('therapist123', liban.hashed_password)}")
    print(f"Testing password 'password': {verify_password('password', liban.hashed_password)}")
    print(f"Testing password 'liban123': {verify_password('liban123', liban.hashed_password)}")
else:
    print("Liban not found")
