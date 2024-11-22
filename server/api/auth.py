from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from models.user import User
from core.security import get_current_user, verify_password, create_access_token, create_refresh_token, hash_password, decode_token
from core.database import get_db
from datetime import datetime

router = APIRouter()

# -------------------- Request Schemas --------------------

class CheckEmailRequest(BaseModel):
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str

# -------------------- API Endpoints --------------------

@router.post("/check-email")
def check_email(request: CheckEmailRequest, db: Session = Depends(get_db)):
    """
    Check if the email exists in the database.
    """
    user = db.query(User).filter(User.email == request.email).first()
    return {"exists": bool(user)}

@router.post("/login")
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Validate email and password, update last login, and issue tokens.
    """
    # Fetch user from database
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Update the last login timestamp
    user.last_login = datetime.utcnow()
    db.commit()

    # Generate tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    # Set the refresh token as a secure HTTP-only cookie
    response.set_cookie(
        key="refreshToken",
        value=refresh_token,
        httponly=True,
        secure=True,  # Set to False for local development, True for production
        samesite="Strict"  # Prevent CSRF attacks
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
def refresh(response: Response, refresh_token: str = Cookie(None)):
    """
    Issue a new access token using the refresh token.
    """
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        payload = decode_token(refresh_token)
    except HTTPException as e:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Generate a new access token
    access_token = create_access_token(data={"sub": payload["sub"]})

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user with default role as 'Normal'.
    """
    # Check if the email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and create a new user
    hashed_password = hash_password(request.password)
    new_user = User(
        email=request.email,
        password_hash=hashed_password,
        firstname=request.firstname,
        lastname=request.lastname,
        role="Normal"  # Default role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}

@router.post("/logout")
def logout(response: Response):
    """
    Clear the refresh token by deleting the cookie.
    """
    response.delete_cookie(key="refreshToken")
    return {"message": "Logged out successfully"}

@router.get("/user")
def get_user_info(current_user: User = Depends(get_current_user)):
    """
    Fetch the current logged-in user's information.
    """
    return {"firstname": current_user.firstname, "email": current_user.email}