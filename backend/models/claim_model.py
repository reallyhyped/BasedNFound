from pydantic import BaseModel, constr
from datetime import datetime

class Claim(BaseModel):
    id: int
    date: datetime
    status: str
    bnf_user_id: int
    description: str

class ClaimIn(BaseModel):
    date: datetime
    status: str
    bnf_user_id: int
    description: str

class ClaimUpdate(BaseModel):
    date: datetime
    status: str
    user_id: int
    description: str