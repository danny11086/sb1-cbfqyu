from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    type: str
    amount: float
    currency: str
    category: str
    subcategory: Optional[str] = None
    date: datetime
    description: str
    payment_method: str
    notes: Optional[str] = None

class Transaction(TransactionBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime