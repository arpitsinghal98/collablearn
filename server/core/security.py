from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from core.config import get_current_secret_key, get_secret_key, CURRENT_SECRET_KEY_VERSION, ALGORITHM
from core.database import get_db
from models.user import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 bearer token setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ------------------ Password Hashing Utilities ------------------

def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its hashed version."""
    return pwd_context.verify(plain_password, hashed_password)

# ------------------ Token Creation ------------------

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Create a JWT access token with the current key version.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))  # Default to 15 mins
    to_encode.update({"exp": expire, "key_version": CURRENT_SECRET_KEY_VERSION})  # Add key version to payload
    return jwt.encode(to_encode, get_current_secret_key(), algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Create a JWT refresh token with the current key version.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=7))  # Default to 7 days
    to_encode.update({"exp": expire, "key_version": CURRENT_SECRET_KEY_VERSION})  # Add key version to payload
    return jwt.encode(to_encode, get_current_secret_key(), algorithm=ALGORITHM)

# ------------------ Token Validation ------------------

def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token using all available keys.
    """
    from core.config import SECRET_KEYS  # Import keys dynamically to ensure rotation works
    for version, key in SECRET_KEYS.items():
        try:
            payload = jwt.decode(token, key, algorithms=[ALGORITHM])
            if payload.get("key_version") == version:
                return payload
        except JWTError:
            continue  # Try the next key
    raise HTTPException(status_code=401, detail="Invalid or expired token")

# ------------------ Authentication ------------------

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Extract user information from a valid JWT token and fetch the user from the database.
    """
    try:
        payload = decode_token(token)
        user_email: str = payload.get("sub")
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except HTTPException as e:
        raise e  # Re-raise the exception with HTTP status
    except Exception:
        raise HTTPException(status_code=401, detail="Token validation failed")

    # Fetch user from the database
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user