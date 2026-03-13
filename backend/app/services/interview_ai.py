import random
from typing import List, Dict
from difflib import SequenceMatcher

# Question bank organized by role and topic
QUESTION_BANK = {
    "software engineer": [
        {
            "question": "Explain the difference between a stack and a queue.",
            "topic": "Data Structures",
            "difficulty": "easy",
            "keywords": ["lifo", "fifo", "stack", "queue", "push", "pop", "enqueue", "dequeue"],
            "ideal_answer": "A stack follows LIFO (Last In First Out) - elements are added and removed from the same end. A queue follows FIFO (First In First Out) - elements are added at the rear and removed from the front.",
        },
        {
            "question": "What is Big O notation and why does it matter?",
            "topic": "Algorithms",
            "difficulty": "easy",
            "keywords": ["time complexity", "space complexity", "scalability", "performance", "algorithm"],
            "ideal_answer": "Big O notation describes algorithm efficiency in terms of time and space complexity relative to input size. It helps compare algorithms and predict performance at scale.",
        },
        {
            "question": "Explain the concept of recursion with an example.",
            "topic": "Algorithms",
            "difficulty": "medium",
            "keywords": ["base case", "recursive call", "function", "factorial", "fibonacci"],
            "ideal_answer": "Recursion is when a function calls itself to solve smaller subproblems. It needs a base case to stop. Example: factorial(n) = n * factorial(n-1), base case factorial(0) = 1.",
        },
        {
            "question": "What is the difference between SQL and NoSQL databases?",
            "topic": "Databases",
            "difficulty": "medium",
            "keywords": ["relational", "schema", "acid", "scalability", "flexible", "document", "mongodb"],
            "ideal_answer": "SQL databases are relational with fixed schemas and ACID compliance. NoSQL databases are flexible, schema-less, and designed for horizontal scalability.",
        },
        {
            "question": "Explain REST API principles.",
            "topic": "Web",
            "difficulty": "medium",
            "keywords": ["stateless", "http", "endpoints", "get", "post", "put", "delete", "resources"],
            "ideal_answer": "REST APIs are stateless, use HTTP methods (GET, POST, PUT, DELETE), identify resources via URLs, and return standard responses. They follow client-server architecture.",
        },
        {
            "question": "What are design patterns? Give an example.",
            "topic": "Software Design",
            "difficulty": "hard",
            "keywords": ["singleton", "factory", "observer", "mvc", "pattern", "reusable", "solution"],
            "ideal_answer": "Design patterns are reusable solutions to common software problems. Example: Singleton ensures only one instance of a class exists. Factory creates objects without specifying exact class.",
        },
    ],
    "data scientist": [
        {
            "question": "Explain the bias-variance tradeoff.",
            "topic": "Machine Learning",
            "difficulty": "medium",
            "keywords": ["overfitting", "underfitting", "bias", "variance", "generalization", "complexity"],
            "ideal_answer": "High bias causes underfitting, high variance causes overfitting. The goal is to balance both for optimal model generalization on unseen data.",
        },
        {
            "question": "How do you handle missing data in a dataset?",
            "topic": "Data Preprocessing",
            "difficulty": "easy",
            "keywords": ["imputation", "mean", "median", "drop", "forward fill", "interpolation"],
            "ideal_answer": "Options include: removing rows/columns, mean/median/mode imputation, forward/backward fill for time series, or using algorithms that handle missing values natively.",
        },
        {
            "question": "What is cross-validation and why is it important?",
            "topic": "Model Evaluation",
            "difficulty": "medium",
            "keywords": ["k-fold", "overfitting", "generalization", "train", "test", "validation"],
            "ideal_answer": "Cross-validation splits data into k folds, training on k-1 and testing on 1, rotating until all folds are used. It gives a more reliable estimate of model performance.",
        },
        {
            "question": "Explain precision, recall, and F1 score.",
            "topic": "Metrics",
            "difficulty": "medium",
            "keywords": ["true positive", "false positive", "false negative", "precision", "recall", "f1"],
            "ideal_answer": "Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = harmonic mean of both. Use precision when false positives are costly, recall when false negatives are costly.",
        },
        {
            "question": "What is feature engineering?",
            "topic": "Feature Engineering",
            "difficulty": "medium",
            "keywords": ["feature", "transform", "encode", "normalization", "extraction", "selection"],
            "ideal_answer": "Feature engineering involves transforming raw data into meaningful inputs for models. This includes encoding categoricals, normalizing numerics, creating interaction features, and removing irrelevant features.",
        },
    ],
    "frontend developer": [
        {
            "question": "Explain the virtual DOM and why React uses it.",
            "topic": "React",
            "difficulty": "medium",
            "keywords": ["virtual dom", "reconciliation", "performance", "diff", "real dom", "update"],
            "ideal_answer": "The virtual DOM is a lightweight JS representation of the real DOM. React uses it to compute minimal changes needed, then batch-updates the real DOM for better performance.",
        },
        {
            "question": "What is the difference between useState and useEffect in React?",
            "topic": "React Hooks",
            "difficulty": "easy",
            "keywords": ["state", "side effect", "render", "dependency", "cleanup", "lifecycle"],
            "ideal_answer": "useState manages component state, triggering re-renders on change. useEffect handles side effects (API calls, subscriptions) after renders, with an optional dependency array.",
        },
        {
            "question": "Explain CSS specificity.",
            "topic": "CSS",
            "difficulty": "medium",
            "keywords": ["specificity", "inline", "id", "class", "element", "important", "cascade"],
            "ideal_answer": "CSS specificity determines which styles apply when multiple rules match. Inline styles > ID selectors > Class selectors > Element selectors. !important overrides all.",
        },
        {
            "question": "What is event bubbling in JavaScript?",
            "topic": "JavaScript",
            "difficulty": "medium",
            "keywords": ["bubbling", "propagation", "parent", "child", "event", "stop", "capture"],
            "ideal_answer": "Event bubbling means events propagate from the target element up through parent elements. Use stopPropagation() to prevent this. The opposite is event capturing.",
        },
    ],
    "default": [
        {
            "question": "Tell me about a challenging project you've worked on.",
            "topic": "Behavioral",
            "difficulty": "easy",
            "keywords": ["challenge", "solution", "team", "result", "learned", "impact"],
            "ideal_answer": "Use STAR method: Situation, Task, Action, Result. Describe the challenge clearly, your specific actions, and quantifiable outcomes.",
        },
        {
            "question": "How do you stay updated with new technologies?",
            "topic": "Professional Development",
            "difficulty": "easy",
            "keywords": ["learning", "courses", "blogs", "community", "practice", "projects"],
            "ideal_answer": "Following tech blogs, building side projects, taking online courses, contributing to open source, attending meetups/conferences, and participating in developer communities.",
        },
        {
            "question": "Describe your approach to debugging a complex issue.",
            "topic": "Problem Solving",
            "difficulty": "medium",
            "keywords": ["reproduce", "isolate", "logs", "systematic", "test", "root cause"],
            "ideal_answer": "Start by reproducing the issue consistently, isolate the problem by eliminating variables, check logs and error messages, form hypotheses, test systematically, and fix root cause.",
        },
    ],
}


def generate_questions(role: str, num_questions: int = 5) -> List[Dict]:
    """Generate interview questions for a given role."""
    role_lower = role.lower()

    # Find matching question set
    questions = QUESTION_BANK.get("default", []).copy()
    for key in QUESTION_BANK:
        if key in role_lower or role_lower in key:
            questions = QUESTION_BANK[key].copy()
            break

    # Add some default behavioral questions
    default_q = QUESTION_BANK["default"]
    questions.extend(default_q)

    # Shuffle and select
    random.shuffle(questions)
    selected = questions[:num_questions]

    return [
        {
            "id": i + 1,
            "question": q["question"],
            "topic": q["topic"],
            "difficulty": q["difficulty"],
        }
        for i, q in enumerate(selected)
    ]


def evaluate_answer(question: str, user_answer: str, role: str) -> Dict:
    """Evaluate a user's answer to an interview question."""
    # Find the question in bank
    role_lower = role.lower()
    all_questions = []

    for key in QUESTION_BANK:
        if key in role_lower or role_lower in key or key == "default":
            all_questions.extend(QUESTION_BANK[key])

    # Find matching question
    matched_q = None
    for q in all_questions:
        if SequenceMatcher(None, q["question"].lower(), question.lower()).ratio() > 0.8:
            matched_q = q
            break

    if not matched_q:
        # Generic evaluation
        word_count = len(user_answer.split())
        if word_count < 10:
            score = 30
            feedback = "Your answer was too brief. Expand on your explanation."
        elif word_count < 30:
            score = 55
            feedback = "Decent answer but could use more detail and examples."
        else:
            score = 70
            feedback = "Good length answer. Make sure to include specific examples."

        return {"score": score, "feedback": feedback, "keywords_matched": [], "ideal_keywords": []}

    # Keyword-based evaluation
    answer_lower = user_answer.lower()
    keywords = matched_q.get("keywords", [])
    matched_keywords = [kw for kw in keywords if kw in answer_lower]

    keyword_score = (len(matched_keywords) / len(keywords) * 60) if keywords else 40

    # Length bonus
    word_count = len(user_answer.split())
    length_score = min(20, word_count * 0.5)

    # Similarity to ideal answer
    ideal = matched_q.get("ideal_answer", "")
    similarity = SequenceMatcher(None, user_answer.lower(), ideal.lower()).ratio()
    similarity_score = similarity * 20

    total_score = round(keyword_score + length_score + similarity_score)
    total_score = min(100, max(0, total_score))

    # Generate feedback
    if total_score >= 80:
        feedback = f"Excellent answer! You covered the key concepts well. Keywords matched: {', '.join(matched_keywords)}."
    elif total_score >= 60:
        feedback = f"Good answer. Consider also mentioning: {', '.join([kw for kw in keywords if kw not in answer_lower][:3])}."
    elif total_score >= 40:
        feedback = f"Partial credit. Important concepts to include: {', '.join(keywords[:4])}. Reference answer: {ideal}"
    else:
        feedback = f"Needs improvement. Key concepts to understand: {', '.join(keywords)}. Study answer: {ideal}"

    return {
        "score": total_score,
        "feedback": feedback,
        "keywords_matched": matched_keywords,
        "ideal_keywords": keywords,
        "ideal_answer": ideal,
    }


def compute_interview_score(evaluations: List[Dict]) -> Dict:
    """Compute overall interview score and feedback."""
    if not evaluations:
        return {"overall_score": 0, "summary": "No answers provided."}

    scores = [e.get("score", 0) for e in evaluations]
    avg = sum(scores) / len(scores)

    if avg >= 80:
        summary = "Outstanding performance! You're well-prepared for this role."
        grade = "A"
    elif avg >= 65:
        summary = "Good performance. Some areas for improvement but generally solid."
        grade = "B"
    elif avg >= 50:
        summary = "Average performance. Focus on strengthening core concepts."
        grade = "C"
    else:
        summary = "Needs improvement. Review fundamentals and practice more."
        grade = "D"

    return {
        "overall_score": round(avg, 1),
        "grade": grade,
        "summary": summary,
        "individual_scores": scores,
    }
