from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from core.database import Base

# Model for the 'resources' table
class Resource(Base):
    __tablename__ = 'resources'

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey('groups.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(200), nullable=False)
    url = Column(Text, nullable=False)
    uploaded_at = Column(TIMESTAMP, default=func.current_timestamp())

    # Relationships
    group = relationship('Group', back_populates='resources')
    user = relationship('User', back_populates='resources')