from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.badge import Badge
from pydantic import BaseModel

router = APIRouter()

class AwardBadgeRequest(BaseModel):
    user_id: int
    badge_name: str

@router.post("/")
def award_badge(badge: AwardBadgeRequest, db: Session = Depends(get_db)):
    new_badge = Badge(
        user_id=badge.user_id,
        badge_name=badge.badge_name,
    )
    db.add(new_badge)
    db.commit()
    db.refresh(new_badge)
    return new_badge

@router.get("/{user_id}")
def get_badges(user_id: int, db: Session = Depends(get_db)):
    return db.query(Badge).filter(Badge.user_id == user_id).all()