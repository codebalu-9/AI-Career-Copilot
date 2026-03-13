from datetime import datetime
from typing import Optional, List, Dict
from bson import ObjectId


class InterviewModel:
    def __init__(
        self,
        user_id: str,
        role: str,
        questions: List[Dict],
        answers: Optional[List[Dict]] = None,
        overall_score: Optional[float] = None,
        feedback: Optional[str] = None,
        created_at: Optional[datetime] = None,
        _id: Optional[ObjectId] = None,
    ):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.role = role
        self.questions = questions
        self.answers = answers or []
        self.overall_score = overall_score
        self.feedback = feedback
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self._id,
            "user_id": self.user_id,
            "role": self.role,
            "questions": self.questions,
            "answers": self.answers,
            "overall_score": self.overall_score,
            "feedback": self.feedback,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data: dict):
        return InterviewModel(
            _id=data.get("_id"),
            user_id=data["user_id"],
            role=data["role"],
            questions=data.get("questions", []),
            answers=data.get("answers", []),
            overall_score=data.get("overall_score"),
            feedback=data.get("feedback"),
            created_at=data.get("created_at"),
        )
