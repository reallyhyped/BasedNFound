from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ItemClaimResponse(BaseModel):
    item_id: int
    name: str
    item_date: datetime
    claim_id: int
    business_id: int
    item_description: str
    image: str
    item_status: str
    item_bnf_user_id: Optional[int] = None
    claim_date: datetime
    claim_status: str
    claim_bnf_user_id: Optional[int] = None
    claim_description: str
