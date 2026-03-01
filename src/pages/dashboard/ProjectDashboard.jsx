import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { supabase }         from '../../lib/supabase'
import { ISSUE_TYPES, ISSUE_MAP } from '../../lib/constants'
import { formatDate, formatDateTime, exportReportsCSV } from '../../lib/utils'
import IssueTypeBadge from '../../components/IssueTypeBadge'
import ReportsMap     from '../../components/ReportsMap'

function Spinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-[3px] border-blue-200 border-t-blue-700 animate-spin" />
    </div>
  )
}

// Stat card for the left panel
function StatCard({ label, value, accent }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ?? 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

export default function ProjectDashboard() {
  const { id } = useParams()

  const [project,   setProject]   = useState(null)
  const [reports,   setReports]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [fetchErr,  setFetchErr]  = useState(null)

  // Filter state
  const [filterType, setFilterType] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo,   setFilterTo]   = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: proj, error: pErr }, { data: reps, error: rErr }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('reports').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      ])

      if (pErr || !proj) { setFetchErr('Project not found.'); setLoading(false); return }
      if (rErr)          { setFetchErr(rErr.message);         setLoading(false); return }

      setProject(proj)
      setReports(reps ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  // Counts by issue type (all reports, unfiltered) for the chart
  const issueCounts = useMemo(() => {
    const tally = {}
    reports.forEach(r => { tally[r.issue_type] = (tally[r.issue_type] ?? 0) + 1 })
    return tally
  }, [reports])

  const chartData = ISSUE_TYPES
    .map(t => ({ name: t.label, count: issueCounts[t.value] ?? 0, color: t.color }))
    .filter(d => d.count > 0)

  // Filtered reports for the table + map + CSV export
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (filterType && r.issue_type !== filterType) return false
      if (filterFrom && new Date(r.created_at) < new Date(filterFrom + 'T00:00:00')) return false
      if (filterTo   && new Date(r.created_at) > new Date(filterTo   + 'T23:59:59')) return false
      return true
    })
  }, [reports, filterType, filterFrom, filterTo])

  const hasFilters = filterType || filterFrom || filterTo

  if (loading)  return <Spinner />
  if (fetchErr) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{fetchErr}</p>
          <Link to="/dashboard" className="mt-4 inline-block text-blue-700 hover:underline text-sm">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back link + header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-800 text-sm font-medium mb-4 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">
            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
          </svg>
          All projects
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="mt-1 text-gray-500 text-sm max-w-2xl">{project.description}</p>
            )}
            {project.hearing_date && (
              <span className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                Public Hearing: {formatDate(project.hearing_date)}
              </span>
            )}
          </div>

          {/* Export button */}
          <button
            onClick={() => exportReportsCSV(filteredReports, project.name)}
            disabled={filteredReports.length === 0}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700
                       px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            Export CSV {hasFilters && `(${filteredReports.length})`}
          </button>
        </div>
      </div>

      {/* Main split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT PANEL: stats + chart ── */}
        <div className="lg:col-span-1 space-y-5">

          <StatCard label="Total Reports" value={reports.length.toLocaleString()} accent="text-blue-700" />

          {reports.length === 0 ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-gray-400 text-sm">No reports yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Reports by Issue Type</h3>

              {/* Recharts horizontal bar chart */}
              <ResponsiveContainer width="100%" height={Math.max(chartData.length * 42, 80)}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#4B5563' }}
                    axisLine={false}
                    tickLine={false}
                    width={58}
                  />
                  <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    formatter={val => [`${val} report${val !== 1 ? 's' : ''}`, '']}
                    labelStyle={{ fontWeight: 600, color: '#111827' }}
                    contentStyle={{ border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13 }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {chartData.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Count badges below chart */}
              <div className="mt-4 space-y-2">
                {chartData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <IssueTypeBadge type={ISSUE_TYPES.find(t => t.label === d.name)?.value} />
                    <span className="font-semibold text-gray-700">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: map + filters + table ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Map */}
          <ReportsMap project={project} reports={filteredReports} />

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Issue type</label>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All types</option>
                  {ISSUE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[130px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1">From date</label>
                <input
                  type="date"
                  value={filterFrom}
                  onChange={e => setFilterFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex-1 min-w-[130px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1">To date</label>
                <input
                  type="date"
                  value={filterTo}
                  onChange={e => setFilterTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {hasFilters && (
                <button
                  onClick={() => { setFilterType(''); setFilterFrom(''); setFilterTo('') }}
                  className="text-sm text-gray-500 hover:text-red-600 font-medium px-2 py-2 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {hasFilters && (
              <p className="mt-2 text-xs text-gray-400">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            )}
          </div>

          {/* Reports table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">
                All Reports
                {filteredReports.length > 0 && (
                  <span className="ml-2 text-gray-400 font-normal">({filteredReports.length})</span>
                )}
              </h3>
            </div>

            {filteredReports.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-400 text-sm">
                  {hasFilters ? 'No reports match the current filters.' : 'No reports submitted yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Date', 'Issue', 'Comment', 'Coordinates'].map(h => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500">
                          {formatDateTime(report.created_at)}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <IssueTypeBadge type={report.issue_type} />
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700 max-w-xs">
                          {report.comment
                            ? <span className="line-clamp-2">{report.comment}</span>
                            : <span className="text-gray-300 italic">—</span>
                          }
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-400 font-mono">
                          {report.latitude.toFixed(5)},&nbsp;{report.longitude.toFixed(5)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
