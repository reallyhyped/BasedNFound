from models.contain_model import Contain, ContainIn, ContainUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

contain_router = APIRouter()

@contain_router.post("/", response_model=Contain)
async def create_contain(contain: ContainIn, database=Depends(get_database)):
    query = """
        INSERT INTO contain (category_id, item_id)
        VALUES (:category_id, :item_id)
        RETURNING *
    """
    values = {
        "category_id": contain.category_id,
        "item_id": contain.item_id,
    }
    created_contain = await database.fetch_one(query, values)
    return created_contain

@contain_router.get("/", response_model=List[Contain])
async def read_contains(database=Depends(get_database)):
    query = """
        SELECT * FROM contain
    """
    return await database.fetch_all(query)

@contain_router.get("/{category_id}/{item_id}", response_model=Contain)
async def read_contain(category_id: int, item_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM contain WHERE category_id = :category_id AND item_id = :item_id"
    found_contain = await database.fetch_one(find_query, {"category_id": category_id, "item_id": item_id})

    if found_contain:
        return found_contain
    else:
        raise HTTPException(status_code=404, detail="Contain not found")

@contain_router.delete("/{category_id}/{item_id}")
async def delete_contain(category_id: int, item_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM contain WHERE category_id = :category_id AND item_id = :item_id"
    found_contain = await database.fetch_one(find_query, {"category_id": category_id, "item_id": item_id})

    if found_contain:
        delete_query = "DELETE FROM contain WHERE category_id = :category_id AND item_id = :item_id"
        await database.execute(delete_query, {"category_id": category_id, "item_id": item_id})
        return {"contain deleted"}
    else:
        raise HTTPException(status_code=404, detail="Contain not found")

@contain_router.put("/{category_id}/{item_id}", response_model=Contain)
async def update_contain(category_id: int, item_id: int, update_data: ContainUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM contain WHERE category_id = :category_id AND item_id = :item_id"
    found_contain = await database.fetch_one(find_query, {"category_id": category_id, "item_id": item_id})

    if not found_contain:
        raise HTTPException(status_code=404, detail="Contain not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE contain SET {update_fields} WHERE category_id = :category_id AND item_id = :item_id"
        await database.execute(update_query, {**update_data_dict, "category_id": category_id, "item_id": item_id})
        return await database.fetch_one(find_query, {"category_id": category_id, "item_id": item_id})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
