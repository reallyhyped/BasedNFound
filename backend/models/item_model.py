from typing import Optional
from pydantic import BaseModel, constr
from datetime import datetime


class Item(BaseModel):
    id: int
    name: str
    date: datetime
    claim_id: int
    business_id: int
    description: str
    image: str
    status: str
    bnf_user_id: Optional[int] = None


class ItemIn(BaseModel):
    name: str
    date: datetime
    claim_id: int
    business_id: int
    description: str
    image: str
    status: str
    bnf_user_id: Optional[int] = None


class ItemUpdate(BaseModel):
    name: str
    date: datetime
    claim_id: int
    business_id: int
    description: str
    image: str
    status: str
    bnf_user_id: Optional[int] = None
