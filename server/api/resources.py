from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.resource import Resource
from pydantic import BaseModel

router = APIRouter()

class CreateResourceRequest(BaseModel):
    group_id: int
    user_id: int
    title: str
    url: str

@router.post("/")
def add_resource(resource: CreateResourceRequest, db: Session = Depends(get_db)):
    new_resource = Resource(
        group_id=resource.group_id,
        user_id=resource.user_id,
        title=resource.title,
        url=resource.url,
    )
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource

@router.get("/{group_id}")
def get_resources(group_id: int, db: Session = Depends(get_db)):
    return db.query(Resource).filter(Resource.group_id == group_id).all()