from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.message import Message
from pydantic import BaseModel

router = APIRouter()

class SendMessageRequest(BaseModel):
    group_id: int
    user_id: int
    content: str

@router.post("/")
def send_message(message: SendMessageRequest, db: Session = Depends(get_db)):
    new_message = Message(
        group_id=message.group_id,
        user_id=message.user_id,
        content=message.content,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/{group_id}")
def get_messages(group_id: int, db: Session = Depends(get_db)):
    return db.query(Message).filter(Message.group_id == group_id).all()