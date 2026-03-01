/**
 * Issue type definitions used across the resident form, dashboard,
 * map markers, and export CSV.
 */
export const ISSUE_TYPES = [
  {
    value:   'flooding',
    label:   'Flooding',
    color:   '#2563EB',
    badgeBg: 'bg-blue-100',
    badgeFg: 'text-blue-800',
    ring:    'ring-blue-600/20',
  },
  {
    value:   'traffic',
    label:   'Traffic',
    color:   '#D97706',
    badgeBg: 'bg-amber-100',
    badgeFg: 'text-amber-800',
    ring:    'ring-amber-600/20',
  },
  {
    value:   'noise',
    label:   'Noise',
    color:   '#7C3AED',
    badgeBg: 'bg-purple-100',
    badgeFg: 'text-purple-800',
    ring:    'ring-purple-600/20',
  },
  {
    value:   'access',
    label:   'Access',
    color:   '#059669',
    badgeBg: 'bg-emerald-100',
    badgeFg: 'text-emerald-800',
    ring:    'ring-emerald-600/20',
  },
  {
    value:   'schools',
    label:   'Schools',
    color:   '#DC2626',
    badgeBg: 'bg-red-100',
    badgeFg: 'text-red-800',
    ring:    'ring-red-600/20',
  },
  {
    value:   'other',
    label:   'Other',
    color:   '#6B7280',
    badgeBg: 'bg-gray-100',
    badgeFg: 'text-gray-700',
    ring:    'ring-gray-600/20',
  },
]

/** Keyed lookup by issue value */
export const ISSUE_MAP = Object.fromEntries(ISSUE_TYPES.map(t => [t.value, t]))
