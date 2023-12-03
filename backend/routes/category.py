from models.category_model import Category, CategoryIn, CategoryUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

category_router = APIRouter()

@category_router.post("/", response_model=Category)
async def create_category(category: CategoryIn, database=Depends(get_database)):
    query = """
        INSERT INTO category (name)
        VALUES (:name)
        RETURNING id
    """
    values = {
        "name": category.name,
    }
    last_record_id = await database.execute(query, values)
    return {**category.dict(), "id": last_record_id}

@category_router.get("/", response_model=List[Category])
async def read_categorys(database=Depends(get_database)):
    query = """
        SELECT * FROM category
    """
    return await database.fetch_all(query)

@category_router.get("/{name}", response_model=Category)
async def read_contain(name: str, database=Depends(get_database)):
    find_query = "SELECT * FROM category WHERE name = :name"
    found_contain = await database.fetch_one(find_query, {"name": name})

    if found_contain:
        return found_contain
    else:
        raise HTTPException(status_code=404, detail="Category not found")


@category_router.delete("/{category_id}")
async def delete_category(category_id: int, database=Depends(get_database)):
    # deleting associated entries in the contain table
    delete_contain_query = "DELETE FROM contain WHERE category_id = :category_id"
    await database.execute(delete_contain_query, {"category_id": category_id})

    delete_category_query = "DELETE FROM category WHERE id = :category_id"
    await database.execute(delete_category_query, {"category_id": category_id})
    return {"category deleted"}

    
@category_router.put("/{name}", response_model=Category)
async def update_category(name: str, update_data: CategoryUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM category WHERE name = :name"
    found_category = await database.fetch_one(find_query, {"name": name})

    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    
    if update_fields:
        # Include the new name in the update query
        update_query = f"UPDATE category SET {update_fields} WHERE name = :old_name"
        await database.execute(update_query, {**update_data_dict, "old_name": name})
        return await database.fetch_one(find_query, {"name": update_data.name})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")

