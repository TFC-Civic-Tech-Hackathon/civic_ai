from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import authRouter, healthRouter, userDocRouter
import configparser

config = configparser.ConfigParser()
config.read("configuration.properties")

# ✅ Read allowed origins and split into a list
allow_origins = config["cors"].get("ALLOW_ORIGINS", "").split(",")
# ✅ Strip spaces from origins (in case of extra spaces in config file)
allow_origins = [origin.strip() for origin in allow_origins if origin.strip()]

app = FastAPI()

# ✅ Add CORS Middleware with dynamic origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authRouter.router, tags=['authRoute'], prefix='/auth')
app.include_router(userDocRouter.router, tags=['userDocRoute'], prefix='/userDoc')
app.include_router(healthRouter.router, tags=['healthRoute'], prefix='')