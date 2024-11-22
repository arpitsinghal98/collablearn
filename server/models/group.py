from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base  # Ensure this path is correct

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Example relationship (optional)
    creator = relationship("User", back_populates="groups")
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    messages = relationship('Message', back_populates='group')
    resources = relationship('Resource', back_populates='group')