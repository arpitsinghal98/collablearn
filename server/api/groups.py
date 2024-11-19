from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.group import Group
from models.user import User
from core.database import get_db
from core.security import get_current_user

router = APIRouter()

# Request schemas
class GroupCreateRequest(BaseModel):
    name: str
    description: str

@router.post("/")
def create_group(request: GroupCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new group.
    """
    new_group = Group(
        name=request.name,
        description=request.description,
        created_by=current_user.id
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return {"message": "Group created successfully", "group_id": new_group.id}

@router.get("/")
def list_groups(db: Session = Depends(get_db)):
    """
    List all groups.
    """
    groups = db.query(Group).all()
    return groups

@router.put("/{group_id}")
def update_group(group_id: int, request: GroupCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Update a group.
    """
    group = db.query(Group).filter(Group.id == group_id, Group.created_by == current_user.id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    group.name = request.name
    group.description = request.description
    db.commit()
    db.refresh(group)
    return {"message": "Group updated successfully", "group_id": group.id}

@router.delete("/{group_id}")
def delete_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete a group.
    """
    group = db.query(Group).filter(Group.id == group_id, Group.created_by == current_user.id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    db.delete(group)
    db.commit()
    return {"message": "Group deleted successfully"}