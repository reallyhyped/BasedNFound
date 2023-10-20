import os
import databases
import sqlalchemy
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

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


engine = sqlalchemy.create_engine(
    DATABASE_URL
)
# metadata.create_all(engine)


class NoteIn(BaseModel):
    text: str
    boolean: bool


class Note(BaseModel):
    id: int
    text: str
    boolean: bool


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/notes/", response_model=List[Note])
async def read_notes():
    # query = notes.select()
    query = """
        SELECT * FROM base_table    
    """
    return await database.fetch_all(query)


@app.post("/notes/", response_model=Note)
async def create_note(note: NoteIn):
    print(note)
    # query = notes.insert().values(text=note.text, boolean=note.boolean)
    query = """
        INSERT INTO base_table (text, boolean)
        VALUES (:text, :boolean)
        RETURNING id    
    """
    values = {"text": note.text, "boolean": note.boolean}
    last_record_id = await database.execute(query, values)
    return {**note.dict(), "id": last_record_id}

@app.get("/businesses/")
async def read_businesses():
    query = """
        SELECT name, email, phone_number FROM business
    """
    return await database.fetch_all(query)