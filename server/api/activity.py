from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from core.database import get_db
from core.security import get_current_user
from models.message import Message
from models.resource import Resource
from models.group_member import GroupMember
from models.group import Group
from models.user import User

router = APIRouter()

@router.get("/user/activity")
def get_recent_activity(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Fetch recent activities of the current user.
    Activities include:
    - Messages sent
    - Resources shared
    - Groups joined
    """
    # Messages sent by the user
    messages = (
        db.query(
            Message.id,
            func.concat("Posted a message: ", Message.content).label("activity"),
            Message.created_at.label("created_at"),
        )
        .filter(Message.user_id == current_user.id)
        .all()
    )

    # Resources shared by the user
    resources = (
        db.query(
            Resource.id,
            func.concat("Shared a resource: ", Resource.title).label("activity"),
            Resource.uploaded_at.label("created_at"),
        )
        .filter(Resource.user_id == current_user.id)
        .all()
    )

    # Groups joined by the user
    groups_joined = (
        db.query(
            GroupMember.id,
            func.concat("Joined Group: ", Group.name).label("activity"),
            GroupMember.joined_at.label("created_at"),
        )
        .join(Group, Group.id == GroupMember.group_id)  # Join to fetch the group name
        .filter(GroupMember.user_id == current_user.id)
        .all()
    )

    # Combine all activities into one list and sort by created_at
    activities = messages + resources + groups_joined
    activities.sort(key=lambda x: x.created_at, reverse=True)

    return {"activities": activities}
