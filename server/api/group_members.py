from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from models.group_member import GroupMember
from models.group import Group
from models.user import User

router = APIRouter()

@router.post("/join")
def join_group(group_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    Add the current user to a group.
    """
    # Check if group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Check if user is already a member
    existing_membership = (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id, GroupMember.user_id == current_user.id)
        .first()
    )
    if existing_membership:
        raise HTTPException(status_code=400, detail="User is already a member of the group")

    # Add user to group
    new_member = GroupMember(group_id=group_id, user_id=current_user.id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return {"message": "Joined group successfully", "group_id": group_id}

@router.post("/leave")
def leave_group(group_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    Remove the current user from a group.
    """
    membership = (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id, GroupMember.user_id == current_user.id)
        .first()
    )
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    db.delete(membership)
    db.commit()
    return {"message": "Left group successfully", "group_id": group_id}

@router.get("/{group_id}/members")
def list_group_members(group_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    List all members of a specific group.
    """
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    members = (
        db.query(User)
        .join(GroupMember, GroupMember.user_id == User.id)
        .filter(GroupMember.group_id == group_id)
        .all()
    )
    return members

@router.get("/user/groups")
def get_user_groups(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Fetch groups the current user is a part of.
    """
    user_groups = (
        db.query(Group)
        .join(GroupMember, Group.id == GroupMember.group_id)
        .filter(GroupMember.user_id == current_user.id)
        .all()
    )
    return user_groups

