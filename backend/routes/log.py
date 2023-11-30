from models.log_model import Log, LogIn, LogUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

log_router = APIRouter()

@log_router.post("/", response_model=Log)
async def create_log(log: LogIn, database=Depends(get_database)):
    query = """
        INSERT INTO log (date, description, claim_id)
        VALUES (:date, :description, :claim_id)
        RETURNING *
    """
    values = {
        "date": log.date,
        "description": log.description,
        "claim_id": log.claim_id,
    }
    created_log = await database.fetch_one(query, values)
    return created_log

@log_router.get("/", response_model=List[Log])
async def read_logs(database=Depends(get_database)):
    query = """
        SELECT * FROM log
    """
    return await database.fetch_all(query)

@log_router.get("/{log_id}", response_model=Log)
async def read_log(log_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM log WHERE id = :log_id"
    found_log = await database.fetch_one(find_query, {"log_id": log_id})

    if found_log:
        return found_log
    else:
        raise HTTPException(status_code=404, detail="Log not found")

@log_router.delete("/{log_id}")
async def delete_log(log_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM log WHERE id = :log_id"
    found_log = await database.fetch_one(find_query, {"log_id": log_id})

    if found_log:
        delete_query = "DELETE FROM log WHERE id = :log_id"
        await database.execute(delete_query, {"log_id": log_id})
        return {"log deleted"}
    else:
        raise HTTPException(status_code=404, detail="Log not found")

@log_router.put("/{log_id}", response_model=Log)
async def update_log(log_id: int, update_data: LogUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM log WHERE id = :log_id"
    found_log = await database.fetch_one(find_query, {"log_id": log_id})

    if not found_log:
        raise HTTPException(status_code=404, detail="Log not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE log SET {update_fields} WHERE id = :log_id"
        await database.execute(update_query, {**update_data_dict, "log_id": log_id})
        return await database.fetch_one(find_query, {"log_id": log_id})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
