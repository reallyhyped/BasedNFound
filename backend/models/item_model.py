from pydantic import BaseModel, constr
from datetime import datetime

class Item(BaseModel):
    id: int
    name: str
    date: datetime
    claim_id: int
    business_id: int
    description: str

class ItemIn(BaseModel):
    name: str
    date: datetime
    claim_id: int
    business_id: int
    description: str

class ItemUpdate(BaseModel):
    name: str
    date: datetime
    claim_id: int
    business_id: int
    description: str