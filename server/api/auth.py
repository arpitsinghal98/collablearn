from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from models.user import User
from core.security import verify_password, create_access_token, hash_password
from core.database import get_db
from datetime import datetime

router = APIRouter()

# Request schemas
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

@router.post("/check-email")
def check_email(request: CheckEmailRequest, db: Session = Depends(get_db)):
    """
    Check if the email exists in the database.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        return {"exists": True}
    return {"exists": False}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Validate the email and password, and update the last login timestamp.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Update the last_login timestamp
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Generate JWT token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user with default role as 'Normal'.
    """
    # Check if the email already exists in the database
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = hash_password(request.password)

    # Create a new user with the default role as 'Normal'
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
