import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'

function Spinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-[3px] border-blue-200 border-t-blue-700 animate-spin" />
    </div>
  )
}

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('hearing_date', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        const list = data ?? []
        setProjects(list)
        // PRD: if exactly one active project, jump straight to it
        if (list.length === 1) {
          navigate(`/projects/${list[0].id}`, { replace: true })
        }
      }
      setLoading(false)
    }
    load()
  }, [navigate])

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Unable to load projects</p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

      {/* Page header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          Active Projects
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Share Your Community's Voice</h1>
        <p className="mt-3 text-gray-500 text-lg leading-relaxed">
          Choose a project below to submit a geo-tagged concern for county decision-makers.
        </p>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">🏙️</p>
          <p className="text-lg font-semibold text-gray-700">No active projects right now</p>
          <p className="mt-1 text-sm text-gray-500">
            Check back soon, or contact your county office for information.
          </p>
        </div>
      )}

      {/* Project cards */}
      <ul className="space-y-4">
        {projects.map(project => (
          <li
            key={project.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Blue accent strip */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>

              {project.description && (
                <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              )}

              {project.hearing_date && (
                <div className="mt-3 flex items-center gap-1.5 text-blue-700 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Hearing: {formatDate(project.hearing_date)}
                </div>
              )}

              <div className="mt-5">
                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 active:bg-blue-900 transition-colors"
                >
                  Report an Issue
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
