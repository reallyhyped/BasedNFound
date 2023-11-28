from pydantic import BaseModel, constr

class Business(BaseModel):
    id: int
    name: str
    email: str
    phone_number: constr(max_length=10)
    username: str
    password: str
    location_id: int
    status: str

class BusinessIn(BaseModel):
    name: str
    email: str
    phone_number: constr(max_length=10)
    username: str
    password: str
    location_id: int
    status: str

class BusinessUpdate(BaseModel):
    name: str
    email: str
    phone_number: constr(max_length=10)
    username: str
    password: str
    location_id: int
    status: str