import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import EmptyState from './EmptyState';

const RECOMMENDATION_TAG = {
  'Certification Program': 'bg-emerald-500/10 text-emerald-400',
  'DBA': 'bg-blue-500/10 text-blue-400',
  'PhD': 'bg-violet-500/10 text-violet-400',
  'Honorary Doctorate': 'bg-amber-500/10 text-amber-400',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─── Tooltip ─── */
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const handleEnter = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 320)),
    });
    setShow(true);
  }, []);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
        className="cursor-default"
      >
        {children}
      </span>
      {show &&
        createPortal(
          <div
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[9999] max-w-xs rounded-md bg-gray-800 px-3 py-2 text-xs text-gray-200 leading-relaxed shadow-xl pointer-events-none border border-gray-700"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

/* ─── Skeleton ─── */
function SkeletonRows({ count = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex gap-4">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export default function SubmissionTable({ submissions, loading }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase().trim();
    return submissions.filter((s) => {
      const nameMatch = s.full_name?.toLowerCase().includes(q);
      const emailMatch = s.email?.toLowerCase().includes(q);
      const goalMatch = s.career_goal?.toLowerCase().includes(q);
      
      // Only match recommendation if a word starts with the query or it's an exact match
      // This prevents "ram" from matching the end of "Program"
      const recText = s.recommendation?.toLowerCase() || '';
      const recMatch = recText.includes(q) && (
        recText === q || 
        recText.split(' ').some(w => w.startsWith(q))
      );

      return nameMatch || emailMatch || goalMatch || recMatch;
    });
  }, [submissions, search]);

  if (loading) return <SkeletonRows />;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search submissions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 pl-9 pr-8 py-2 text-sm text-gray-100 placeholder:text-gray-600 outline-none transition-colors duration-150 hover:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          id="search-submissions"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-150"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Count */}
      {submissions.length > 0 && (
        <p className="text-xs text-gray-500">
          {filtered.length} of {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Content */}
      {submissions.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches" description={`Nothing matches "${search}". Try a different term.`} />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block rounded-lg border border-gray-800 overflow-auto max-h-[65vh]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-800 text-left">
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Career Goal</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Recommendation</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={`border-t border-gray-800/60 transition-colors duration-150 hover:bg-gray-800/40 ${
                      idx % 2 === 0 ? 'bg-[#0B0F1A]' : 'bg-gray-900/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-100 whitespace-nowrap">{s.full_name}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{s.email}</td>
                    <td className="px-4 py-3 text-gray-300 max-w-[240px]">
                      <Tooltip text={s.career_goal}>
                        <span className="block truncate">{s.career_goal}</span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${RECOMMENDATION_TAG[s.recommendation] || 'bg-gray-500/10 text-gray-400'}`}>
                        {s.recommendation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4 space-y-2.5 transition-colors duration-150 hover:bg-gray-800/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">{s.full_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{s.email}</p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${RECOMMENDATION_TAG[s.recommendation] || 'bg-gray-500/10 text-gray-400'}`}>
                    {s.recommendation}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{s.career_goal}</p>
                <p className="text-xs text-gray-600">{formatDate(s.created_at)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
