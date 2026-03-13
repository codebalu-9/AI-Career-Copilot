from fastapi import APIRouter, Depends, Query
from app.utils.auth import get_current_user
from app.database import get_db
from app.services.skill_extractor import (
    get_required_skills_for_role,
    compute_skill_match,
    get_learning_roadmap,
)
from app.services.job_recommender import recommend_jobs
from datetime import datetime

router = APIRouter(tags=["Skills & Jobs"])


@router.get("/skills/analyze")
async def analyze_skills(
    role: str = Query(..., description="Target job role"),
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    user_id = str(current_user["_id"])

    # Get latest resume
    resume = await db.resumes.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)],
    )

    current_skills = resume["extracted_skills"] if resume else []
    required_skills = get_required_skills_for_role(role)
    match = compute_skill_match(current_skills, required_skills)
    roadmap = get_learning_roadmap(match["missing_skills"])

    # Save analysis
    analysis_doc = {
        "user_id": user_id,
        "target_role": role,
        "current_skills": current_skills,
        "required_skills": required_skills,
        "missing_skills": match["missing_skills"],
        "match_percentage": match["score"],
        "created_at": datetime.utcnow(),
    }
    await db.skill_analysis.insert_one(analysis_doc)

    return {
        "target_role": role,
        "current_skills": current_skills,
        "required_skills": required_skills,
        "missing_skills": match["missing_skills"],
        "matching_skills": match["matching_skills"],
        "match_percentage": match["score"],
        "learning_roadmap": roadmap,
    }


@router.get("/jobs/recommend")
async def get_job_recommendations(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    # Get latest resume skills
    resume = await db.resumes.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)],
    )

    skills = resume["extracted_skills"] if resume else []

    if not skills:
        return {
            "message": "Upload a resume to get personalized job recommendations",
            "recommendations": [],
        }

    recommendations = recommend_jobs(skills)

    return {
        "based_on_skills": skills,
        "recommendations": recommendations,
        "total": len(recommendations),
    }


@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    # Get latest resume
    resume = await db.resumes.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)],
    )

    # Get interview history
    interviews = []
    cursor = db.interview_results.find(
        {"user_id": user_id, "status": "completed"},
        sort=[("created_at", -1)],
        limit=5,
    )
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        interviews.append(doc)

    # Compute average interview score
    avg_score = None
    if interviews:
        scores = [i.get("overall_score", 0) for i in interviews if i.get("overall_score")]
        avg_score = round(sum(scores) / len(scores), 1) if scores else None

    return {
        "resume": {
            "uploaded": resume is not None,
            "skills_count": len(resume.get("extracted_skills", [])) if resume else 0,
            "score": resume.get("resume_score") if resume else None,
            "filename": resume.get("filename") if resume else None,
        },
        "interviews": {
            "total_completed": len(interviews),
            "average_score": avg_score,
            "recent": interviews[:3],
        },
        "top_skills": resume.get("extracted_skills", [])[:10] if resume else [],
    }
