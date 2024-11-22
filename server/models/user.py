from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from core.database import Base  # Import Base from your database setup
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    firstname = Column(String(100), nullable=True)  # Allow null for firstname
    lastname = Column(String(100), nullable=True)   # Allow null for lastname
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    last_login = Column(TIMESTAMP, nullable=True)   # Allow null initially
    role = Column(String(50), default="user", nullable=False)  # Default role
    active = Column(Boolean, default=True)

    groups = relationship("Group", back_populates="creator", cascade="all, delete-orphan")
    group_memberships = relationship("GroupMember", back_populates="user", cascade="all, delete-orphan")
    messages = relationship('Message', back_populates='user')
    resources = relationship('Resource', back_populates='user')
    badges = relationship('Badge', back_populates='user')