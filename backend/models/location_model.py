from pydantic import BaseModel, constr

class Location(BaseModel):
    id: int
    address: str
    city: str
    state: str
    zipcode: constr(max_length=5)

class LocationIn(BaseModel):
    address: str
    city: str
    state: str
    zipcode: constr(max_length=5)

class LocationUpdate(BaseModel):
    address: str
    city: str
    state: str
    zipcode: constr(max_length=5)