from pydantic import BaseModel


class LogCount(BaseModel):
    date: str
    found: int
    lost: int
    claim: int
