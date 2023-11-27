from pydantic import BaseModel, constr

class Admin(BaseModel):
    id: int
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    phone_number: constr(max_length=10)

class AdminIn(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    phone_number: constr(max_length=10) 

class AdminUpdate(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    phone_number: constr(max_length=10) 