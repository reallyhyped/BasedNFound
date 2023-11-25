from models.admin_model import Admin, AdminIn, AdminUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

admin_router = APIRouter()

@admin_router.post("/", response_model=Admin)
async def create_admin(admin: AdminIn, database=Depends(get_database)):
    find_query = "SELECT password FROM admin WHERE username = :username"
    found_admin = await database.fetch_one(find_query, {"username": admin.username})
    if found_admin:
        raise HTTPException(status_code=409, detail="Admin already in database")

    query = """
        INSERT INTO admin (username, password, first_name, last_name, email, phone_number)
        VALUES (:username, :password, :first_name, :last_name, :email, :phone_number)
        RETURNING id
    """
    values = {
        "username": admin.username,
        "first_name": admin.first_name,
        "last_name": admin.last_name,
        "email": admin.email,
        "password": admin.password,
        "phone_number": admin.phone_number,
    }
    last_record_id = await database.execute(query, values)
    return {**admin.dict(), "id": last_record_id}

@admin_router.get("/", response_model=List[Admin])
async def read_admins(database=Depends(get_database)):
    query = """
        SELECT * FROM admin
    """
    return await database.fetch_all(query)

@admin_router.get("/{username}", response_model=Admin)
async def read_admin(username: str, database=Depends(get_database)):
    find_query = "SELECT * FROM admin WHERE username = :username"
    found_admin = await database.fetch_one(find_query, {"username": username})

    if found_admin:
        return found_admin
    else:
        raise HTTPException(status_code=404, detail="Admin not found")

@admin_router.delete("/{username}")
async def delete_admin(username: str, database=Depends(get_database)):
    find_query = "SELECT * FROM admin WHERE username = :username"
    found_admin = await database.fetch_one(find_query, {"username": username})

    if found_admin:
        delete_query = "DELETE FROM admin WHERE username = :username"
        await database.execute(delete_query, {"username": username})
        return {"admin deleted"}
    else:
        raise HTTPException(status_code=404, detail="Admin not found")

@admin_router.put("/{username}", response_model=Admin)
async def update_admin(username: str, update_data: AdminUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM admin WHERE username = :username"
    found_admin = await database.fetch_one(find_query, {"username": username})

    if not found_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE admin SET {update_fields} WHERE username = :username"
        await database.execute(update_query, {**update_data_dict, "username": username})
        return await database.fetch_one(find_query, {"username": username})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")

@admin_router.get("/{username}/password")
async def get_admin_password(username: str, database=Depends(get_database)):
    find_query = "SELECT password FROM admin WHERE username = :username"
    result = await database.fetch_one(find_query, {"username": username})

    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Admin not found")
