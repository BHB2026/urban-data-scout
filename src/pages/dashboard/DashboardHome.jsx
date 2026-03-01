import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase }   from '../../lib/supabase'
import { formatDate } from '../../lib/utils'

function Spinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-[3px] border-blue-200 border-t-blue-700 animate-spin" />
    </div>
  )
}

export default function DashboardHome() {
  const [projects, setProjects] = useState([])
  const [counts,   setCounts]   = useState({})   // { [projectId]: number }
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    async function load() {
      // Fetch all active projects
      const { data: projectData, error: pErr } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('hearing_date', { ascending: true })

      if (pErr) { setError(pErr.message); setLoading(false); return }

      const list = projectData ?? []
      setProjects(list)

      // Fetch report counts for every project in one query
      if (list.length > 0) {
        const { data: reportData } = await supabase
          .from('reports')
          .select('project_id')
          .in('project_id', list.map(p => p.id))

        const tally = {}
        list.forEach(p => (tally[p.id] = 0))
        ;(reportData ?? []).forEach(r => { tally[r.project_id] = (tally[r.project_id] ?? 0) + 1 })
        setCounts(tally)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">County Dashboard</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Select a project to view its map, resident reports, and summary statistics.
        </p>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-semibold text-gray-700">No active projects</p>
          <p className="mt-1 text-sm text-gray-500">Projects will appear here once they are seeded in the database.</p>
        </div>
      )}

      {/* Projects table */}
      {projects.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Project', 'Hearing Date', 'Total Reports', ''].map(col => (
                  <th
                    key={col}
                    className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm">{project.name}</p>
                    {project.description && (
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1 max-w-xs">
                        {project.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {project.hearing_date ? formatDate(project.hearing_date) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      {(counts[project.id] ?? 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/dashboard/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-800
                                 font-semibold text-sm hover:underline"
                    >
                      View Dashboard
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-400 text-center">
        Urban Data Scout — For authorized county staff use only.
      </p>
    </main>
  )
}
