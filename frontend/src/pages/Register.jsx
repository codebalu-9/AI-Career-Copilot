import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api.js'
import { useAuth } from '../App.jsx'

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Fullstack Developer', 'Data Scientist', 'Machine Learning Engineer',
  'DevOps Engineer', 'Data Engineer', 'Mobile Developer', 'Cloud Engineer',
]

export default function Register() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ full_name: '', email: '', password: '', target_role: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      login(data.access_token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-glow-brand pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 shadow-glow text-white font-bold">✦</span>
            <span className="font-display font-bold text-white text-xl">
              Career<span className="text-brand-400">Copilot</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm">Free forever — no credit card needed</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full name</label>
              <input
                name="full_name"
                type="text"
                required
                value={form.full_name}
                onChange={handleChange}
                placeholder="Alex Johnson"
                className="input"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                className="input"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="input"
              />
            </div>

            <div>
              <label className="label">Target role <span className="text-slate-600 normal-case">(optional)</span></label>
              <select
                name="target_role"
                value={form.target_role}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select a role…</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create free account →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
