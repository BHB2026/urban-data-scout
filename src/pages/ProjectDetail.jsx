import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase }    from '../lib/supabase'
import { ISSUE_TYPES } from '../lib/constants'
import { formatDate }  from '../lib/utils'
import MapPicker       from '../components/MapPicker'

function Spinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-[3px] border-blue-200 border-t-blue-700 animate-spin" />
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project,    setProject]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [fetchError, setFetchError] = useState(null)

  // Form state
  const [location,   setLocation]   = useState(null)   // { lat, lng }
  const [issueType,  setIssueType]  = useState('')
  const [comment,    setComment]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError,  setFormError]  = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        setFetchError('Project not found or no longer active.')
      } else {
        setProject(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit() {
    if (!location) {
      setFormError('Please tap the map to drop a pin at your location of concern.')
      return
    }
    if (!issueType) {
      setFormError('Please select an issue type.')
      return
    }

    setFormError(null)
    setSubmitting(true)

    const { error } = await supabase.from('reports').insert({
      project_id: id,
      latitude:   location.lat,
      longitude:  location.lng,
      issue_type: issueType,
      comment:    comment.trim() || null,
    })

    if (error) {
      setFormError('Something went wrong. Please try again.')
      setSubmitting(false)
    } else {
      navigate(`/projects/${id}/thank-you`)
    }
  }

  if (loading)    return <Spinner />
  if (fetchError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{fetchError}</p>
          <Link to="/" className="mt-4 inline-block text-blue-700 hover:underline text-sm">
            ← Back to projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back link + project header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-800 text-sm font-medium mb-5 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform">
            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
          </svg>
          All projects
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{project.name}</h1>

        {project.description && (
          <p className="mt-2 text-gray-600 leading-relaxed max-w-3xl">{project.description}</p>
        )}

        {project.hearing_date && (
          <span className="mt-3 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Public Hearing: {formatDate(project.hearing_date)}
          </span>
        )}
      </div>

      {/* Two-column layout: map first on mobile (DOM order), form left on desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-10">

        {/* ── MAP (right column on desktop, first on mobile) ── */}
        <div className="lg:col-span-3 lg:order-2 mb-8 lg:mb-0">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Tap the map to pin your exact location
          </p>
          <MapPicker
            project={project}
            location={location}
            onLocationSelect={setLocation}
          />
          {location ? (
            <p className="mt-2 text-sm text-emerald-700 font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
              </svg>
              Location pinned ({location.lat.toFixed(5)}, {location.lng.toFixed(5)})
            </p>
          ) : (
            <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              No location selected yet — tap the map above
            </p>
          )}
        </div>

        {/* ── FORM (left column on desktop, second on mobile) ── */}
        <div className="lg:col-span-2 lg:order-1 space-y-7">

          {/* Step 1 label */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 1 of 3</span>
            <p className="mt-1 font-semibold text-gray-800">Where is your concern?</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Tap anywhere on the map to drop a pin at the exact location.
            </p>
          </div>

          {/* Step 2 – Issue type */}
          <div>
            <label htmlFor="issueType" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              Step 2 of 3
            </label>
            <p className="font-semibold text-gray-800 mb-2">What type of issue?</p>
            <select
              id="issueType"
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white appearance-none cursor-pointer"
            >
              <option value="">Select an issue type…</option>
              {ISSUE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Step 3 – Comment */}
          <div>
            <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              Step 3 of 3
            </label>
            <p className="font-semibold text-gray-800 mb-2">
              Add details{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </p>
            <textarea
              id="comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Describe what you experience here. What do you see, hear, or worry about?"
              maxLength={500}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         resize-none leading-relaxed"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
          </div>

          {/* Error */}
          {formError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mt-0.5 shrink-0" aria-hidden="true">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              {formError}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-base
                       hover:bg-blue-800 active:bg-blue-900 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Submitting…
              </>
            ) : (
              'Submit Report'
            )}
          </button>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Your submission is anonymous. No personal information is collected.
          </p>
        </div>
      </div>
    </main>
  )
}
