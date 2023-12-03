from models.log_model import Log, LogIn, LogUpdate
from models.logcount_model import LogCount
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

log_router = APIRouter()


@log_router.get("/daily_counts", response_model=List[LogCount])
async def daily_log_counts(database=Depends(get_database)):
    query = """
        SELECT date::date, 
               COUNT(*) FILTER (WHERE description = 'Item has been reported as lost') AS lost,
               COUNT(*) FILTER (WHERE description = 'Item marked as found by the business') AS found,
               COUNT(*) FILTER (WHERE description LIKE 'Item has been claimed by:%') AS claim
        FROM log
        GROUP BY date::date
        ORDER BY date::date
    """
    results = await database.fetch_all(query)
    return [
        {
            "date": str(result["date"]),
            "found": result["found"],
            "lost": result["lost"],
            "claim": result["claim"],
        }
        for result in results
    ]


@log_router.get("/daily_counts/{business_id}", response_model=List[LogCount])
async def daily_log_counts_business(business_id: int, database=Depends(get_database)):
    query = """
        SELECT log.date::date, 
               COUNT(*) FILTER (WHERE log.description = 'Item has been reported as lost') AS lost,
               COUNT(*) FILTER (WHERE log.description = 'Item marked as found by the business') AS found,
               COUNT(*) FILTER (WHERE log.description LIKE 'Item has been claimed by:%') AS claim
        FROM log
        JOIN item ON log.claim_id = item.claim_id
        WHERE item.business_id = :business_id
        GROUP BY log.date::date
        ORDER BY log.date::date
    """
    results = await database.fetch_all(query, {"business_id": business_id})
    return [
        {
            "date": str(result["date"]),
            "found": result["found"],
            "lost": result["lost"],
            "claim": result["claim"],
        }
        for result in results
    ]


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
async def update_log(
    log_id: int, update_data: LogUpdate, database=Depends(get_database)
):
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
