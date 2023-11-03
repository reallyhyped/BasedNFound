from pydantic import BaseModel, constr

class User(BaseModel):
    id: int
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    phone_number: constr(max_length=10)

class UserIn(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    phone_number: constr(max_length=10) 

class UserUpdate(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    phone_number: constr(max_length=10) 