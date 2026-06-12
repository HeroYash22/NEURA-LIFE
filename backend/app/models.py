from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    google_id = Column(String, unique=True, nullable=True)  # For Google OAuth
    is_premium = Column(Boolean, default=False)
    neuracoins = Column(Integer, default=5000)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    session_id = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    emotion = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuizResult(Base):
    __tablename__ = "quiz_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    quiz_type = Column(String, nullable=False)  # anxiety, depression, stress
    score = Column(Integer, nullable=False)
    result_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Therapist(Base):
    __tablename__ = "therapists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    credentials = Column(String, nullable=False)
    experience = Column(Integer, nullable=False)
    rating = Column(Integer, default=5)
    reviews = Column(Integer, default=0)
    cost = Column(Integer, nullable=False)  # in NeuraCoins
    bio = Column(Text)
    avatar = Column(String, default='👨‍⚕️')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserTherapist(Base):
    __tablename__ = "user_therapists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    therapist_id = Column(Integer, nullable=False)
    opted_in_at = Column(DateTime, default=datetime.utcnow)

class TherapyMessage(Base):
    __tablename__ = "therapy_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    therapist_id = Column(Integer, nullable=False)
    sender = Column(String, nullable=False)  # 'user' or 'therapist'
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)

class TherapySession(Base):
    __tablename__ = "therapy_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    therapist_id = Column(Integer, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    time = Column(String, nullable=False)  # HH:MM
    status = Column(String, default='scheduled')  # scheduled, completed, cancelled
    type = Column(String, default='Video Call')
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
