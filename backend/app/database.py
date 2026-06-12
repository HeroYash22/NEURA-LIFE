from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mental_health.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Minimal schema migration helpers (SQLite) ---
def _column_exists(table_name: str, column_name: str) -> bool:
    """Check if a column exists in a SQLite table."""
    try:
        with engine.connect() as conn:
            res = conn.execute(text(f"PRAGMA table_info({table_name})"))
            for row in res:
                # PRAGMA table_info returns: cid, name, type, notnull, dflt_value, pk
                if str(row[1]).lower() == column_name.lower():
                    return True
    except Exception:
        return False
    return False

def _add_column(table_name: str, column_def: str):
    """Add a column to a SQLite table if possible."""
    with engine.begin() as conn:
        conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_def}"))

def ensure_schema():
    """Ensure DB has required columns added in later versions without dropping data.

    This is intentionally minimal and only handles additive changes safe for SQLite.
    """
    # chat_messages.session_id (String)
    if not _column_exists("chat_messages", "session_id"):
        _add_column("chat_messages", "session_id VARCHAR")

    # chat_messages.emotion (String)
    if not _column_exists("chat_messages", "emotion"):
        _add_column("chat_messages", "emotion VARCHAR")

    # chat_sessions.updated_at (DateTime)
    if not _column_exists("chat_sessions", "updated_at"):
        _add_column("chat_sessions", "updated_at DATETIME")
        # Backfill updated_at with created_at so ordering and UI work
        with engine.begin() as conn:
            conn.execute(text("UPDATE chat_sessions SET updated_at = COALESCE(updated_at, created_at)"))
