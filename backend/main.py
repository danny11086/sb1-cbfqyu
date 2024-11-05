from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import List
import uuid

from .models.user import UserCreate, User
from .models.transaction import Transaction
from .auth.security import verify_password, get_password_hash, create_access_token
from .auth.deps import get_current_user
from .database import (
    init_db,
    get_user_by_email,
    create_user,
    get_user_transactions
)

app = FastAPI()

# Initialize database
init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/register", response_model=User)
async def register(user_data: UserCreate):
    if get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    user = create_user(UserInDB(
        **user_data.dict(),
        id=user_id,
        hashed_password=hashed_password,
        created_at=datetime.utcnow()
    ))
    return user

@app.post("/api/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.id}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/transactions", response_model=List[Transaction])
async def get_transactions(current_user: User = Depends(get_current_user)):
    return get_user_transactions(current_user.id)

@app.post("/api/transactions", response_model=Transaction)
async def create_transaction(
    transaction: Transaction,
    current_user: User = Depends(get_current_user)
):
    transaction.user_id = current_user.id
    # Add transaction to database
    return transaction

@app.get("/api/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/")
async def root():
    return {"message": "Welcome to the Financial Management API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)