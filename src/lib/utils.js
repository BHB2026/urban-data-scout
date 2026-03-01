/**
 * Format a date-only string (YYYY-MM-DD) from Supabase for display.
 * Uses noon UTC to avoid timezone-boundary day-shift issues.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  })
}

/**
 * Format a full ISO timestamp for display.
 */
export function formatDateTime(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

/**
 * Build and trigger a CSV download from an array of report objects.
 */
export function exportReportsCSV(reports, projectName) {
  const headers = ['Date', 'Issue Type', 'Comment', 'Latitude', 'Longitude']
  const rows = reports.map(r => [
    formatDateTime(r.created_at),
    r.issue_type,
    (r.comment || '').replace(/"/g, '""'),
    r.latitude.toFixed(6),
    r.longitude.toFixed(6),
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `${projectName.replace(/\s+/g, '-')}-reports-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
