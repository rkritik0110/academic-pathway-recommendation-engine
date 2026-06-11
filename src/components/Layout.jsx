import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/submissions', label: 'Submissions' },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F1A]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0B0F1A]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-sm font-semibold text-gray-100 hidden sm:inline">
              Academic Pathway
            </span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  pathname === to
                    ? 'bg-gray-800 text-gray-100'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Academic Pathway Recommendation Engine
        </div>
      </footer>
    </div>
  );
}
