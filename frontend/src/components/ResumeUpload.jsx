import { useState, useRef } from 'react'
import { resumeAPI } from '../services/api.js'

export default function ResumeUpload() {
  const fileRef = useRef(null)
  const [file,      setFile]      = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadRes, setUploadRes] = useState(null)
  const [jd,        setJd]        = useState('')
  const [scoring,   setScoring]   = useState(false)
  const [scoreRes,  setScoreRes]  = useState(null)
  const [error,     setError]     = useState('')
  const [drag,      setDrag]      = useState(false)

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.endsWith('.pdf')) {
      setError('Only PDF files are accepted.')
      return
    }
    setError('')
    setFile(f)
    setUploadRes(null)
    setScoreRes(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await resumeAPI.upload(fd)
      setUploadRes(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleScore = async () => {
    if (!uploadRes || !jd.trim()) return
    setScoring(true)
    setError('')
    try {
      const { data } = await resumeAPI.score({
        resume_id: uploadRes.resume_id,
        job_description: jd,
      })
      setScoreRes(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Scoring failed.')
    } finally {
      setScoring(false)
    }
  }

  const scoreColor = (s) => s >= 70 ? 'text-emerald-400' : s >= 50 ? 'text-amber-400' : 'text-rose-400'
  const scoreBarColor = (s) => s >= 70 ? 'from-emerald-600 to-emerald-400' : s >= 50 ? 'from-amber-600 to-amber-400' : 'from-rose-600 to-rose-400'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title text-3xl">Resume Analyzer</h1>
        <p className="section-sub">Upload your PDF resume and compare it against a job description</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`card cursor-pointer p-10 flex flex-col items-center justify-center gap-4 text-center
          border-2 border-dashed transition-all duration-200
          ${drag ? 'border-brand-400 bg-brand-500/10' : 'border-white/[0.1] hover:border-brand-500/40 hover:bg-white/[0.02]'}
          ${file ? 'border-brand-500/50 bg-brand-500/5' : ''}
        `}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-3xl">
          {file ? '📄' : '⬆'}
        </div>
        {file ? (
          <div>
            <div className="text-white font-medium">{file.name}</div>
            <div className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</div>
          </div>
        ) : (
          <div>
            <div className="text-slate-300 font-medium">Drop your PDF here</div>
            <div className="text-xs text-slate-500 mt-1">or click to browse · max 5 MB</div>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Upload button */}
      {file && !uploadRes && (
        <button onClick={handleUpload} disabled={uploading} className="btn-primary w-full py-3">
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Parsing resume…
            </span>
          ) : 'Analyze Resume →'}
        </button>
      )}

      {/* Upload result: detected skills */}
      {uploadRes && (
        <div className="card p-6 space-y-4 animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs">✓</span>
            <h2 className="font-display font-semibold text-white">Resume Parsed</h2>
          </div>
          <p className="text-sm text-slate-400">{uploadRes.message}</p>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">Detected Skills</p>
            <div className="flex flex-wrap gap-2">
              {uploadRes.extracted_skills.map(s => (
                <span key={s} className="skill-pill">{s}</span>
              ))}
              {uploadRes.extracted_skills.length === 0 && (
                <span className="text-slate-500 text-sm">No recognized skills found. Try a more detailed resume.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job description input */}
      {uploadRes && (
        <div className="card p-6 space-y-4 animate-fade-up">
          <h2 className="font-display font-semibold text-white">Compare with Job Description</h2>
          <p className="text-sm text-slate-400">Paste the job description to get an ATS match score and missing skills</p>
          <div>
            <label className="label">Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={6}
              placeholder="Paste the full job description here…"
              className="input resize-none font-mono text-xs leading-relaxed"
            />
          </div>
          <button
            onClick={handleScore}
            disabled={scoring || !jd.trim()}
            className="btn-primary w-full py-3"
          >
            {scoring ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scoring…
              </span>
            ) : 'Get ATS Score →'}
          </button>
        </div>
      )}

      {/* Score result */}
      {scoreRes && (
        <div className="card p-6 space-y-6 animate-fade-up">
          {/* Score bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-white text-xl">ATS Match Score</h2>
              <span className={`font-display font-extrabold text-4xl ${scoreColor(scoreRes.resume_score)}`}>
                {Math.round(scoreRes.resume_score)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill bg-gradient-to-r ${scoreBarColor(scoreRes.resume_score)}`}
                style={{ width: `${scoreRes.resume_score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Matching */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">
                ✓ Matching Skills ({scoreRes.matching_skills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scoreRes.matching_skills.map(s => (
                  <span key={s} className="skill-pill">{s}</span>
                ))}
                {!scoreRes.matching_skills.length && <span className="text-slate-600 text-sm">None matched</span>}
              </div>
            </div>

            {/* Missing */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">
                ✗ Missing Skills ({scoreRes.missing_skills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scoreRes.missing_skills.map(s => (
                  <span key={s} className="skill-pill-missing">{s}</span>
                ))}
                {!scoreRes.missing_skills.length && <span className="text-emerald-400 text-sm">All skills matched! 🎉</span>}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">💡 Recommendations</p>
            <ul className="space-y-2">
              {scoreRes.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-brand-400 shrink-0 mt-0.5">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
