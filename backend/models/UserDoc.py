from pydantic import BaseModel

# UserDoc Model
class UserDoc(BaseModel):
    userId: str
    documentLoc: str
