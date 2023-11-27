from models.business_model import Business, BusinessIn, BusinessUpdate
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

@router.get("/{username}", response_model=Business)
async def read_business(username: str, database = Depends(get_database)):
    find_query = "SELECT * FROM business WHERE username = :username"
    found_business = await database.fetch_one(find_query, {"username": username})

    if found_business:
        return found_business
    else:
        raise HTTPException(status_code=404, detail="Business not found")
    
@router.delete("/{username}")
async def delete_business(username: str, database = Depends(get_database)):
    find_query = "SELECT * FROM business WHERE username = :username"
    found_business = await database.fetch_one(find_query, {"username": username})
    
    if found_business:
        delete_query = "DELETE FROM business WHERE username = :username"
        await database.execute(delete_query, {"username": username})
        return {"business deleted"}
    else:
        raise HTTPException(status_code=404, detail="Business not found")
    
@router.put("/{username}", response_model=Business)
async def update_business(username: str, update_data: BusinessUpdate, database = Depends(get_database)):
    find_query = "SELECT * FROM business WHERE username = :username"
    found_business = await database.fetch_one(find_query, {"username": username})

    if not found_business:
        raise HTTPException(status_code=404, detail="Business not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([
        f"{key}=:{key}" for key in update_data_dict.keys()
    ])
    if update_fields:
        update_query = f"UPDATE business SET {update_fields} WHERE username = :username"
        await database.execute(update_query, {**update_data_dict, "username": username})
        return await database.fetch_one(find_query, {"username": username})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
    
@router.get("/{username}/password")
async def get_business_password(username: str, database = Depends(get_database)):
    find_query = "SELECT password FROM business WHERE username = :username"
    result = await(database.fetch_one(find_query,{"username": username}))

    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Business not found")