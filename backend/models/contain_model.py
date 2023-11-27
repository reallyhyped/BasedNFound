from pydantic import BaseModel, constr

class Conatin(BaseModel):
    category_id: int
    item_id: int

class ConatinIn(BaseModel):
    category_id: int
    item_id: int

class ConatinUpdate(BaseModel):
    category_id: int
    item_id: int