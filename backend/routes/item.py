from models.item_model import Item, ItemIn, ItemUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

item_router = APIRouter()

@item_router.post("/", response_model=Item)
async def create_item(item: ItemIn, database=Depends(get_database)):
    query = """
        INSERT INTO item (name, date, claim_id, business_id, description, image, status)
        VALUES (:name, :date, :claim_id, :business_id, :description, :image, :status)
        RETURNING id
    """
    values = {
        "name": item.name,
        "date": item.date,
        "claim_id": item.claim_id,
        "business_id": item.business_id,
        "description": item.description,
        "image": item.image,
        "status": item.status,
    }
    last_record_id = await database.execute(query, values)
    return {**item.dict(), "id": last_record_id}

@item_router.get("/", response_model=List[Item])
async def read_items(database=Depends(get_database)):
    query = """
        SELECT * FROM item
    """
    return await database.fetch_all(query)

@item_router.get("/{item_id}", response_model=Item)
async def read_item(item_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM item WHERE id = :item_id"
    found_item = await database.fetch_one(find_query, {"item_id": item_id})

    if found_item:
        return found_item
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@item_router.delete("/{item_id}")
async def delete_item(item_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM item WHERE id = :item_id"
    found_item = await database.fetch_one(find_query, {"item_id": item_id})

    if found_item:
        delete_query = "DELETE FROM item WHERE id = :item_id"
        await database.execute(delete_query, {"item_id": item_id})
        return {"item deleted"}
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@item_router.put("/{item_id}", response_model=Item)
async def update_item(item_id: int, update_data: ItemUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM item WHERE id = :item_id"
    found_item = await database.fetch_one(find_query, {"item_id": item_id})

    if not found_item:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE item SET {update_fields} WHERE id = :item_id"
        await database.execute(update_query, {**update_data_dict, "item_id": item_id})
        return await database.fetch_one(find_query, {"item_id": item_id})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
