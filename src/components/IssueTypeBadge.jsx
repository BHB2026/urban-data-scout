import { ISSUE_MAP } from '../lib/constants'

/**
 * Pill-shaped badge for an issue type.
 * size="sm" (default) | "md"
 */
export default function IssueTypeBadge({ type, size = 'sm' }) {
  const cfg = ISSUE_MAP[type] ?? ISSUE_MAP['other']
  const px  = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset
        ${px} ${cfg.badgeBg} ${cfg.badgeFg} ${cfg.ring}`}
    >
      {cfg.label}
    </span>
  )
}
