from pydantic import BaseModel, EmailStr

# User model
class User(BaseModel):
    username: str
    email: EmailStr
    bizzName: str
    bizzVertical: str
    location: str
    bizzSize: str
    password: str
