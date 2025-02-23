from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import authRouter, healthRouter, userDocRouter

app = FastAPI()

app.include_router(authRouter.router, tags=['authRoute'], prefix='/auth')
app.include_router(userDocRouter.router, tags=['userDocRoute'], prefix='/userDoc')
app.include_router(healthRouter.router, tags=['healthRoute'], prefix='')