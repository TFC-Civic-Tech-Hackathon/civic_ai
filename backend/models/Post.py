from pydantic import BaseModel
from typing import List
from datetime import datetime


class Post(BaseModel):
    title: str
    description: str
    category: str
    username: str
    creationDate: datetime
    upvotes: int = 0
    comments: List[str] = []
