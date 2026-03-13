import { Link } from 'react-router-dom'
import { useAuth } from '../App.jsx'

const FEATURES = [
  {
    icon: '◈',
    color: 'brand',
    title: 'AI Resume Analyzer',
    desc: 'Upload your PDF and let AI extract skills, score against job descriptions, and surface exactly what is missing.',
  },
  {
    icon: '◎',
    color: 'violet',
    title: 'Mock Interviews',
    desc: 'Practice with role-specific technical questions. Get instant AI scoring and detailed feedback on every answer.',
  },
  {
    icon: '◆',
    color: 'amber',
    title: 'Skill Gap Analyzer',
    desc: 'Compare your current skills to any target role. Get a personalized roadmap with curated learning resources.',
  },
  {
    icon: '⬡',
    color: 'emerald',
    title: 'Job Recommendations',
    desc: 'AI matches your skills to real roles, ranks them by fit, and highlights what you need to close the gap.',
  },
]

const colorMap = {
  brand:   'text-brand-400 bg-brand-500/10 border-brand-500/20',
  violet:  'text-violet-400 bg-violet-500/10 border-violet-500/20',
  amber:   'text-amber-400  bg-amber-500/10  border-amber-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

export default function Home() {
  const { isAuth } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/[0.05] bg-surface/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 shadow-glow-sm text-white text-sm font-bold">✦</span>
            <span className="font-display font-bold text-white text-lg">
              Career<span className="text-brand-400">Copilot</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuth ? (
              <Link to="/dashboard" className="btn-primary text-sm">Dashboard →</Link>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">Get started free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-glow-brand pointer-events-none" />
        <div className="absolute top-24 left-1/4 w-64 h-64 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-64 h-64 rounded-full bg-brand-500/8 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            AI-powered career prep — 100% free to start
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Land your dream{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-cyan">
                internship
              </span>
              <span className="absolute inset-x-0 bottom-1 h-2 bg-brand-500/20 rounded" />
            </span>{' '}
            with AI
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Analyze your resume, ace mock interviews, close skill gaps, and discover the right roles — all powered by AI built for students.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base shadow-glow">
              Start for free →
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3.5 text-base">
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-xs text-slate-600">
            No credit card required · Resume parsing · AI mock interviews
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Everything you need to get hired</h2>
          <p className="text-slate-400 text-base">Four AI tools that cover every step of your job search</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, color, title, desc }) => (
            <div key={title} className="card-hover p-6 flex flex-col gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-xl ${colorMap[color]}`}>
                {icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-base mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-6 mb-20 rounded-3xl bg-surface-2 border border-white/[0.07] p-10 text-center max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-brand opacity-60 pointer-events-none" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-6">Create a free account and upload your resume in under 2 minutes.</p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base shadow-glow">
            Create free account →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center text-slate-600 text-xs">
        © {new Date().getFullYear()} AI Career Copilot. Built with ✦ for students.
      </footer>
    </div>
  )
}
