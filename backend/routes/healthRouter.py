from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def hello_world():
    return {"message": "Hello, FastAPI!"}
