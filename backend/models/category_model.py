from pydantic import BaseModel, constr

class Category(BaseModel):
    id: int
    name: str

class CategoryIn(BaseModel):
    name: str

class CategoryUpdate(BaseModel):
    name: str