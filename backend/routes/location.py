from models.location_model import Location, LocationIn, LocationUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

location_router = APIRouter()

@location_router.post("/", response_model=Location)
async def create_location(location: LocationIn, database=Depends(get_database)):
    query = """
        INSERT INTO location (address, city, state, zipcode)
        VALUES (:address, :city, :state, :zipcode)
        RETURNING id
    """
    values = {
        "address": location.address,
        "city": location.city,
        "state": location.state,
        "zipcode": location.zipcode
    }
    last_record_id = await database.execute(query, values)
    return {**location.dict(), "id": last_record_id}

@location_router.get("/", response_model=List[Location])
async def read_location(database=Depends(get_database)):
    query = """
        SELECT * FROM location
    """
    return await database.fetch_all(query)

@location_router.get("/{location_id}", response_model=Location)
async def read_location(location_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM location WHERE id = :location_id"
    found_location = await database.fetch_one(find_query, {"location_id": location_id})

    if found_location:
        return found_location
    else:
        raise HTTPException(status_code=404, detail="Location not found")

@location_router.delete("/{location_id}")
async def delete_location(location_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM location WHERE id = :location_id"
    found_location = await database.fetch_one(find_query, {"location_id": location_id})

    if found_location:
        delete_query = "DELETE FROM location WHERE id = :location_id"
        await database.execute(delete_query, {"location_id": location_id})
        return {"location deleted"}
    else:
        raise HTTPException(status_code=404, detail="Location not found")

@location_router.put("/{location_id}", response_model=Location)
async def update_location(location_id: int, update_data: LocationUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM location WHERE id = :location_id"
    found_location = await database.fetch_one(find_query, {"location_id": location_id})

    if not found_location:
        raise HTTPException(status_code=404, detail="Location not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE location SET {update_fields} WHERE id = :location_id"
        await database.execute(update_query, {**update_data_dict, "location_id": location_id})
        return await database.fetch_one(find_query, {"location_id": location_id})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
