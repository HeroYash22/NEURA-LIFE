"""Check pending appointments in the database"""
from app.database import SessionLocal
from app.models import TherapySession, User, Therapist

db = SessionLocal()

# Get all pending appointments
pending = db.query(TherapySession).filter(TherapySession.status == 'pending').all()

print(f"\n{'='*60}")
print(f"Found {len(pending)} pending appointment(s)")
print(f"{'='*60}\n")

for apt in pending:
    user = db.query(User).filter(User.id == apt.user_id).first()
    therapist = db.query(Therapist).filter(Therapist.id == apt.therapist_id).first()
    
    print(f"Appointment ID: {apt.id}")
    print(f"  User: {user.username if user else 'Unknown'} (ID: {apt.user_id})")
    print(f"  Therapist: {therapist.name if therapist else 'Unknown'} (ID: {apt.therapist_id})")
    print(f"  Date: {apt.date}")
    print(f"  Time: {apt.time}")
    print(f"  Type: {apt.type}")
    print(f"  Status: {apt.status}")
    print(f"  Notes: {apt.notes if apt.notes else 'None'}")
    print(f"{'-'*60}\n")

# Get all appointments (any status)
all_apts = db.query(TherapySession).all()
print(f"Total appointments in database: {len(all_apts)}")
print(f"Status breakdown:")
statuses = {}
for apt in all_apts:
    statuses[apt.status] = statuses.get(apt.status, 0) + 1
for status, count in statuses.items():
    print(f"  {status}: {count}")

db.close()
