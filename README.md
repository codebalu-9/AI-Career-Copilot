# ✦ AI Career Copilot 

> An AI-powered career preparation platform that helps students land internships and jobs through intelligent resume analysis, mock interviews, skill gap detection, and job recommendations.

![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-blue)
![Stack](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-green)
![Stack](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Stack](https://img.shields.io/badge/AI-spaCy%20%2B%20scikit--learn-orange)

---

## 📁 Project Structure

```
ai-career-copilot/
├── frontend/                        # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Fixed top navigation
│   │   │   ├── Dashboard.jsx        # Stats, radar chart, quick links
│   │   │   ├── ResumeUpload.jsx     # PDF upload + ATS scoring
│   │   │   ├── InterviewPanel.jsx   # Mock interview + evaluation
│   │   │   └── SkillGap.jsx         # Gap analysis + job recs
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Public landing page
│   │   │   ├── Login.jsx            # Auth – sign in
│   │   │   └── Register.jsx         # Auth – create account
│   │   ├── services/
│   │   │   └── api.js               # Axios client + all API calls
│   │   ├── App.jsx                  # Router, AuthContext, protected routes
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind + global design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                         # FastAPI + Python
    ├── app/
    │   ├── main.py                  # FastAPI app, CORS, lifespan
    │   ├── config.py                # Settings (pydantic-settings + .env)
    │   ├── database.py              # Motor async MongoDB client
    │   ├── models/
    │   │   ├── user_model.py
    │   │   ├── resume_model.py
    │   │   └── interview_model.py
    │   ├── schemas/
    │   │   ├── user_schema.py       # Pydantic request/response schemas
    │   │   └── resume_schema.py
    │   ├── routes/
    │   │   ├── auth_routes.py       # POST /auth/register, /auth/login, /auth/me
    │   │   ├── resume_routes.py     # POST /resume/upload, /resume/score
    │   │   ├── interview_routes.py  # POST /interview/generate, /interview/evaluate
    │   │   └── skill_routes.py      # GET /skills/analyze, /jobs/recommend, /dashboard/stats
    │   ├── services/
    │   │   ├── resume_parser.py     # PyPDF2 text extraction
    │   │   ├── skill_extractor.py   # NLP keyword extraction + role mapping
    │   │   ├── interview_ai.py      # Question bank + answer evaluation
    │   │   └── job_recommender.py   # Skill-based job matching
    │   └── utils/
    │       ├── auth.py              # bcrypt hashing + JWT dependency
    │       └── jwt_handler.py       # Token creation + verification
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10+ |
| Node.js | 18+ |
| MongoDB | 6+ (local or Atlas) |

---

### 1. Clone & Setup

```bash
git clone https://github.com/yourname/ai-career-copilot.git
cd ai-career-copilot
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URL and a strong SECRET_KEY
```

**`.env` configuration:**
```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=ai_career_copilot
SECRET_KEY=your-super-long-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DEBUG=false
```

**Start the backend server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API docs available at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_URL if your backend is not on localhost:8000
```

**Start the frontend dev server:**
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. MongoDB Setup

**Option A — Local MongoDB:**
```bash
# macOS
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

**Option B — MongoDB Atlas (Cloud):**
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get your connection string
3. Set `MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net` in `.env`

The app auto-creates all collections and indexes on first start.

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Sign in, receive JWT |
| GET  | `/auth/me` | Get current user |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/upload` | Upload PDF, extract skills |
| POST | `/resume/score` | Score against job description |
| GET  | `/resume/latest` | Get latest resume data |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/interview/generate` | Generate questions for role |
| POST | `/interview/evaluate` | Submit answers, get scores |
| GET  | `/interview/history` | Get past sessions |

### Skills & Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills/analyze?role=...` | Skill gap for target role |
| GET | `/jobs/recommend` | Job recommendations |
| GET | `/dashboard/stats` | Aggregated dashboard data |

---

## 🗄️ Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | User accounts, hashed passwords, target role |
| `resumes` | Extracted text, skills, ATS scores |
| `interview_results` | Questions, answers, evaluations, scores |
| `skill_analysis` | Gap reports per role per user |

---

## 🧠 AI Modules

### `resume_parser.py`
- Uses **PyPDF2** to extract raw text from uploaded PDFs
- Cleans and normalizes text for downstream NLP
- Attempts to identify resume sections (skills, experience, education)

### `skill_extractor.py`
- **Keyword matching** against a curated dictionary of 100+ tech skills
- Role-to-skill mapping for 10+ job families
- Gap computation: matching vs. missing skills with percentage score
- Learning roadmap generation with platform + course + duration

### `interview_ai.py`
- Structured question bank organized by role, topic, difficulty
- Answer evaluation using keyword matching + semantic similarity
- Per-answer scoring (0–100) with keyword feedback
- Overall grade (A/B/C/D) with summary

### `job_recommender.py`
- Matches resume skills to 10 job roles
- Ranks by match percentage
- Returns salary ranges, demand level, missing skills

---

## 🏗️ Production Deployment

### Backend (Railway / Render / AWS EC2)
```bash
# Production start command
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Or with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

Update `ALLOWED_ORIGINS` in `config.py` with your frontend domain.

### Frontend (Vercel / Netlify)
```bash
npm run build
# dist/ folder is ready to deploy
```

Set `VITE_API_URL=https://your-api-domain.com` in your hosting platform's env vars.

### Environment Variables Checklist
- [ ] `SECRET_KEY` — use a 64+ character random string in production
- [ ] `MONGODB_URL` — use MongoDB Atlas for production
- [ ] `ALLOWED_ORIGINS` — set to your actual frontend URL
- [ ] `DEBUG=false` in production

---

## ✨ Features Overview

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ |
| PDF Resume Parsing | ✅ |
| Skill Extraction (NLP) | ✅ |
| ATS Match Scoring | ✅ |
| Mock Interview Generation | ✅ |
| AI Answer Evaluation | ✅ |
| Skill Gap Analysis | ✅ |
| Learning Roadmap | ✅ |
| Job Recommendations | ✅ |
| Dashboard with Charts | ✅ |
| Responsive Design | ✅ |
| Protected Routes | ✅ |

---

## 🛡️ Security Notes

- Passwords hashed with **bcrypt** (passlib)
- JWTs signed with HS256, expire in 24 hours
- All protected routes require `Authorization: Bearer <token>`
- File upload limited to PDF, max 5 MB
- CORS restricted to configured origins

---

## 📦 Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS 3 · React Router v6 · Axios · Recharts

**Backend:** Python 3.10+ · FastAPI · Uvicorn · Pydantic v2 · Motor (async MongoDB)

**AI/NLP:** PyPDF2 · spaCy · scikit-learn · keyword matching · sequence similarity

**Auth:** python-jose (JWT) · passlib (bcrypt)

**Database:** MongoDB · Motor (async driver)

---

## 📄 License

MIT — free to use, modify, and deploy.
