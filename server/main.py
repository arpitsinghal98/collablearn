from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import router as auth_router
from api.groups import router as groups_router

app = FastAPI()

# Allow CORS for localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(groups_router, prefix="/groups", tags=["Groups"])

# Health check endpoint
@app.get("/")
def health_check():
    return {"message": "Server is running!"}