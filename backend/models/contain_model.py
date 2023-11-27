from pydantic import BaseModel, constr

class Contain(BaseModel):
    category_id: int
    item_id: int

class ContainIn(BaseModel):
    category_id: int
    item_id: int

class ContainUpdate(BaseModel):
    category_id: int
    item_id: int