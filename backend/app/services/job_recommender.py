from typing import List, Dict
from app.services.skill_extractor import ROLE_SKILLS


JOB_DESCRIPTIONS = {
    "software engineer": "Build scalable software systems, collaborate with cross-functional teams, and solve complex technical problems.",
    "frontend developer": "Create engaging user interfaces using modern frameworks like React, ensuring performance and accessibility.",
    "backend developer": "Design and implement server-side logic, APIs, and database architectures for web applications.",
    "fullstack developer": "Work across the entire stack—from UI design to backend APIs and database management.",
    "data scientist": "Analyze complex datasets, build predictive models, and derive actionable insights to drive business decisions.",
    "machine learning engineer": "Design and deploy ML models into production, building scalable AI-powered systems.",
    "devops engineer": "Automate infrastructure, manage CI/CD pipelines, and ensure system reliability and scalability.",
    "data engineer": "Build and maintain data pipelines, warehouses, and infrastructure to support analytics.",
    "mobile developer": "Develop cross-platform or native mobile applications for iOS and Android.",
    "cloud engineer": "Design and manage cloud infrastructure on AWS, Azure, or GCP with a focus on reliability.",
}

SALARY_RANGES = {
    "software engineer": "$90k - $160k",
    "frontend developer": "$80k - $140k",
    "backend developer": "$90k - $160k",
    "fullstack developer": "$85k - $155k",
    "data scientist": "$95k - $170k",
    "machine learning engineer": "$110k - $200k",
    "devops engineer": "$95k - $165k",
    "data engineer": "$95k - $160k",
    "mobile developer": "$85k - $150k",
    "cloud engineer": "$100k - $175k",
}


def recommend_jobs(user_skills: List[str]) -> List[Dict]:
    """Recommend job roles based on user's skills."""
    user_skill_set = {s.lower() for s in user_skills}
    recommendations = []

    for role, required_skills in ROLE_SKILLS.items():
        required_set = {s.lower() for s in required_skills}
        matching = user_skill_set.intersection(required_set)
        match_pct = (len(matching) / len(required_set) * 100) if required_set else 0

        if match_pct > 20:  # Only recommend if there's meaningful match
            recommendations.append({
                "role": role.title(),
                "match_percentage": round(match_pct, 1),
                "matching_skills": sorted(list(matching)),
                "missing_skills": sorted(list(required_set - user_skill_set))[:5],
                "description": JOB_DESCRIPTIONS.get(role, ""),
                "required_skills": required_skills,
                "salary_range": SALARY_RANGES.get(role, "Varies"),
                "demand": "High" if match_pct > 60 else "Medium" if match_pct > 40 else "Growing",
            })

    # Sort by match percentage
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
    return recommendations[:6]  # Return top 6


def get_career_path(current_role: str, target_role: str) -> Dict:
    """Get transition path from current to target role."""
    current_skills = set(ROLE_SKILLS.get(current_role.lower(), []))
    target_skills = set(ROLE_SKILLS.get(target_role.lower(), []))

    skills_to_gain = target_skills - current_skills
    transferable = current_skills.intersection(target_skills)

    return {
        "from_role": current_role,
        "to_role": target_role,
        "transferable_skills": sorted(list(transferable)),
        "skills_to_gain": sorted(list(skills_to_gain)),
        "estimated_transition_time": f"{len(skills_to_gain) * 2}-{len(skills_to_gain) * 4} weeks",
    }
