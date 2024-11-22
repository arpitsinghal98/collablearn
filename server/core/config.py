import os
import json
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables.")

# Algorithm for Token Signing
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # Default to HS256 if not specified

# Token Expiration Configuration
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# Load Secret Keys for Key Rotation
SECRET_KEY = os.getenv("SECRET_KEY")  # Legacy fallback key (if needed)
SECRET_KEYS_FILE = "secret_keys.json"

try:
    with open(SECRET_KEYS_FILE, "r") as f:
        SECRET_KEYS = json.load(f)
except FileNotFoundError:
    raise ValueError(f"Secret keys file '{SECRET_KEYS_FILE}' not found.")
except json.JSONDecodeError:
    raise ValueError(f"Secret keys file '{SECRET_KEYS_FILE}' is not a valid JSON.")

# Current Key Version
CURRENT_SECRET_KEY_VERSION = os.getenv("CURRENT_SECRET_KEY_VERSION")
if not CURRENT_SECRET_KEY_VERSION:
    raise ValueError("CURRENT_SECRET_KEY_VERSION is not set in the environment variables.")
if CURRENT_SECRET_KEY_VERSION not in SECRET_KEYS:
    raise ValueError(f"Current key version '{CURRENT_SECRET_KEY_VERSION}' not found in secret_keys.json.")

# Utility to Get Current Secret Key
def get_current_secret_key():
    return SECRET_KEYS[CURRENT_SECRET_KEY_VERSION]

# Utility to Get Secret Key by Version
def get_secret_key(version: str):
    return SECRET_KEYS.get(version)

# Database Session Management
def get_db():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal