import { useState } from 'react'
import { skillsAPI } from '../services/api.js'

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Fullstack Developer', 'Data Scientist', 'Machine Learning Engineer',
  'DevOps Engineer', 'Data Engineer', 'Mobile Developer', 'Cloud Engineer',
]

const priorityColor = {
  high:   'badge-red',
  medium: 'badge-amber',
  low:    'badge-blue',
}

function CircleProgress({ value, size = 100 }) {
  const r = 38
  const c = 2 * Math.PI * r
  const fill = (value / 100) * c
  const color = value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#f43f5e'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${fill} ${c - fill}`}
        strokeDashoffset={c * 0.25}
        style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
      <text x="50" y="50" textAnchor="middle" dy="0.35em" fill="white" fontSize="20" fontWeight="700" fontFamily="Syne">
        {Math.round(value)}%
      </text>
    </svg>
  )
}

export default function SkillGap() {
  const [role,     setRole]     = useState('')
  const [result,   setResult]   = useState(null)
  const [jobRecs,  setJobRecs]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [loadJobs, setLoadJobs] = useState(false)
  const [error,    setError]    = useState('')
  const [tab,      setTab]      = useState('gap') // gap | jobs

  const analyze = async () => {
    if (!role) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await skillsAPI.analyze(role)
      setResult(data)
      setTab('gap')
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  const loadJobRecs = async () => {
    setLoadJobs(true)
    setError('')
    try {
      const { data } = await skillsAPI.recommend()
      setJobRecs(data)
      setTab('jobs')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load recommendations.')
    } finally {
      setLoadJobs(false)
    }
  }

  const matchColor = (pct) =>
    pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-rose-400'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="section-title text-3xl">Skill Gap Analyzer</h1>
        <p className="section-sub">Compare your resume skills to any target role and get a learning roadmap</p>
      </div>

      {/* Role selector */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="label">Target Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="input">
              <option value="">Select a role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={analyze} disabled={!role || loading} className="btn-primary py-3 px-6">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing…
                </span>
              ) : 'Analyze Gap'}
            </button>
            <button onClick={loadJobRecs} disabled={loadJobs} className="btn-secondary py-3 px-5">
              {loadJobs ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : '⬡ Job Matches'}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      {(result || jobRecs) && (
        <div className="flex gap-1 border-b border-white/[0.06] pb-0">
          {result && (
            <button
              onClick={() => setTab('gap')}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px
                ${tab === 'gap' ? 'border-brand-400 text-white' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
            >
              Skill Gap
            </button>
          )}
          {jobRecs && (
            <button
              onClick={() => setTab('jobs')}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px
                ${tab === 'jobs' ? 'border-brand-400 text-white' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
            >
              Job Recommendations
            </button>
          )}
        </div>
      )}

      {/* ── Skill Gap Tab ─────────────────────────────── */}
      {tab === 'gap' && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Match overview */}
          <div className="card p-6 flex flex-col sm:flex-row items-center gap-8">
            <CircleProgress value={result.match_percentage} size={120} />
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-white mb-1">
                {result.match_percentage >= 70 ? '🎯 Strong match!' :
                 result.match_percentage >= 40 ? '⚡ Getting there' : '📚 Room to grow'}
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                You have{' '}
                <span className="text-white font-medium">{result.matching_skills.length}</span> of{' '}
                <span className="text-white font-medium">{result.required_skills.length}</span> required skills for{' '}
                <span className="text-brand-300 font-medium">{result.target_role}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-green">{result.matching_skills.length} matched</span>
                <span className="badge badge-red">{result.missing_skills.length} missing</span>
                <span className="badge badge-blue">{result.current_skills.length} total skills</span>
              </div>
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* You have */}
            <div className="card p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3 font-medium">
                ✓ Skills You Have
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {result.matching_skills.length > 0
                  ? result.matching_skills.map(s => <span key={s} className="skill-pill">{s}</span>)
                  : <span className="text-slate-600 text-sm">None matching yet</span>
                }
              </div>
            </div>

            {/* You need */}
            <div className="card p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3 font-medium">
                ✗ Skills to Acquire
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {result.missing_skills.length > 0
                  ? result.missing_skills.map(s => <span key={s} className="skill-pill-missing">{s}</span>)
                  : <span className="text-emerald-400 text-sm">No gaps — you are fully qualified! 🎉</span>
                }
              </div>
            </div>
          </div>

          {/* Learning Roadmap */}
          {result.learning_roadmap?.length > 0 && (
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-white text-lg">Learning Roadmap</h2>
              <p className="text-slate-400 text-sm">Curated resources to close your skill gaps</p>
              <div className="space-y-3">
                {result.learning_roadmap.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]
                                          hover:border-brand-500/25 transition-colors group">
                    {/* Step number */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-brand-500/15 border border-brand-500/25
                                    text-brand-400 flex items-center justify-center text-xs font-mono font-bold">
                      {i + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-mono text-sm font-medium text-white">{item.skill}</span>
                        <span className={`badge ${priorityColor[item.priority] || 'badge-blue'}`}>
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.platform} · <span className="text-slate-400">{item.course}</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-slate-400 font-mono">{item.estimated_duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Jobs Tab ──────────────────────────────────── */}
      {tab === 'jobs' && jobRecs && (
        <div className="space-y-6 animate-fade-in">
          {jobRecs.message && (
            <div className="card p-6 text-center">
              <p className="text-slate-400">{jobRecs.message}</p>
              <a href="/resume" className="btn-primary mt-4 inline-flex">Upload Resume →</a>
            </div>
          )}

          {jobRecs.recommendations?.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-white text-lg">Recommended Roles</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Based on {jobRecs.based_on_skills?.length} detected skills</p>
                </div>
                <span className="badge badge-blue">{jobRecs.total} matches</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobRecs.recommendations.map((job, i) => (
                  <div key={i} className="card-hover p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-white">{job.role}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">{job.salary_range}</p>
                      </div>
                      <span className={`font-mono font-bold text-lg shrink-0 ${matchColor(job.match_percentage)}`}>
                        {job.match_percentage}%
                      </span>
                    </div>

                    {/* Match bar */}
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${job.match_percentage}%` }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>

                    {/* Tags row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex flex-wrap gap-1">
                        {job.matching_skills.slice(0, 3).map(s => (
                          <span key={s} className="skill-pill">{s}</span>
                        ))}
                        {job.matching_skills.length > 3 && (
                          <span className="badge badge-blue">+{job.matching_skills.length - 3}</span>
                        )}
                      </div>
                      <span className={`badge text-xs ${
                        job.demand === 'High'    ? 'badge-green' :
                        job.demand === 'Medium'  ? 'badge-amber' : 'badge-blue'
                      }`}>
                        {job.demand} demand
                      </span>
                    </div>

                    {/* Missing */}
                    {job.missing_skills?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Missing:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.missing_skills.slice(0, 4).map(s => (
                            <span key={s} className="skill-pill-missing">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {jobRecs.recommendations?.length === 0 && !jobRecs.message && (
            <div className="card p-8 text-center">
              <p className="text-slate-400">No job matches found. Upload a resume with more skills.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
