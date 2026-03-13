from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ResumeUploadResponseSchema(BaseModel):
    resume_id: str
    filename: str
    extracted_skills: List[str]
    message: str


class ResumeScoreSchema(BaseModel):
    resume_id: str
    resume_score: float
    extracted_skills: List[str]
    missing_skills: List[str]
    matching_skills: List[str]
    recommendations: List[str]


class JobDescriptionSchema(BaseModel):
    job_description: str
    resume_id: str


class SkillGapSchema(BaseModel):
    target_role: str
    current_skills: List[str]
    required_skills: List[str]
    missing_skills: List[str]
    match_percentage: float
    learning_roadmap: List[dict]


class JobRecommendationSchema(BaseModel):
    role: str
    match_percentage: float
    matching_skills: List[str]
    description: str
    required_skills: List[str]
