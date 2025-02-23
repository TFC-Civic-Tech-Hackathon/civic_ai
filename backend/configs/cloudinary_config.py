import cloudinary
import cloudinary.uploader
import configparser

# Load configuration
config = configparser.ConfigParser()
config.read("configuration.properties")

# Cloudinary Configuration
cloudinary.config(
    cloud_name=config["cloudinary"]["CLOUD_NAME"],
    api_key=config["cloudinary"]["API_KEY"],
    api_secret=config["cloudinary"]["API_SECRET"],
    secure=True
)

# Debugging: Check if Cloudinary is configured
print("✅ Cloudinary Configured:", cloudinary.config().cloud_name)
