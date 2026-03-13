import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { skillsAPI } from '../services/api.js'
import { useAuth } from '../App.jsx'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

function ScoreRing({ score, size = 120, label }) {
  const r  = 42
  const c  = 2 * Math.PI * r
  const pct = score != null ? score / 100 : 0
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c * (1 - pct)}`}
          strokeDashoffset={c * 0.25}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dy="0.35em" fill="white" fontSize="18" fontWeight="700" fontFamily="Syne">
          {score != null ? Math.round(score) : '—'}
        </text>
        {score != null && (
          <text x="50" y="64" textAnchor="middle" fill="#94a3b8" fontSize="8">/ 100</text>
        )}
      </svg>
      {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    </div>
  )
}

function StatCard({ label, value, sub, color = 'brand', icon }) {
  const colorMap = {
    brand:   'border-brand-500/25 bg-brand-500/5',
    emerald: 'border-emerald-500/25 bg-emerald-500/5',
    amber:   'border-amber-500/25 bg-amber-500/5',
    violet:  'border-violet-500/25 bg-violet-500/5',
  }
  return (
    <div className={`card p-5 border ${colorMap[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-display font-bold text-white mb-0.5">{value ?? '—'}</div>
      <div className="text-sm font-medium text-white/80">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    skillsAPI.dashboardStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const resume    = stats?.resume
  const interviews = stats?.interviews
  const skills    = stats?.top_skills || []

  // Radar chart data
  const radarData = skills.slice(0, 7).map(s => ({
    skill: s.charAt(0).toUpperCase() + s.slice(1),
    value: Math.floor(Math.random() * 40) + 60,
  }))

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-28 skeleton" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">

      {/* Greeting */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">
          Hey, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {user?.target_role ? `Working toward: ${user.target_role}` : 'Set a target role to get personalized insights.'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="◈" color="brand"
          label="Resume Score"
          value={resume?.score != null ? `${Math.round(resume.score)}%` : 'Upload'}
          sub={resume?.filename || 'No resume yet'}
        />
        <StatCard
          icon="◆" color="emerald"
          label="Skills Detected"
          value={resume?.skills_count || 0}
          sub="From your resume"
        />
        <StatCard
          icon="◎" color="violet"
          label="Interviews Done"
          value={interviews?.total_completed || 0}
          sub="Mock sessions"
        />
        <StatCard
          icon="★" color="amber"
          label="Avg. Interview"
          value={interviews?.average_score != null ? `${interviews.average_score}%` : '—'}
          sub="Across all sessions"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Resume score ring + quick links */}
        <div className="card p-6 flex flex-col items-center gap-5">
          <h2 className="section-title self-start">Resume Health</h2>
          <ScoreRing score={resume?.score} label="ATS Match Score" />
          {!resume?.uploaded ? (
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">Upload your resume to get started</p>
              <Link to="/resume" className="btn-primary text-sm">Upload Resume →</Link>
            </div>
          ) : (
            <div className="w-full space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Skills found</span>
                <span className="text-white font-medium">{resume.skills_count}</span>
              </div>
              <Link to="/resume" className="btn-secondary w-full text-sm mt-2">Re-analyze →</Link>
            </div>
          )}
        </div>

        {/* Skill radar */}
        <div className="card p-6">
          <h2 className="section-title mb-1">Skill Profile</h2>
          <p className="section-sub mb-4">Top skills from your resume</p>
          {skills.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar dataKey="value" stroke="#2aa2ff" fill="#2aa2ff" fillOpacity={0.15} strokeWidth={1.5} />
                <Tooltip
                  contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
              Upload resume to see skill radar
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card p-6 space-y-4">
          <h2 className="section-title">Quick Actions</h2>
          {[
            { to: '/resume',    icon: '◈', label: 'Analyze Resume',    sub: 'Upload & score against JD', color: 'brand' },
            { to: '/interview', icon: '◎', label: 'Mock Interview',     sub: 'Practice with AI feedback', color: 'violet' },
            { to: '/skills',    icon: '◆', label: 'Skill Gap Analysis', sub: 'Find what you are missing',   color: 'amber' },
          ].map(({ to, icon, label, sub, color }) => {
            const cMap = {
              brand:  'bg-brand-500/10 text-brand-400 border-brand-500/20',
              violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
              amber:  'bg-amber-500/10  text-amber-400  border-amber-500/20',
            }
            return (
              <Link key={to} to={to}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base ${cMap[color]}`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
                <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-sm">→</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent interview results */}
      {interviews?.recent?.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Interviews</h2>
            <Link to="/interview" className="btn-ghost text-xs">View all →</Link>
          </div>
          <div className="space-y-3">
            {interviews.recent.map((iv) => (
              <div key={iv._id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div>
                  <div className="text-sm font-medium text-white">{iv.role}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {new Date(iv.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${
                    iv.overall_score >= 70 ? 'badge-green' :
                    iv.overall_score >= 50 ? 'badge-amber' : 'badge-red'
                  }`}>
                    {iv.grade}
                  </span>
                  <span className="text-sm font-mono text-white">{iv.overall_score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top skills */}
      {skills.length > 0 && (
        <div className="card p-6">
          <h2 className="section-title mb-4">Detected Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
