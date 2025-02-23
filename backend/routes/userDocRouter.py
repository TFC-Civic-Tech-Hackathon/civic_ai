from fastapi import APIRouter, HTTPException
from models.UserDoc import UserDoc
from configs.mongo_configs import mongo_connection
from bson import ObjectId
import configparser

router = APIRouter()

config = configparser.ConfigParser()
config.read("configuration.properties")

# Get MongoDB collection
db = mongo_connection()
if db is None:
    raise Exception("Database connection failed")
collection = db[config["userDoc"]["COLLECTION_NAME"]]

# ✅ Create a document record
@router.post("/", response_model=UserDoc)
async def create_user_doc(user_doc: UserDoc):
    # Convert Pydantic model to dictionary
    doc_data = user_doc.dict()

    # Insert into MongoDB
    result = collection.insert_one(doc_data)
    if result.inserted_id:
        return {**doc_data, "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to create document")


# ✅ Retrieve a document by userId
@router.get("/{userId}", response_model=UserDoc)
async def get_user_doc(userId: str):
    user_doc = collection.find_one({"userId": userId})
    if not user_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    user_doc["_id"] = str(user_doc["_id"])  # Convert ObjectId to string
    return user_doc


# ✅ Update a document location
@router.put("/{userId}", response_model=UserDoc)
async def update_user_doc(userId: str, updated_data: UserDoc):
    result = collection.find_one_and_update(
        {"userId": userId},
        {"$set": updated_data.dict()},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Document not found")
    result["_id"] = str(result["_id"])  # Convert ObjectId to string
    return result


# ✅ Delete a document
@router.delete("/{userId}")
async def delete_user_doc(userId: str):
    result = collection.delete_one({"userId": userId})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}
