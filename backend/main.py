import os
import databases
import sqlalchemy
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel, constr
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from db import connect_to_db, disconnect_from_db, get_database


from routes.user import router as UserRouter
from routes.business import router as BusinessRouter
from routes.item import item_router as ItemRouter
from routes.admin import admin_router as AdminRouter
from routes.claim import claim_router as ClaimRouter
from routes.manage import manage_router as ManageRouter
from routes.contain import contain_router as ContainRouter
from routes.log import log_router as LogRouter
from routes.location import location_router as LocationRouter
from routes.category import category_router as CategoryRouter
from routes.item_claim import item_claim_router as ItemClaimRouter

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

notes = sqlalchemy.Table(
    "base_table",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("text", sqlalchemy.String),
    sqlalchemy.Column("boolean", sqlalchemy.Boolean),
)


engine = sqlalchemy.create_engine(DATABASE_URL)
# metadata.create_all(engine)


class NoteIn(BaseModel):
    text: str
    boolean: bool


class Note(BaseModel):
    id: int
    text: str
    boolean: bool


app = FastAPI()

origins = ["http://localhost", "http://localhost:8080", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect_to_db()


@app.on_event("shutdown")
async def shutdown():
    await disconnect_from_db()


app.include_router(UserRouter, tags=["User"], prefix="/user")


@app.get("/businesses/")
async def read_businesses():
    query = """
        SELECT name, email, phone_number FROM business
    """
    return await database.fetch_all(query)


app.include_router(BusinessRouter, tags=["Business"], prefix="/business")
app.include_router(ItemRouter, tags=["Item"], prefix="/item")
app.include_router(AdminRouter, tags=["Admin"], prefix="/admin")
app.include_router(ClaimRouter, tags=["Claim"], prefix="/claim")
app.include_router(ManageRouter, tags=["Manage"], prefix="/manage")
app.include_router(ContainRouter, tags=["Contain"], prefix="/contain")
app.include_router(LogRouter, tags=["Log"], prefix="/log")
app.include_router(LocationRouter, tags=["Location"], prefix="/location")
app.include_router(CategoryRouter, tags=["Category"], prefix="/category")
app.include_router(ItemClaimRouter, tags=["ItemClaim"], prefix="/item_claim")
