import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home       from './pages/Home.jsx'
import Login      from './pages/Login.jsx'
import Register   from './pages/Register.jsx'
import Dashboard  from './components/Dashboard.jsx'
import ResumeUpload from './components/ResumeUpload.jsx'
import InterviewPanel from './components/InterviewPanel.jsx'
import SkillGap   from './components/SkillGap.jsx'
import Navbar     from './components/Navbar.jsx'

// ── Auth Context ──────────────────────────────────────
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [token])

  const login = (tokenVal, userData) => {
    setToken(tokenVal)
    setUser(userData)
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuth: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// ── Protected Route ───────────────────────────────────
function Protected({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

// ── App Shell (with Navbar) ───────────────────────────
function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <Protected>
              <AppShell><Dashboard /></AppShell>
            </Protected>
          }/>
          <Route path="/resume" element={
            <Protected>
              <AppShell><ResumeUpload /></AppShell>
            </Protected>
          }/>
          <Route path="/interview" element={
            <Protected>
              <AppShell><InterviewPanel /></AppShell>
            </Protected>
          }/>
          <Route path="/skills" element={
            <Protected>
              <AppShell><SkillGap /></AppShell>
            </Protected>
          }/>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
