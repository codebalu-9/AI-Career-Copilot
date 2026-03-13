import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/resume',    label: 'Resume',    icon: '◈' },
  { to: '/interview', label: 'Interview', icon: '◎' },
  { to: '/skills',    label: 'Skills',    icon: '◆' },
]

export default function Navbar() {
  const { isAuth, user, logout } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to={isAuth ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 shadow-glow-sm text-white text-sm font-bold">
            ✦
          </span>
          <span className="font-display font-bold text-white text-lg hidden sm:block">
            Career<span className="text-brand-400">Copilot</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {isAuth && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? 'active' : ''}`}
              >
                <span className="text-xs opacity-70">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {isAuth ? (
            <>
              <span className="hidden sm:block text-xs text-slate-500 font-mono">
                {user?.full_name?.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs px-3 py-2"
              >
                Sign out
              </button>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="md:hidden btn-ghost p-1"
                aria-label="Menu"
              >
                <span className="text-lg">{menuOpen ? '✕' : '☰'}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary text-xs px-4 py-2">Get started</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isAuth && menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-surface-1/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`nav-link w-full ${location.pathname === to ? 'active' : ''}`}
            >
              <span className="text-xs opacity-70">{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
