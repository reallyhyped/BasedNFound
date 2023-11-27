from pydantic import BaseModel, constr
from datetime import datetime

class Item(BaseModel):
    id: int
    date: datetime
    description: str
    claim_id: int    

class ItemIn(BaseModel):
    date: datetime
    description: str
    claim_id: int    

class ItemUpdate(BaseModel):
    date: datetime
    description: str
    claim_id: int    