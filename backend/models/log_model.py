from pydantic import BaseModel, constr
from datetime import datetime

class Log(BaseModel):
    id: int
    date: datetime
    description: str
    claim_id: int    

class LogIn(BaseModel):
    date: datetime
    description: str
    claim_id: int    

class LogUpdate(BaseModel):
    date: datetime
    description: str
    claim_id: int    