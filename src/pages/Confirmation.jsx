import { Link, useParams } from 'react-router-dom'

export default function Confirmation() {
  const { id } = useParams()

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Success icon */}
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center ring-8 ring-emerald-50/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#059669"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Thank you for your report.</h1>

        <p className="mt-3 text-gray-600 leading-relaxed">
          Your input helps decision-makers understand what residents experience on the ground.
          Every submission matters.
        </p>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/projects/${id}`}
            className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white
                       px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Submit another report
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700
                       border border-gray-300 px-6 py-3 rounded-xl font-semibold text-sm
                       hover:bg-gray-50 transition-colors"
          >
            Back to projects
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Urban Data Scout — Connecting communities to county decision-makers.
        </p>
      </div>
    </main>
  )
}
