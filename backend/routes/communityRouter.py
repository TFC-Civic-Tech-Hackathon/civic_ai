from fastapi import APIRouter, HTTPException, UploadFile, File
from configs.mongo_configs import mongo_connection
import configparser
from pydantic import BaseModel
from typing import List
from datetime import datetime
from bson import ObjectId
from models.Post import Post
from typing import List, Dict

router = APIRouter()

config = configparser.ConfigParser()
config.read("configuration.properties")

# ✅ Pydantic Model for Post Creation
class PostCreateRequest(BaseModel):
    title: str
    description: str
    category: str
    username: str
    creationDate: datetime
    upvotes: int = 0
    comments: List[str] = []


# Get MongoDB collection
db = mongo_connection()
if db is None:
    raise Exception("Database connection failed")

collection = db[config["community"]["COLLECTION_NAME"]]


@router.post("/create")
async def create_post(post: Post):
    try:
        if not post:
            return False

        # ✅ Convert Pydantic model to dictionary
        post_data = post.dict()
        print(f"🔹 Post Data to Insert: {post_data}")  # Debugging

        # ✅ Connect to MongoDB
        db = mongo_connection()
        if db is None:
            raise HTTPException(
                status_code=503, detail="Failed to connect to the database"
            )

        # ✅ Check if post with same title & username exists
        existing_post = collection.find_one(
            {"title": post_data["title"], "username": post_data["username"]})
        if existing_post:
            raise HTTPException(
                status_code=400, detail="A post with the same title by this user already exists"
            )

        # ✅ Insert post into MongoDB
        result = collection.insert_one(post_data)

        # ✅ Check if insertion was successful
        if result.inserted_id:
            created_post = collection.find_one({"_id": result.inserted_id})

            if created_post is not None:
                return {
                    "message": "Post created successfully",
                    "post": {
                        "postId": str(created_post["_id"]),
                        "title": created_post["title"],
                        "description": created_post["description"],
                        "category": created_post["category"],
                        "username": created_post["username"],
                        "creationDate": created_post["creationDate"],
                        "upvotes": created_post["upvotes"],
                        "comments": created_post["comments"],
                    }
                }
            else:
                raise HTTPException(
                    status_code=400, detail="Failed to retrieve the created post"
                )
        else:
            raise HTTPException(
                status_code=503, detail="Failed to create post"
            )

    except HTTPException as http_err:
        print(f"HTTP error occurred: {http_err}")
        raise
    except Exception as e:
        print(f"❌ Error in create_post: {str(e)}")  # Debugging
        raise HTTPException(
            status_code=500, detail="Internal server error"
        )


# ✅ GET API to Fetch All Posts
@router.get("/", response_model=List[Dict])
async def get_all_posts():
    try:
        # ✅ Ensure collection is initialized
        if collection is None:
            raise HTTPException(
                status_code=503, detail="Database connection error"
            )

        posts = list(collection.find({}))

        if not posts:
            raise HTTPException(status_code=404, detail="No posts found")

        # ✅ Convert MongoDB ObjectId to string
        for post in posts:
            post["_id"] = str(post["_id"])

        return posts

    except Exception as e:
        print(f"❌ Error in get_all_posts: {str(e)}")  # Debugging
        raise HTTPException(
            status_code=500, detail=f"Error fetching posts: {str(e)}"
        )

# ✅ GET API to Fetch a Single Post by ID


@router.get("/{post_id}", response_model=Dict)
async def get_post_by_id(post_id: str):
    try:
        # ✅ Ensure collection is initialized
        if collection is None:
            raise HTTPException(
                status_code=503, detail="Database connection error"
            )

        # ✅ Validate ObjectId
        if not ObjectId.is_valid(post_id):
            raise HTTPException(
                status_code=400, detail="Invalid post ID format"
            )

        post = collection.find_one({"_id": ObjectId(post_id)})

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # ✅ Convert ObjectId to string
        post["_id"] = str(post["_id"])

        return post

    except Exception as e:
        print(f"❌ Error in get_post_by_id: {str(e)}")  # Debugging
        raise HTTPException(
            status_code=500, detail=f"Error fetching post: {str(e)}"
        )
