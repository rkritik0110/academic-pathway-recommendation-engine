const PATHWAY_META = {
  'Certification Program': {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    accent: 'border-l-emerald-500',
  },
  'DBA': {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    accent: 'border-l-blue-500',
  },
  'PhD': {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    accent: 'border-l-violet-500',
  },
  'Honorary Doctorate': {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0m0 0a7.454 7.454 0 01-.982 3.172M12 9.728a7.454 7.454 0 00.981 3.172" />
      </svg>
    ),
    accent: 'border-l-amber-500',
  },
};

const PATHWAY_TAG = {
  'Certification Program': 'bg-emerald-500/10 text-emerald-400',
  'DBA': 'bg-blue-500/10 text-blue-400',
  'PhD': 'bg-violet-500/10 text-violet-400',
  'Honorary Doctorate': 'bg-amber-500/10 text-amber-400',
};

/**
 * Parse simple markdown into renderable sections.
 * Handles ## headings and bullet lists (- or *).
 */
function parseInsightsMarkdown(markdown) {
  const sections = [];
  let currentSection = null;

  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();

    // Heading (## or ###)
    const headingMatch = trimmed.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      currentSection = { title: headingMatch[1], content: [], bullets: [] };
      sections.push(currentSection);
      continue;
    }

    // Bullet point (- or *)
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch && currentSection) {
      currentSection.bullets.push(bulletMatch[1]);
      continue;
    }

    // Regular text
    if (trimmed && currentSection) {
      currentSection.content.push(trimmed);
    }
  }

  return sections;
}

export default function RecommendationCard({ recommendation, reason, aiInsights, onReset }) {
  const meta = PATHWAY_META[recommendation] || PATHWAY_META['Certification Program'];
  const tag = PATHWAY_TAG[recommendation] || 'bg-gray-500/10 text-gray-400';

  const parsedInsights = aiInsights ? parseInsightsMarkdown(aiInsights) : null;

  return (
    <div className="space-y-4">
      {/* Success banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-sm">
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        Profile analyzed successfully
      </div>

      {/* Result card */}
      <div className={`rounded-lg border border-gray-800 bg-gray-900 border-l-4 ${meta.accent} overflow-hidden`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">
            Recommended Pathway
          </p>
          <div className="flex items-center gap-3">
            <div className="text-gray-400">{meta.icon}</div>
            <h2 className="text-xl font-semibold text-gray-100">{recommendation}</h2>
            <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded ${tag}`}>
              Match
            </span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">
            Analysis
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {reason}
          </p>
        </div>

        {/* AI Insights */}
        <div className="px-5 py-4 border-t border-gray-800">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm">✨</span>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
              AI Insights
            </p>
          </div>

          {parsedInsights && parsedInsights.length > 0 ? (
            <div className="space-y-4">
              {parsedInsights.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-semibold text-gray-300 mb-1.5">
                    {section.title}
                  </h3>
                  {section.content.length > 0 && (
                    <p className="text-sm text-gray-400 leading-relaxed mb-1.5">
                      {section.content.join(' ')}
                    </p>
                  )}
                  {section.bullets.length > 0 && (
                    <ul className="space-y-1">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-gray-600 mt-1 flex-shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              AI insights are temporarily unavailable. Your recommendation has still been generated successfully.
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-blue-400 transition-colors duration-150"
      >
        ← Submit another profile
      </button>
    </div>
  );
}
