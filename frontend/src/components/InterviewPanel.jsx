import { useState } from 'react'
import { interviewAPI } from '../services/api.js'

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Fullstack Developer',
]

const diffColor = { easy: 'badge-green', medium: 'badge-amber', hard: 'badge-red' }

export default function InterviewPanel() {
  const [role,       setRole]       = useState('')
  const [numQ,       setNumQ]       = useState(5)
  const [session,    setSession]    = useState(null)   // {interview_id, questions}
  const [answers,    setAnswers]    = useState({})     // {qIndex: text}
  const [current,    setCurrent]    = useState(0)
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [phase,      setPhase]      = useState('setup') // setup | interview | result

  const startInterview = async () => {
    if (!role) return
    setLoading(true)
    setError('')
    try {
      const { data } = await interviewAPI.generate({ role, num_questions: numQ })
      setSession(data)
      setAnswers({})
      setCurrent(0)
      setResult(null)
      setPhase('interview')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate questions.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (idx, val) =>
    setAnswers(a => ({ ...a, [idx]: val }))

  const submitInterview = async () => {
    const answersArr = session.questions.map((q, i) => ({
      question: q.question,
      answer:   answers[i] || '',
    }))
    setSubmitting(true)
    setError('')
    try {
      const { data } = await interviewAPI.evaluate({
        interview_id: session.interview_id,
        role,
        answers: answersArr,
      })
      setResult(data)
      setPhase('result')
    } catch (err) {
      setError(err.response?.data?.detail || 'Evaluation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setPhase('setup')
    setSession(null)
    setResult(null)
    setAnswers({})
    setError('')
  }

  const gradeColor = (g) =>
    g === 'A' ? 'text-emerald-400' :
    g === 'B' ? 'text-brand-400' :
    g === 'C' ? 'text-amber-400' : 'text-rose-400'

  const answeredCount = Object.values(answers).filter(a => a?.trim()).length

  /* ── Setup phase ──────────────────────────────────── */
  if (phase === 'setup') return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title text-3xl">Mock Interview</h1>
        <p className="section-sub">Practice with AI-generated technical questions and get instant feedback</p>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Target Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="input">
            <option value="">Select a role…</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Number of Questions: {numQ}</label>
          <input
            type="range" min={3} max={10} value={numQ}
            onChange={e => setNumQ(+e.target.value)}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>3 (quick)</span><span>10 (full)</span>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">{error}</div>
        )}

        <button onClick={startInterview} disabled={!role || loading} className="btn-primary w-full py-3">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating questions…
            </span>
          ) : 'Start Interview →'}
        </button>
      </div>

      {/* Tips */}
      <div className="card p-5 space-y-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tips for success</p>
        {['Use the STAR method for behavioral questions', 'Write at least 2-3 sentences per answer', 'Include specific examples and keywords', 'Don\'t leave any answers blank'].map(t => (
          <div key={t} className="flex gap-2 text-sm text-slate-400">
            <span className="text-brand-400 shrink-0">✦</span>{t}
          </div>
        ))}
      </div>
    </div>
  )

  /* ── Interview phase ──────────────────────────────── */
  if (phase === 'interview') {
    const q = session.questions[current]
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title text-2xl">Mock Interview</h1>
            <p className="text-sm text-slate-400">{role} · {session.total_questions} questions</p>
          </div>
          <button onClick={reset} className="btn-ghost text-xs">✕ Cancel</button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Question {current + 1} of {session.total_questions}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((current + 1) / session.total_questions) * 100}%` }} />
          </div>
        </div>

        {/* Question tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {session.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-8 h-8 rounded-lg text-xs font-mono font-medium transition-all
                ${i === current ? 'bg-brand-600 text-white shadow-glow-sm' :
                  answers[i]?.trim() ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-white/[0.06] text-slate-400 hover:bg-white/[0.1]'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Current question card */}
        <div className="card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 flex items-center justify-center text-sm font-mono font-bold">
              {current + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge badge-blue">{q.topic}</span>
                <span className={`badge ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
              </div>
              <p className="text-white font-medium text-base leading-relaxed">{q.question}</p>
            </div>
          </div>

          <div>
            <label className="label">Your Answer</label>
            <textarea
              value={answers[current] || ''}
              onChange={e => handleAnswerChange(current, e.target.value)}
              rows={6}
              placeholder="Type your answer here. Be specific and use examples where possible…"
              className="input resize-none leading-relaxed"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-slate-600 font-mono">
                {(answers[current] || '').split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="btn-secondary"
          >← Prev</button>

          {current < session.total_questions - 1 ? (
            <button
              onClick={() => setCurrent(c => Math.min(session.total_questions - 1, c + 1))}
              className="btn-primary"
            >Next →</button>
          ) : (
            <button
              onClick={submitInterview}
              disabled={submitting || answeredCount === 0}
              className="btn-primary bg-emerald-600 hover:bg-emerald-500"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Evaluating…
                </span>
              ) : `Submit ${answeredCount}/${session.total_questions} Answers →`}
            </button>
          )}
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">{error}</div>
        )}
      </div>
    )
  }

  /* ── Result phase ─────────────────────────────────── */
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl">Interview Results</h1>
        <button onClick={reset} className="btn-secondary text-sm">New Interview</button>
      </div>

      {/* Overall score */}
      <div className="card p-8 text-center">
        <div className={`font-display text-7xl font-extrabold mb-2 ${gradeColor(result.grade)}`}>
          {result.grade}
        </div>
        <div className="text-4xl font-display font-bold text-white mb-2">{result.overall_score}%</div>
        <p className="text-slate-400 text-sm">{result.summary}</p>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-4">
        {result.evaluations.map((ev, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-white flex-1">{ev.question}</p>
              <span className={`shrink-0 font-mono font-bold text-sm ${
                ev.score >= 70 ? 'text-emerald-400' :
                ev.score >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>{ev.score}%</span>
            </div>
            <div className="progress-bar">
              <div className={`h-full rounded-full transition-all duration-700 ${
                ev.score >= 70 ? 'bg-emerald-500' :
                ev.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`} style={{ width: `${ev.score}%` }} />
            </div>
            <div className="text-xs text-slate-400 bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
              <span className="text-slate-500 font-medium">Feedback: </span>{ev.feedback}
            </div>
            {ev.keywords_matched?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {ev.keywords_matched.map(k => (
                  <span key={k} className="badge badge-green text-xs">{k}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
