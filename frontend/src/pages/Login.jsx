import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api.js'
import { useAuth } from '../App.jsx'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login(data.access_token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* BG glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-glow-brand pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 shadow-glow text-white font-bold">✦</span>
            <span className="font-display font-bold text-white text-xl">
              Career<span className="text-brand-400">Copilot</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="••••••••"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
