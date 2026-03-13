import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
}

// ── Resume ────────────────────────────────────────────
export const resumeAPI = {
  upload: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  score:  (data)     => api.post('/resume/score', data),
  latest: ()         => api.get('/resume/latest'),
}

// ── Interview ─────────────────────────────────────────
export const interviewAPI = {
  generate: (data) => api.post('/interview/generate', data),
  evaluate: (data) => api.post('/interview/evaluate', data),
  history:  ()     => api.get('/interview/history'),
}

// ── Skills & Jobs ─────────────────────────────────────
export const skillsAPI = {
  analyze:        (role) => api.get(`/skills/analyze?role=${encodeURIComponent(role)}`),
  recommend:      ()     => api.get('/jobs/recommend'),
  dashboardStats: ()     => api.get('/dashboard/stats'),
}

export default api
