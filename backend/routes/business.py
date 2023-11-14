from models.user_model import Business, BusinessIn, BusinessUpdate
from fastapi import APIRouter, Body, status, Response, HTTPException, Depends
from typing import List

from db import get_database


router = APIRouter()

@router.post("/", response_model=Business)
async def create_user(business: BusinessIn, database = Depends(get_database)):
    find_query = "SELECT password FROM business WHERE username = :username"
    found_business = await(database.fetch_one(find_query,{"username": business.username}))
    if found_business:
        raise HTTPException(status_code=409, detail="Business already in database")

    query = """
        INSERT INTO business (name, email, phone_number, username, password, location_id)
        VALUES (:name, :email, :phone_number, :username, :password, :location_id)
        RETURNING id
    """

    values = {"name": business.name, "email":business.email, "phone_number":business.phone_number, 
              "username":business.username, "password":business.password, "location_id": business.location_id}

    last_record_id = await database.execute(query, values)
    return {**business.dict(), "id": last_record_id}

@router.get("/", response_model=List[Business])
async def read_businesses(database = Depends(get_database)):
    query = """
        SELECT * FROM business"""
    
    return await database.fetch_all(query)