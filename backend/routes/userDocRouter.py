from fastapi import APIRouter, HTTPException, UploadFile, File
from models.UserDoc import UserDoc
from configs.mongo_configs import mongo_connection
from bson import ObjectId
import configparser
import cloudinary.uploader
from configs.cloudinary_config import cloudinary

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
async def create_user_doc(userId: str, file: UploadFile = File(...)):
    try:
        # Ensure file is a PDF
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400, detail="Only PDF files are allowed")

        print('Inside try block')
        # Upload directly to Cloudinary inside "CivicHacks" folder
        cloudinary_response = cloudinary.uploader.upload(
            file.file,
            resource_type="raw",  # Raw to allow any file type
            folder="CivicHacks"   # Ensures files are stored in the "CivicHacks" folder
        )

        print('cloudinary resp: ', cloudinary_response)
        
        # Extract secure URL from Cloudinary response
        cloudinary_url = cloudinary_response.get("secure_url")
        if not cloudinary_url:
            raise HTTPException(
                status_code=500, detail="Failed to upload file to Cloudinary")

        # Store userId and Cloudinary URL in MongoDB
        document_entry = {
            "userId": userId,
            "documentLoc": cloudinary_url  # Store Cloudinary URL
        }
        result = collection.insert_one(document_entry)

        if result.inserted_id:
            return {
                "message": "File uploaded successfully",
                "userId": userId,
                "documentLoc": cloudinary_url,
                "documentId": str(result.inserted_id)
            }
        else:
            raise HTTPException(
                status_code=500, detail="Failed to store document info")
    
    except Exception as e:
        print("Error uploading file:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ✅ Get all documents for a given userId
@router.get("/{userId}")
async def get_all_user_docs(userId: str):
    user_docs = list(collection.find({"userId": userId}))

    if not user_docs:
        raise HTTPException(
            status_code=404, detail="No documents found for this userId")

    # Convert ObjectId to string
    for doc in user_docs:
        doc["_id"] = str(doc["_id"])

    return {"userId": userId, "documents": user_docs}


@router.get("/doc/{userDocId}", response_model=UserDoc)
async def get_user_doc_by_id(userDocId: str):
    try:
        user_doc = collection.find_one({"_id": ObjectId(userDocId)})
        if not user_doc:
            raise HTTPException(status_code=404, detail="Document not found")

        user_doc["_id"] = str(user_doc["_id"])  # Convert ObjectId to string
        return user_doc

    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid userDocId format")


@router.delete("/doc/{userDocId}")
async def delete_user_doc_by_id(userDocId: str):
    try:
        result = collection.delete_one({"_id": ObjectId(userDocId)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Document not found")

        return {"message": "Document deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid userDocId format")
