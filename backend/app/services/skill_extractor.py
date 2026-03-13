import re
from typing import List, Set

# Comprehensive tech skills dictionary
TECH_SKILLS = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
    "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl",
    "bash", "shell", "powershell", "dart", "elixir", "haskell", "lua",

    # Frontend
    "react", "reactjs", "react.js", "vue", "vuejs", "angular", "svelte",
    "nextjs", "next.js", "nuxtjs", "html", "css", "sass", "scss", "less",
    "tailwind", "bootstrap", "material-ui", "mui", "styled-components",
    "webpack", "vite", "redux", "mobx", "jquery", "d3.js", "three.js",

    # Backend
    "node.js", "nodejs", "express", "fastapi", "django", "flask", "spring",
    "spring boot", "rails", "laravel", "nestjs", "graphql", "rest", "grpc",
    "microservices", "serverless", "websockets",

    # Databases
    "mongodb", "postgresql", "mysql", "sqlite", "redis", "elasticsearch",
    "cassandra", "dynamodb", "firebase", "supabase", "prisma", "sqlalchemy",
    "mongoose", "sequelize", "neo4j", "influxdb",

    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
    "terraform", "ansible", "jenkins", "github actions", "circleci",
    "travis ci", "nginx", "apache", "linux", "git", "ci/cd", "devops",
    "cloudformation", "helm", "prometheus", "grafana", "datadog",

    # AI/ML
    "machine learning", "deep learning", "neural networks", "nlp",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "seaborn", "opencv", "huggingface",
    "langchain", "llm", "bert", "transformers", "openai", "reinforcement learning",

    # Mobile
    "react native", "flutter", "android", "ios", "xcode", "android studio",

    # Tools & Other
    "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack",
    "figma", "adobe xd", "postman", "swagger", "linux", "agile", "scrum",
    "kanban", "tdd", "bdd", "unit testing", "jest", "pytest", "selenium",
    "cypress", "playwright", "kafka", "rabbitmq", "celery", "spark", "hadoop",
}

# Role-to-skills mapping
ROLE_SKILLS = {
    "software engineer": [
        "python", "javascript", "java", "git", "data structures", "algorithms",
        "rest", "sql", "linux", "agile", "unit testing", "docker"
    ],
    "frontend developer": [
        "javascript", "typescript", "react", "css", "html", "git", "webpack",
        "responsive design", "redux", "testing", "accessibility"
    ],
    "backend developer": [
        "python", "java", "nodejs", "sql", "mongodb", "rest", "graphql",
        "docker", "linux", "git", "postgresql", "redis", "microservices"
    ],
    "data scientist": [
        "python", "pandas", "numpy", "scikit-learn", "sql", "machine learning",
        "statistics", "matplotlib", "tensorflow", "jupyter", "r", "spark"
    ],
    "machine learning engineer": [
        "python", "tensorflow", "pytorch", "scikit-learn", "docker", "kubernetes",
        "mlops", "sql", "git", "aws", "deep learning", "nlp", "computer vision"
    ],
    "devops engineer": [
        "docker", "kubernetes", "aws", "terraform", "ci/cd", "linux", "bash",
        "jenkins", "prometheus", "grafana", "ansible", "git", "python"
    ],
    "fullstack developer": [
        "javascript", "typescript", "react", "nodejs", "python", "sql", "mongodb",
        "html", "css", "git", "docker", "rest", "aws"
    ],
    "mobile developer": [
        "swift", "kotlin", "react native", "flutter", "android", "ios",
        "git", "rest", "firebase", "testing"
    ],
    "data engineer": [
        "python", "sql", "spark", "hadoop", "kafka", "airflow", "aws",
        "dbt", "postgresql", "redis", "docker", "etl"
    ],
    "cloud engineer": [
        "aws", "azure", "gcp", "terraform", "kubernetes", "docker", "linux",
        "python", "networking", "security", "ci/cd", "monitoring"
    ],
}

# Learning resources for skills
LEARNING_RESOURCES = {
    "python": {"platform": "Coursera", "course": "Python for Everybody", "duration": "2 months"},
    "javascript": {"platform": "freeCodeCamp", "course": "JavaScript Algorithms", "duration": "3 months"},
    "react": {"platform": "Udemy", "course": "React - The Complete Guide", "duration": "6 weeks"},
    "machine learning": {"platform": "Coursera", "course": "ML Specialization (Andrew Ng)", "duration": "3 months"},
    "docker": {"platform": "Docker Docs", "course": "Docker Getting Started", "duration": "2 weeks"},
    "kubernetes": {"platform": "Linux Foundation", "course": "Kubernetes Fundamentals", "duration": "6 weeks"},
    "aws": {"platform": "AWS Training", "course": "AWS Cloud Practitioner", "duration": "4 weeks"},
    "sql": {"platform": "Mode Analytics", "course": "SQL Tutorial", "duration": "2 weeks"},
    "tensorflow": {"platform": "Coursera", "course": "Deep Learning Specialization", "duration": "3 months"},
    "pytorch": {"platform": "fast.ai", "course": "Practical Deep Learning", "duration": "2 months"},
    "typescript": {"platform": "Official Docs", "course": "TypeScript Handbook", "duration": "3 weeks"},
    "nodejs": {"platform": "Udemy", "course": "Node.js - The Complete Guide", "duration": "6 weeks"},
    "git": {"platform": "GitHub", "course": "Git & GitHub for Beginners", "duration": "1 week"},
    "default": {"platform": "Udemy/Coursera", "course": "Search for dedicated courses", "duration": "Varies"},
}


def extract_skills_from_text(text: str) -> List[str]:
    """Extract technical skills from resume text using keyword matching."""
    text_lower = text.lower()
    found_skills = set()

    for skill in TECH_SKILLS:
        # Use word boundary matching to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    return sorted(list(found_skills))


def compute_skill_match(resume_skills: List[str], required_skills: List[str]) -> dict:
    """Compare resume skills against required skills."""
    resume_set = {s.lower() for s in resume_skills}
    required_set = {s.lower() for s in required_skills}

    matching = resume_set.intersection(required_set)
    missing = required_set - resume_set

    score = (len(matching) / len(required_set) * 100) if required_set else 0

    return {
        "matching_skills": sorted(list(matching)),
        "missing_skills": sorted(list(missing)),
        "score": round(score, 1),
    }


def get_required_skills_for_role(role: str) -> List[str]:
    """Get required skills for a given job role."""
    role_lower = role.lower()
    for key, skills in ROLE_SKILLS.items():
        if key in role_lower or role_lower in key:
            return skills

    # Fuzzy match
    for key, skills in ROLE_SKILLS.items():
        words = role_lower.split()
        if any(word in key for word in words):
            return skills

    # Default to software engineer
    return ROLE_SKILLS["software engineer"]


def get_learning_roadmap(missing_skills: List[str]) -> List[dict]:
    """Generate learning roadmap for missing skills."""
    roadmap = []
    for skill in missing_skills[:10]:  # Limit to top 10
        resource = LEARNING_RESOURCES.get(skill.lower(), LEARNING_RESOURCES["default"])
        roadmap.append({
            "skill": skill,
            "platform": resource["platform"],
            "course": resource["course"],
            "estimated_duration": resource["duration"],
            "priority": "high" if skill in ["python", "javascript", "git", "sql"] else "medium",
        })
    return roadmap
