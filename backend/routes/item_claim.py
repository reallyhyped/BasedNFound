from datetime import datetime
from models.itemclaim_model import ItemClaimResponse
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db import get_database

item_claim_router = APIRouter()


@item_claim_router.get("/item_claim/{item_id}", response_model=ItemClaimResponse)
async def get_item_claim(item_id: int, database=Depends(get_database)):
    query = """
        SELECT 
            i.id AS item_id, 
            i.name, 
            i.date AS item_date, 
            i.claim_id, 
            i.business_id, 
            i.description AS item_description, 
            i.image, 
            i.status AS item_status, 
            i.bnf_user_id AS item_bnf_user_id,
            c.date AS claim_date, 
            c.status AS claim_status, 
            c.bnf_user_id AS claim_bnf_user_id, 
            c.description AS claim_description
        FROM item i
        LEFT JOIN claim c ON i.claim_id = c.id
        WHERE i.id = :item_id
    """
    result = await database.fetch_one(query, {"item_id": item_id})
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Item or claim not found")


@item_claim_router.get("/all_item_claims", response_model=List[ItemClaimResponse])
async def get_all_item_claims(database=Depends(get_database)):
    query = """
        SELECT 
            i.id AS item_id, 
            i.name, 
            i.date AS item_date, 
            i.claim_id, 
            i.business_id, 
            i.description AS item_description, 
            i.image, 
            i.status AS item_status, 
            i.bnf_user_id AS item_bnf_user_id,
            c.date AS claim_date, 
            c.status AS claim_status, 
            c.bnf_user_id AS claim_bnf_user_id, 
            c.description AS claim_description
        FROM item i
        LEFT JOIN claim c ON i.claim_id = c.id
    """
    results = await database.fetch_all(query)
    if results:
        return results
    else:
        raise HTTPException(status_code=404, detail="No items or claims found")


@item_claim_router.get(
    "/item_claim_by_business/{business_id}", response_model=List[ItemClaimResponse]
)
async def get_item_claims_by_business(business_id: int, database=Depends(get_database)):
    query = """
        SELECT 
            i.id AS item_id, 
            i.name, 
            i.date AS item_date, 
            i.claim_id, 
            i.business_id, 
            i.description AS item_description, 
            i.image, 
            i.status AS item_status, 
            i.bnf_user_id AS item_bnf_user_id,
            c.date AS claim_date, 
            c.status AS claim_status, 
            c.bnf_user_id AS claim_bnf_user_id, 
            c.description AS claim_description
        FROM item i
        LEFT JOIN claim c ON i.claim_id = c.id
        WHERE i.business_id = :business_id
    """
    results = await database.fetch_all(query, {"business_id": business_id})
    if results:
        return results
    else:
        return []


@item_claim_router.put("/approve_claim/{item_id}")
async def approve_claim(item_id: int, database=Depends(get_database)):
    # Step 1: Find the item and its claim
    find_item_query = "SELECT * FROM item WHERE id = :item_id"
    item = await database.fetch_one(find_item_query, {"item_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    claim_id = item["claim_id"]
    if not claim_id:
        raise HTTPException(status_code=404, detail="Claim not found for this item")

    # Step 2: Fetch the claim to get the bnf_user_id
    find_claim_query = "SELECT bnf_user_id FROM claim WHERE id = :claim_id"
    claim = await database.fetch_one(find_claim_query, {"claim_id": claim_id})
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    # Step 3: Fetch the bnf_user's username
    find_bnf_user_query = "SELECT username FROM bnf_user WHERE id = :bnf_user_id"
    bnf_user = await database.fetch_one(
        find_bnf_user_query, {"bnf_user_id": claim["bnf_user_id"]}
    )
    if not bnf_user:
        raise HTTPException(status_code=404, detail="Beneficiary user not found")

    # Step 4: Update the item's and claim's status to 'claimed'
    update_item_query = "UPDATE item SET status = 'claimed' WHERE id = :item_id"
    await database.execute(update_item_query, {"item_id": item_id})

    update_claim_query = "UPDATE claim SET status = 'claimed' WHERE id = :claim_id"
    await database.execute(update_claim_query, {"claim_id": claim_id})

    # Step 5: Insert a log entry
    current_date = datetime.utcnow()
    log_description = f"Item has been claimed by: {bnf_user['username']}"
    insert_log_query = """
        INSERT INTO log (date, description, claim_id)
        VALUES (:date, :description, :claim_id)
        RETURNING *
    """
    log_values = {
        "date": current_date,
        "description": log_description,
        "claim_id": claim_id,
    }
    created_log = await database.fetch_one(insert_log_query, log_values)

    return {
        "item_update": "Item marked as claimed",
        "claim_update": "Claim marked as claimed",
        "log_entry": created_log,
    }


@item_claim_router.put("/reject_claim/{item_id}")
async def reject_claim(item_id: int, database=Depends(get_database)):
    # Step 1: Find the item and its claim
    find_item_query = "SELECT * FROM item WHERE id = :item_id"
    item = await database.fetch_one(find_item_query, {"item_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    claim_id = item["claim_id"]
    if not claim_id:
        raise HTTPException(status_code=404, detail="Claim not found for this item")

    # Step 2: Fetch the claim to get the bnf_user_id
    find_claim_query = "SELECT bnf_user_id FROM claim WHERE id = :claim_id"
    claim = await database.fetch_one(find_claim_query, {"claim_id": claim_id})
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    # Step 3: Fetch the bnf_user's username
    find_bnf_user_query = "SELECT username FROM bnf_user WHERE id = :bnf_user_id"
    bnf_user = await database.fetch_one(
        find_bnf_user_query, {"bnf_user_id": claim["bnf_user_id"]}
    )
    if not bnf_user:
        raise HTTPException(status_code=404, detail="Beneficiary user not found")

    # Step 4: Update the item's status back to 'found'
    update_item_query = "UPDATE item SET status = 'found' WHERE id = :item_id"
    await database.execute(update_item_query, {"item_id": item_id})

    # Step 5: Reset the claim's status and bnf_user_id
    reset_claim_query = """
        UPDATE claim
        SET status = 'No one has claimed', bnf_user_id = null
        WHERE id = :claim_id
    """
    await database.execute(reset_claim_query, {"claim_id": claim_id})

    # Step 6: Insert a log entry
    current_date = datetime.utcnow()
    log_description = f"Rejected claim from: {bnf_user['username']}"
    insert_log_query = """
        INSERT INTO log (date, description, claim_id)
        VALUES (:date, :description, :claim_id)
        RETURNING *
    """
    log_values = {
        "date": current_date,
        "description": log_description,
        "claim_id": claim_id,
    }
    created_log = await database.fetch_one(insert_log_query, log_values)

    return {
        "item_update": "Item status reset to found",
        "claim_update": "Claim status reset and bnf_user_id cleared",
        "log_entry": created_log,
    }
