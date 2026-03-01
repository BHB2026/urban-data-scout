import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const isDashboard  = pathname.startsWith('/dashboard')

  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Urban Data Scout
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isDashboard
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              }`}
            >
              Report an Issue
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isDashboard
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}
