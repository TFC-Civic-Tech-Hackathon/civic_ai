from pydantic import BaseModel

# ✅ Pydantic Model for Login Request
class LoginRequest(BaseModel):
    username: str
    password: str
