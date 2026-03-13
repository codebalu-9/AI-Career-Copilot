from datetime import datetime
from typing import Optional
from bson import ObjectId


class UserModel:
    def __init__(
        self,
        email: str,
        hashed_password: str,
        full_name: str,
        target_role: Optional[str] = None,
        created_at: Optional[datetime] = None,
        _id: Optional[ObjectId] = None,
    ):
        self._id = _id or ObjectId()
        self.email = email
        self.hashed_password = hashed_password
        self.full_name = full_name
        self.target_role = target_role
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self._id,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "full_name": self.full_name,
            "target_role": self.target_role,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data: dict):
        return UserModel(
            _id=data.get("_id"),
            email=data["email"],
            hashed_password=data["hashed_password"],
            full_name=data["full_name"],
            target_role=data.get("target_role"),
            created_at=data.get("created_at"),
        )
