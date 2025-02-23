from fastapi import Depends, HTTPException, APIRouter
import configparser
import jwt
from configs.mongo_configs import mongo_connection
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

config = configparser.ConfigParser()
config.read('configuration.properties')

# JWT config
SECRET_KEY = config['auth-api']['SECRET_KEY']
ALGORITHM = config['auth-api']['ALGORITHM']

# OAuth2 password bearer token
tokenUrl = config['password']['tokenUrl']
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=tokenUrl)

# Function to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    db = mongo_connection()
    if db is None:
        raise HTTPException(
            status_code=503, detail="Failed to connect to the database")
    collection = db[config['mongodb']["COLLECTION_NAME"]]
    user = collection.find_one({"username": username})
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
