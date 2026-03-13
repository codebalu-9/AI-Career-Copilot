from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, status
from app.utils.auth import get_current_user
from app.database import get_db
from app.services.resume_parser import extract_text_from_pdf, clean_text
from app.services.skill_extractor import extract_skills_from_text, compute_skill_match
from app.schemas.resume_schema import ResumeUploadResponseSchema, ResumeScoreSchema, JobDescriptionSchema
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/resume", tags=["Resume"])

ALLOWED_TYPES = ["application/pdf", "application/octet-stream"]
MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/upload", response_model=ResumeUploadResponseSchema)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    # Validate file
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are accepted",
        )

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 5MB limit",
        )

    # Parse PDF
    try:
        raw_text = extract_text_from_pdf(content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    clean = clean_text(raw_text)
    skills = extract_skills_from_text(clean)

    # Save to database
    db = get_db()
    user_id = str(current_user["_id"])

    resume_doc = {
        "user_id": user_id,
        "filename": file.filename,
        "raw_text": raw_text,
        "extracted_skills": skills,
        "resume_score": None,
        "missing_skills": [],
        "created_at": datetime.utcnow(),
    }

    result = await db.resumes.insert_one(resume_doc)

    return ResumeUploadResponseSchema(
        resume_id=str(result.inserted_id),
        filename=file.filename,
        extracted_skills=skills,
        message=f"Resume parsed successfully. Found {len(skills)} skills.",
    )


@router.post("/score", response_model=ResumeScoreSchema)
async def score_resume(
    data: JobDescriptionSchema,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    try:
        resume = await db.resumes.find_one({"_id": ObjectId(data.resume_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resume ID")

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if resume["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Access denied")

    # Extract skills from job description
    from app.services.skill_extractor import extract_skills_from_text
    jd_skills = extract_skills_from_text(data.job_description)

    if not jd_skills:
        raise HTTPException(status_code=400, detail="No recognizable skills found in job description")

    # Compute match
    match = compute_skill_match(resume["extracted_skills"], jd_skills)

    # Generate recommendations
    recommendations = []
    if match["score"] < 50:
        recommendations.append("Your resume needs significant skill additions for this role.")
    elif match["score"] < 70:
        recommendations.append("Add a dedicated skills section highlighting your technical abilities.")
    else:
        recommendations.append("Strong match! Tailor your resume to highlight specific achievements.")

    if match["missing_skills"]:
        recommendations.append(f"Consider learning: {', '.join(match['missing_skills'][:3])}")

    recommendations.append("Quantify achievements (e.g., 'Improved performance by 30%')")
    recommendations.append("Add GitHub profile and project links")

    # Update resume in DB
    await db.resumes.update_one(
        {"_id": ObjectId(data.resume_id)},
        {"$set": {
            "resume_score": match["score"],
            "missing_skills": match["missing_skills"],
            "job_description": data.job_description,
        }},
    )

    return ResumeScoreSchema(
        resume_id=data.resume_id,
        resume_score=match["score"],
        extracted_skills=resume["extracted_skills"],
        missing_skills=match["missing_skills"],
        matching_skills=match["matching_skills"],
        recommendations=recommendations,
    )


@router.get("/latest")
async def get_latest_resume(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    resume = await db.resumes.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)],
    )

    if not resume:
        return {"message": "No resume uploaded yet", "resume": None}

    resume["_id"] = str(resume["_id"])
    return {"resume": resume}
