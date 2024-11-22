from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import router as auth_router
from api.users import router as users_router
from api.groups import router as groups_router
from api.group_members import router as group_members_router
from api.messages import router as messages_router
from api.resources import router as resources_router
from api.badges import router as badges_router
from api.activity import router as activity_router

# Create FastAPI app instance
app = FastAPI()

# ------------------- CORS Middleware -------------------
# Allow cross-origin requests from frontend (e.g., localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with production frontend URL
    allow_credentials=True,  # Allow cookies for authentication
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (Authorization, Content-Type, etc.)
)

# ------------------- Router Registration -------------------
# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Include group-related routes
app.include_router(groups_router, prefix="/groups", tags=["Groups"])
app.include_router(group_members_router, prefix="/group-members", tags=["Group Members"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(messages_router, prefix="/messages", tags=["Messages"])
app.include_router(resources_router, prefix="/resources", tags=["Resources"])
app.include_router(badges_router, prefix="/badges", tags=["Badges"])
app.include_router(activity_router, prefix="/activity", tags=["Activity"])

# ------------------- Health Check Endpoint -------------------
@app.get("/")
def health_check():
    """
    Basic health check endpoint to verify server is running.
    """
    return {"message": "Server is running!"}