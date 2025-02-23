import configparser
from pymongo import MongoClient

# Load Configs
config = configparser.ConfigParser()
config.read('configuration.properties')

def mongo_connection():
    try:
        # Get MongoDB details
        MONGO_URI = config.get("mongodb", "MONGODB_URL", fallback=None)
        DATABASE_NAME = config.get("mongodb", "DATABASE_NAME", fallback=None)

        print(MONGO_URI)
        print(DATABASE_NAME)

        # Validate config values
        if not MONGO_URI or not DATABASE_NAME:
            raise ValueError("MONGODB_URL or DATABASE_NAME is missing in configuration.properties")

        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        return db
    except Exception as e:
        print("Exception in mongo_connection function: ",e)
        return None