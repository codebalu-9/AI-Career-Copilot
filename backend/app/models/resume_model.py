from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class ResumeModel:
    def __init__(
        self,
        user_id: str,
        filename: str,
        raw_text: str,
        extracted_skills: List[str],
        resume_score: Optional[float] = None,
        missing_skills: Optional[List[str]] = None,
        job_description: Optional[str] = None,
        created_at: Optional[datetime] = None,
        _id: Optional[ObjectId] = None,
    ):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.filename = filename
        self.raw_text = raw_text
        self.extracted_skills = extracted_skills
        self.resume_score = resume_score
        self.missing_skills = missing_skills or []
        self.job_description = job_description
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self._id,
            "user_id": self.user_id,
            "filename": self.filename,
            "raw_text": self.raw_text,
            "extracted_skills": self.extracted_skills,
            "resume_score": self.resume_score,
            "missing_skills": self.missing_skills,
            "job_description": self.job_description,
            "created_at": self.created_at,
        }

    @staticmethod
    def from_dict(data: dict):
        return ResumeModel(
            _id=data.get("_id"),
            user_id=data["user_id"],
            filename=data["filename"],
            raw_text=data["raw_text"],
            extracted_skills=data.get("extracted_skills", []),
            resume_score=data.get("resume_score"),
            missing_skills=data.get("missing_skills", []),
            job_description=data.get("job_description"),
            created_at=data.get("created_at"),
        )
