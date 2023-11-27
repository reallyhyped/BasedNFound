from models.user_model import User, UserIn, UserUpdate
from fastapi import APIRouter, Body, status, Response, HTTPException, Depends
from typing import List

from db import get_database


router = APIRouter()

@router.post("/", response_model=User)
async def create_user(user: UserIn, database = Depends(get_database)):
    find_query = "SELECT password FROM bnf_user WHERE username = :username"
    found_user = await(database.fetch_one(find_query,{"username": user.username}))
    if found_user:
        raise HTTPException(status_code=409, detail="User already in database")

    query = """
        INSERT INTO bnf_user (username, password, first_name, last_name, email, phone_number)
        VALUES (:username, :password, :first_name, :last_name, :email, :phone_number)
        RETURNING id
    """
    values = {"username": user.username, "first_name": user.first_name, "last_name":user.last_name,
              "email": user.email, "password": user.password, "phone_number": user.phone_number}
    last_record_id = await database.execute(query, values)
    return {**user.dict(), "id": last_record_id}

@router.get("/", response_model=List[User])
async def read_users(database = Depends(get_database)):
    query = """
        SELECT * FROM bnf_user"""
    
    return await database.fetch_all(query)

@router.get("/{username}", response_model=User)
async def read_user(username: str, database = Depends(get_database)):
    find_query = "SELECT * FROM bnf_user WHERE username = :username"
    found_user = await database.fetch_one(find_query, {"username": username})

    if found_user:
        return found_user
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.delete("/{username}")
async def delete_user(username: str, database = Depends(get_database)):
    find_query = "SELECT * FROM bnf_user WHERE username = :username"
    found_user = await database.fetch_one(find_query, {"username": username})
    
    if found_user:
        delete_query = "DELETE FROM bnf_user WHERE username = :username"
        await database.execute(delete_query, {"username": username})
        return {"user deleted"}
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@router.put("/{username}", response_model=User)
async def update_user(username: str, update_data: UserUpdate, database = Depends(get_database)):
    find_query = "SELECT * FROM bnf_user WHERE username = :username"
    found_user = await database.fetch_one(find_query, {"username": username})

    if not found_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([
        f"{key}=:{key}" for key in update_data_dict.keys()
    ])
    if update_fields:
        update_query = f"UPDATE bnf_user SET {update_fields} WHERE username = :username"
        await database.execute(update_query, {**update_data_dict, "username": username})
        return await database.fetch_one(find_query, {"username": username})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")

@router.get("/{username}/password")
async def get_user_password(username: str, database = Depends(get_database)):
    find_query = "SELECT password FROM bnf_user WHERE username = :username"
    result = await(database.fetch_one(find_query,{"username": username}))

    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="User not found")
