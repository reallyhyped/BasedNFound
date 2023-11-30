from pydantic import BaseModel, constr

class Location(BaseModel):
    id: int
    address: str
    city: str
    state: str
    zipcode: int

class LocationIn(BaseModel):
    address: str
    city: str
    state: str
    zipcode: int

class LocationUpdate(BaseModel):
    address: str
    city: str
    state: str
    zipcode: int