import os
import databases
from dotenv import load_dotenv
import sqlalchemy

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database instance
database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

# Define your tables here if needed
notes = sqlalchemy.Table(
    "base_table",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("text", sqlalchemy.String),
    sqlalchemy.Column("boolean", sqlalchemy.Boolean),
)

# Database engine instance
engine = sqlalchemy.create_engine(DATABASE_URL)

async def connect_to_db():
    await database.connect()

async def disconnect_from_db():
    await database.disconnect()

def get_database():
    return database
