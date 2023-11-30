from pydantic import BaseModel, constr

class Manage(BaseModel):
    admin_id: int
    claim_id: int
    business_id: int

class ManageIn(BaseModel):
    admin_id: int
    claim_id: int
    business_id: int

class ManageUpdate(BaseModel):
    admin_id: int
    claim_id: int
    business_id: int