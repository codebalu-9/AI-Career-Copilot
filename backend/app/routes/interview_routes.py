from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.utils.auth import get_current_user
from app.database import get_db
from app.services.interview_ai import generate_questions, evaluate_answer, compute_interview_score
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/interview", tags=["Interview"])


class QuestionRequest(BaseModel):
    role: str
    num_questions: int = 5


class AnswerSubmission(BaseModel):
    interview_id: str
    question: str
    answer: str
    question_number: int


class BulkAnswerSubmission(BaseModel):
    interview_id: str
    role: str
    answers: List[dict]  # [{question, answer}]


@router.post("/generate")
async def generate_interview(
    data: QuestionRequest,
    current_user: dict = Depends(get_current_user),
):
    questions = generate_questions(data.role, data.num_questions)

    db = get_db()
    user_id = str(current_user["_id"])

    interview_doc = {
        "user_id": user_id,
        "role": data.role,
        "questions": questions,
        "answers": [],
        "overall_score": None,
        "feedback": None,
        "status": "in_progress",
        "created_at": datetime.utcnow(),
    }

    result = await db.interview_results.insert_one(interview_doc)

    return {
        "interview_id": str(result.inserted_id),
        "role": data.role,
        "questions": questions,
        "total_questions": len(questions),
    }


@router.post("/evaluate")
async def evaluate_interview(
    data: BulkAnswerSubmission,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    try:
        interview = await db.interview_results.find_one({"_id": ObjectId(data.interview_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid interview ID")

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Access denied")

    # Evaluate each answer
    evaluations = []
    for item in data.answers:
        evaluation = evaluate_answer(item["question"], item["answer"], data.role)
        evaluations.append({
            "question": item["question"],
            "answer": item["answer"],
            "score": evaluation["score"],
            "feedback": evaluation["feedback"],
            "keywords_matched": evaluation.get("keywords_matched", []),
        })

    # Compute overall score
    overall = compute_interview_score(evaluations)

    # Update in DB
    await db.interview_results.update_one(
        {"_id": ObjectId(data.interview_id)},
        {"$set": {
            "answers": evaluations,
            "overall_score": overall["overall_score"],
            "grade": overall["grade"],
            "feedback": overall["summary"],
            "status": "completed",
            "completed_at": datetime.utcnow(),
        }},
    )

    return {
        "interview_id": data.interview_id,
        "overall_score": overall["overall_score"],
        "grade": overall["grade"],
        "summary": overall["summary"],
        "evaluations": evaluations,
    }


@router.get("/history")
async def get_interview_history(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    cursor = db.interview_results.find(
        {"user_id": user_id},
        sort=[("created_at", -1)],
        limit=10,
    )

    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)

    return {"history": results, "total": len(results)}
