from models.manage_model import Manage, ManageIn, ManageUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

manage_router = APIRouter()

@manage_router.post("/", response_model=Manage)
async def create_manage(manage: ManageIn, database=Depends(get_database)):
    query = """
        INSERT INTO manage (admin_id, claim_id, business_id)
        VALUES (:admin_id, :claim_id, :business_id)
        RETURNING *
    """
    values = {
        "admin_id": manage.admin_id,
        "claim_id": manage.claim_id,
        "business_id": manage.business_id,
    }
    created_manage = await database.fetch_one(query, values)
    return created_manage

@manage_router.get("/", response_model=List[Manage])
async def read_manages(database=Depends(get_database)):
    query = """
        SELECT * FROM manage
    """
    return await database.fetch_all(query)

@manage_router.get("/{admin_id}/{claim_id}/{business_id}", response_model=Manage)
async def read_manage(admin_id: int, claim_id: int, business_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM manage WHERE admin_id = :admin_id AND claim_id = :claim_id AND business_id = :business_id"
    found_manage = await database.fetch_one(find_query, {"admin_id": admin_id, "claim_id": claim_id, "business_id": business_id})

    if found_manage:
        return found_manage
    else:
        raise HTTPException(status_code=404, detail="Manage not found")

@manage_router.delete("/{admin_id}/{claim_id}/{business_id}")
async def delete_manage(admin_id: int, claim_id: int, business_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM manage WHERE admin_id = :admin_id AND claim_id = :claim_id AND business_id = :business_id"
    found_manage = await database.fetch_one(find_query, {"admin_id": admin_id, "claim_id": claim_id, "business_id": business_id})

    if found_manage:
        delete_query = "DELETE FROM manage WHERE admin_id = :admin_id AND claim_id = :claim_id AND business_id = :business_id"
        await database.execute(delete_query, {"admin_id": admin_id, "claim_id": claim_id, "business_id": business_id})
        return {"manage deleted"}
    else:
        raise HTTPException(status_code=404, detail="Manage not found")

@manage_router.put("/{admin_id}/{claim_id}/{business_id}", response_model=Manage)
async def update_manage(admin_id: int, claim_id: int, business_id: int, update_data: ManageUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM manage WHERE admin_id = :admin_id AND claim_id = :claim_id AND business_id = :business_id"
    found_manage = await database.fetch_one(find_query, {"admin_id": admin_id, "claim_id": claim_id, "business_id": business_id})

    if not found_manage:
        raise HTTPException(status_code=404, detail="Manage not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE manage SET {update_fields} WHERE admin_id = :admin_id AND claim_id = :claim_id AND business_id = :business_id"
        await database.execute(update_query, {**update_data_dict, "admin_id": admin_id, "claim_id": claim_id, "business_id": business_id})
        return await database.fetch_one(find_query, {"admin_id": admin_id, "claim_id": claim_id, "business_id": business_id})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
