from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from core.database import Base

# Model for the 'badges' table
class Badge(Base):
    __tablename__ = 'badges'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    badge_name = Column(String(100), nullable=False)
    awarded_at = Column(TIMESTAMP, default=func.current_timestamp())

    # Relationships
    user = relationship('User', back_populates='badges')