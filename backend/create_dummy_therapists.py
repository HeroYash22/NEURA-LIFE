"""Script to create dummy therapists"""
from app.database import SessionLocal, engine, Base
from app.models import Therapist
from app.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def create_dummy_therapists():
    db = SessionLocal()
    
    # Check if therapists already exist
    existing = db.query(Therapist).all()
    if existing:
        print("Dummy therapists already exist. Deleting them first...")
        for therapist in existing:
            db.delete(therapist)
        db.commit()
    
    dummy_therapists = [
        {
            "name": "Ritvik",
            "email": "ritvik@neuralife.com",
            "password": "123456",
            "specialization": "Anxiety & Stress Management",
            "credentials": "PhD in Clinical Psychology",
            "experience": 12,
            "rating": 5,
            "reviews": 247,
            "cost": 500,
            "bio": "Specializing in cognitive behavioral therapy with over 12 years of experience helping clients overcome anxiety and stress.",
            "avatar": "�‍⚕️"
        },
        {
            "name": "Liban",
            "email": "liban@neuralife.com",
            "password": "123456",
            "specialization": "Depression & Mood Disorders",
            "credentials": "MD, Psychiatrist",
            "experience": 15,
            "rating": 5,
            "reviews": 312,
            "cost": 600,
            "bio": "Board-certified psychiatrist specializing in depression, bipolar disorder, and medication management.",
            "avatar": "👨‍⚕️"
        },
        {
            "name": "Yash",
            "email": "yash@neuralife.com",
            "password": "123456",
            "specialization": "Trauma & PTSD",
            "credentials": "PsyD, Licensed Therapist",
            "experience": 10,
            "rating": 5,
            "reviews": 189,
            "cost": 550,
            "bio": "Expert in trauma-focused therapy, EMDR, and helping survivors heal from traumatic experiences.",
            "avatar": "�‍⚕️"
        },
        {
            "name": "Abhisaar",
            "email": "abhisaar@neuralife.com",
            "password": "123456",
            "specialization": "Relationships & Family Therapy",
            "credentials": "LMFT, Marriage & Family Therapist",
            "experience": 8,
            "rating": 5,
            "reviews": 156,
            "cost": 450,
            "bio": "Helping couples and families improve communication, resolve conflicts, and strengthen bonds.",
            "avatar": "👨‍⚕️"
        },
        {
            "name": "t1",
            "email": "t1@neuralife.com",
            "password": "123456",
            "specialization": "Teen & Young Adult Therapy",
            "credentials": "MA, Licensed Counselor",
            "experience": 7,
            "rating": 5,
            "reviews": 203,
            "cost": 400,
            "bio": "Passionate about supporting teens and young adults through life transitions, identity issues, and mental health challenges.",
            "avatar": "�‍⚕️"
        },
        {
            "name": "t2",
            "email": "t2@neuralife.com",
            "password": "123456",
            "specialization": "Addiction & Recovery",
            "credentials": "PhD, Addiction Specialist",
            "experience": 14,
            "rating": 5,
            "reviews": 178,
            "cost": 550,
            "bio": "Certified addiction specialist helping individuals achieve and maintain recovery from substance abuse.",
            "avatar": "👨‍⚕️"
        },
        {
            "name": "t3",
            "email": "t3@neuralife.com",
            "password": "123456",
            "specialization": "Mindfulness & Meditation",
            "credentials": "PhD, Mindfulness-Based Therapist",
            "experience": 9,
            "rating": 5,
            "reviews": 221,
            "cost": 450,
            "bio": "Integrating mindfulness practices with traditional therapy to help clients find inner peace and emotional balance.",
            "avatar": "�‍⚕️"
        },
        {
            "name": "t4",
            "email": "t4@neuralife.com",
            "password": "123456",
            "specialization": "OCD & Anxiety Disorders",
            "credentials": "PsyD, OCD Specialist",
            "experience": 11,
            "rating": 5,
            "reviews": 195,
            "cost": 525,
            "bio": "Expert in exposure and response prevention (ERP) therapy for OCD and related anxiety disorders.",
            "avatar": "👨‍⚕️"
        },
        {
            "name": "t5",
            "email": "t5@neuralife.com",
            "password": "123456",
            "specialization": "Cognitive Behavioral Therapy",
            "credentials": "PhD, CBT Specialist",
            "experience": 13,
            "rating": 5,
            "reviews": 210,
            "cost": 500,
            "bio": "Experienced CBT therapist helping clients change negative thought patterns and behaviors.",
            "avatar": "👨‍⚕️"
        },
        {
            "name": "t6",
            "email": "t6@neuralife.com",
            "password": "123456",
            "specialization": "Mental Health & Wellness",
            "credentials": "MA, Licensed Therapist",
            "experience": 6,
            "rating": 5,
            "reviews": 142,
            "cost": 400,
            "bio": "Dedicated to providing comprehensive mental health support and wellness counseling.",
            "avatar": "👨‍⚕️"
        }
    ]
    
    for therapist_data in dummy_therapists:
        hashed_password = get_password_hash(therapist_data["password"])
        new_therapist = Therapist(
            name=therapist_data["name"],
            email=therapist_data["email"],
            hashed_password=hashed_password,
            specialization=therapist_data["specialization"],
            credentials=therapist_data["credentials"],
            experience=therapist_data["experience"],
            rating=therapist_data["rating"],
            reviews=therapist_data["reviews"],
            cost=therapist_data["cost"],
            bio=therapist_data["bio"],
            avatar=therapist_data["avatar"]
        )
        db.add(new_therapist)
    
    db.commit()
    print("✅ Successfully created 10 dummy therapists!")
    print("   All with password: 123456")
    print("\n�‍⚕️ Therapists:")
    for t in dummy_therapists:
        print(f"   - {t['name']} ({t['specialization']}) - {t['cost']} NeuraCoins/session")
    
    db.close()

if __name__ == "__main__":
    create_dummy_therapists()
