from models.claim_model import Claim, ClaimIn, ClaimUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

claim_router = APIRouter()

@claim_router.post("/", response_model=Claim)
async def create_claim(claim: ClaimIn, database=Depends(get_database)):
    query = """
        INSERT INTO claim (status, date, description, business_id, bnf_user_id)
        VALUES (:status, :date, :description, :business_id, :bnf_user_id)
        RETURNING id
    """
    values = {
        "status": claim.status,
        "date": claim.date,
        "description": claim.description,
        "business_id": claim.business_id,
        "bnf_user_id": claim.bnf_user_id,
    }
    last_record_id = await database.execute(query, values)
    return {**claim.dict(), "id": last_record_id}

@claim_router.get("/", response_model=List[Claim])
async def read_claims(database=Depends(get_database)):
    query = """
        SELECT * FROM claim
    """
    return await database.fetch_all(query)

@claim_router.get("/{claim_id}", response_model=Claim)
async def read_claim(claim_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM claim WHERE id = :claim_id"
    found_claim = await database.fetch_one(find_query, {"claim_id": claim_id})

    if found_claim:
        return found_claim
    else:
        raise HTTPException(status_code=404, detail="Claim not found")

@claim_router.delete("/{claim_id}")
async def delete_claim(claim_id: int, database=Depends(get_database)):
    find_query = "SELECT * FROM claim WHERE id = :claim_id"
    found_claim = await database.fetch_one(find_query, {"claim_id": claim_id})

    if found_claim:
        delete_query = "DELETE FROM claim WHERE id = :claim_id"
        await database.execute(delete_query, {"claim_id": claim_id})
        return {"claim deleted"}
    else:
        raise HTTPException(status_code=404, detail="Claim not found")

@claim_router.put("/{claim_id}", response_model=Claim)
async def update_claim(claim_id: int, update_data: ClaimUpdate, database=Depends(get_database)):
    find_query = "SELECT * FROM claim WHERE id = :claim_id"
    found_claim = await database.fetch_one(find_query, {"claim_id": claim_id})

    if not found_claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    update_fields = ", ".join([f"{key}=:{key}" for key in update_data_dict.keys()])
    if update_fields:
        update_query = f"UPDATE claim SET {update_fields} WHERE id = :claim_id"
        await database.execute(update_query, {**update_data_dict, "claim_id": claim_id})
        return await database.fetch_one(find_query, {"claim_id": claim_id})
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
