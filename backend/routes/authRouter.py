from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
import configparser
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from configs.mongo_configs import mongo_connection
from models.User import User
from models.LoginRequest import LoginRequest
from configs.snowflake_config import snowflake_connection
from bson import ObjectId

router = APIRouter()

config = configparser.ConfigParser()
config.read("configuration.properties")

# JWT config
SECRET_KEY = config["auth-api"]["SECRET_KEY"]
ALGORITHM = config["auth-api"]["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    config["auth-api"]["ACCESS_TOKEN_EXPIRE_MINUTES"])

# Password hashing settings
schemes = config["password"]["schemes"]
deprecated = config["password"]["deprecated"]
pwd_context = CryptContext(schemes=schemes, deprecated=deprecated)


# Function to authenticate user
def authenticate_user(username: str, password: str, collection):
    user = collection.find_one({"username": username})
    # Verify the plain password with the hash password from db
    if not user or not pwd_context.verify(password, user["password"]):
        return False
    return user


# Function to create access token
def create_access_token(username: str, userId: str):
    expiration_time = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": username, "exp": expiration_time, "uid": userId}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def fetch_data(query):
    """Fetch data from Snowflake"""
    conn, table_name = snowflake_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    columns = [col[0] for col in cursor.description]  # Column names
    cursor.close()
    conn.close()
    return [dict(zip(columns, row)) for row in data]


def add_notifications(user_id):
    db = mongo_connection()
    query = """SELECT ID, AGENCY, SUB_AGENCY, ACTION_TYPE, SUMMARY, PUBLIC_INSPECTION_PDF_URL, PUBLICATION_DATE   
            FROM CIVIC_HACKATHON_DB.CIVIC_HACKATHON_SCHEMA.NOTICE_RULE
            ORDER BY PUBLICATION_DATE DESC
            LIMIT 5;
            """
    data_notification = fetch_data(query)
    
    for notification in data_notification:
        # Convert datetime.date to datetime.datetime properly
        for key, value in notification.items():
            if isinstance(value, (date, datetime)):  # Ensure only valid types are checked
                if isinstance(value, date) and not isinstance(value, datetime):  
                    notification[key] = datetime(value.year, value.month, value.day)

        # Add user_id field
        notification["user_id"] = user_id  
        notification["is_read"] = False  

    collection = db[config["mongodb"]["COLLECTION_NAME_NOTI"]]
    
    if data_notification:  # Ensure data is not empty before inserting
        collection.insert_many(data_notification)
        
        
# Route to handle user signup
@router.post("/signup")
async def user_signup(user: User):
    try:
        if not user:
            return False

        user_data = user.dict()

        db = mongo_connection()
        if db is None:
            raise HTTPException(
                status_code=503, detail="Failed to connect to the database")

        collection = db[config["mongodb"]["COLLECTION_NAME"]]
        existing_user = collection.find_one({"email": user_data["email"]})
        if existing_user:
            raise HTTPException(
                status_code=400, detail="User with the same email already exists"
            )

        # Hash the password
        user_data["password"] = pwd_context.hash(user_data["password"])

        # Add the user to DB
        result = collection.insert_one(user_data)

        if result.inserted_id:
            created_user = collection.find_one(
                {"_id": result.inserted_id})  # Fetch newly created user

            if created_user is not None:
                
                if created_user["bizzVertical"] in ["Food", "Agriculture"]:
                    add_notifications(created_user["_id"])
                
                return {
                    "message": "User registered successfully",
                    "user": {
                        "username": created_user["username"],
                        "email": created_user["email"],
                        "userID": str(created_user["_id"]),
                        "bizzName": created_user["bizzName"],
                        "bizzVertical": created_user["bizzVertical"],
                        "location": created_user["location"],
                        "bizzSize": created_user["bizzSize"],
                    }
                }
            else:
                raise HTTPException(
                    status_code=400, detail="Failed to create user")
        else:
            raise HTTPException(
                status_code=503, detail="Failed to create user")

    except HTTPException as http_err:
        print(f"HTTP error occurred: {http_err}")
        raise
    except Exception as e:
        print("An error occurred:", e)
        raise HTTPException(status_code=500, detail="Internal server error")


# Route to generate access token after login
@router.post("/login")
async def login_for_access_token(form_data: LoginRequest):
    db = mongo_connection()
    if db is None:
        raise HTTPException(
            status_code=500, detail="Failed to connect to the database")

    collection = db[config["mongodb"]["COLLECTION_NAME"]]
    user = authenticate_user(
        form_data.username, form_data.password, collection)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(form_data.username, str(user["_id"]))

    if access_token:
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "username": user["username"],
                "email": user["email"],
                "userID": str(user["_id"]),
                "bizzName": user["bizzName"],
                "bizzVertical": user["bizzVertical"],
                "location": user["location"],
                "bizzSize": user["bizzSize"],
            }
        }
    else:
        return {"message": "Failed"}
    
    
# @router.get("/notifications/{user_id}")
# async def get_notifications(user_id: str):
#     db = mongo_connection()
#     collection = db[config["mongodb"]["COLLECTION_NAME_NOTI"]]
#     notifications = collection.find_all({"user_id": user_id})
#     return {"notifications": notifications}

# Function to convert MongoDB ObjectId and datetime to string for JSON serialization
def serialize_notification(notification):
    # Convert ObjectId and datetime fields to strings
    for key, value in notification.items():
        if isinstance(value, ObjectId):
            notification[key] = str(value)
        elif isinstance(value, (datetime, date)):
            notification[key] = value.isoformat()  # Convert datetime to ISO 8601 string
    return notification

@router.get("/notifications/{user_id}")
async def get_notifications(user_id: str):
    db = mongo_connection()
    collection = db[config["mongodb"]["COLLECTION_NAME_NOTI"]]
    
    # Query to fetch notifications based on user_id
    notifications_cursor = collection.find({"user_id": ObjectId(user_id)})
    
    # Convert cursor to list and serialize
    notifications = [serialize_notification(notification) for notification in notifications_cursor]
    
    return {"notifications": notifications}



@router.post("/notifications/read/{notification_id}")
async def mark_notification_as_read(notification_id: str):
    db = mongo_connection()
    collection = db[config["mongodb"]["COLLECTION_NAME_NOTI"]]
    
    # Update the notification to mark it as read   
    collection.update_one({"_id": ObjectId(notification_id)}, {"$set": {"is_read": True}})
    
    return {"message": "Notification marked as read"}
