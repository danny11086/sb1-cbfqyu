from typing import Optional, List
import sqlite3
import json
from datetime import datetime
from .models.user import User, UserInDB
from .models.transaction import Transaction

def get_db():
    conn = sqlite3.connect('accounting.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            hashed_password TEXT NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            currency TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT,
            date TEXT NOT NULL,
            description TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()

def get_user_by_email(email: str) -> Optional[UserInDB]:
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()
    
    if user:
        return UserInDB(**dict(user))
    return None

def get_user_by_id(user_id: str) -> Optional[User]:
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE id = ?", (user_id,)
    ).fetchone()
    conn.close()
    
    if user:
        return User(**dict(user))
    return None

def create_user(user: UserInDB) -> User:
    conn = get_db()
    conn.execute("""
        INSERT INTO users (id, email, full_name, hashed_password, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (
        user.id,
        user.email,
        user.full_name,
        user.hashed_password,
        user.created_at.isoformat()
    ))
    conn.commit()
    conn.close()
    return User(**user.dict(exclude={'hashed_password'}))

def get_user_transactions(user_id: str) -> List[Transaction]:
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
        (user_id,)
    ).fetchall()
    conn.close()
    
    return [Transaction(**dict(row)) for row in rows]